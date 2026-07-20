import posthog, {
  type PostHog,
  type CaptureResult,
} from 'posthog-js';
import {
  type AnalyticsConfig,
  type Environment,
  inferEnvironment,
} from './config';
import { type EventName, type TrackArgs } from './events';

/**
 * Whether analytics is live. False in no-op mode (no key configured) so every
 * exported function short-circuits — nothing sends, nothing throws. This is how
 * local dev is kept out of production data.
 */
let enabled = false;

/**
 * Exception signatures that are noise, not actionable bugs — never worth an
 * ingested event. Browser-extension errors are already dropped by posthog-js
 * (captureExtensionExceptions defaults off); the extension pattern is
 * belt-and-suspenders.
 */
const NOISE_EXCEPTION_PATTERNS: RegExp[] = [
  /ResizeObserver loop (limit exceeded|completed with undelivered notifications)/i,
  /^Script error\.?$/i,
  /Non-Error promise rejection captured/i,
  /(Failed to fetch|NetworkError when attempting to fetch|Load failed|The operation was aborted|AbortError|The user aborted a request)/i,
  /(chrome|moz|safari|safari-web)-extension:\/\//i,
];

/** First entry of the SDK's structured `$exception_list`, if present. */
function firstException(
  result: CaptureResult,
): Record<string, unknown> | undefined {
  const list = result.properties?.$exception_list;
  return Array.isArray(list) && list.length ? list[0] : undefined;
}

function exceptionHaystack(result: CaptureResult): string {
  const first = firstException(result);
  const type = first?.$exception_type ?? '';
  const message =
    first?.$exception_message ?? result.properties?.$exception_message ?? '';
  const stack = first?.$exception_stack_trace_raw ?? '';
  return `${type}: ${message}\n${
    typeof stack === 'string' ? stack : JSON.stringify(stack)
  }`;
}

// Client-side de-dup: identical exceptions within this window collapse to one
// event, so a tight loop or a mass-affecting error can't spike ingestion.
const DEDUP_WINDOW_MS = 5_000;
const recentExceptions = new Map<string, number>();

function isDuplicateException(result: CaptureResult, now: number): boolean {
  const first = firstException(result);
  const fingerprint = `${first?.$exception_type ?? ''}|${
    first?.$exception_message ?? result.properties?.$exception_message ?? ''
  }`;
  const last = recentExceptions.get(fingerprint);
  if (last !== undefined && now - last < DEDUP_WINDOW_MS) return true;
  recentExceptions.set(fingerprint, now);

  // Keep the map from growing unbounded over a long-lived session.
  if (recentExceptions.size > 200) {
    for (const [key, ts] of recentExceptions) {
      if (now - ts > DEDUP_WINDOW_MS) recentExceptions.delete(key);
    }
  }
  return false;
}

function makeBeforeSend(
  extra?: AnalyticsConfig['beforeSend'],
): (result: CaptureResult | null) => CaptureResult | null {
  return (result) => {
    if (!result) return result;
    if (result.event === '$exception') {
      if (NOISE_EXCEPTION_PATTERNS.some((re) => re.test(exceptionHaystack(result)))) {
        return null;
      }
      if (isDuplicateException(result, Date.now())) return null;
    }
    return extra ? extra(result) : result;
  };
}

/**
 * Initialize analytics for an app. Call once at startup, before any track().
 * When `config.key` is falsy this becomes a no-op (see {@link AnalyticsConfig}).
 */
export function init(config: AnalyticsConfig): void {
  const { app, key } = config;

  if (!key) {
    enabled = false;
    return;
  }

  const environment: Environment = config.environment ?? inferEnvironment();
  const host = config.host ?? 'https://us.i.posthog.com';

  posthog.init(key, {
    api_host: host,
    // Preset matching every existing EV app; keeps behavior consistent.
    defaults: '2026-01-30',
    person_profiles: config.personProfiles ?? 'identified_only',
    capture_pageview: config.capturePageview ?? false,
    capture_dead_clicks: config.captureDeadClicks ?? false,
    // Error tracking on by default — the SDK is already loaded; this is free.
    capture_exceptions: config.captureExceptions ?? true,
    // Share the anonymous distinct_id across every *.empowered.vote subdomain so
    // anonymous cross-app journeys stitch automatically.
    cross_subdomain_cookie: true,
    // rrweb is expensive; opt in per-app (see AnalyticsConfig.sessionRecording).
    disable_session_recording: !(config.sessionRecording ?? false),
    before_send: makeBeforeSend(config.beforeSend),
    debug: config.debug ?? false,
  });

  // Stamp every event with app + environment for per-app / per-env slicing.
  posthog.register({ app, environment });

  enabled = true;
}

/**
 * Capture a custom event. The event name must be in the catalog; its properties
 * are typed per event. `void` events take no second argument.
 */
export function track<K extends EventName>(
  event: K,
  ...args: TrackArgs<K>
): void {
  if (!enabled) return;
  posthog.capture(event, args[0] as Record<string, unknown> | undefined);
}

/**
 * Associate the current (anonymous) session with a signed-in user. Pass the
 * **Connected Account UUID** (`/account/me` → `id`) so the same person stitches
 * across every EV app.
 */
export function identify(
  distinctId: string,
  props?: Record<string, unknown>,
): void {
  if (!enabled || !distinctId) return;
  posthog.identify(distinctId, props);
}

/** Clear identity on sign-out so a shared device doesn't blend two people. */
export function reset(): void {
  if (!enabled) return;
  posthog.reset();
}

/** Manually capture a pageview (EV apps are SPAs; call on route change). */
export function pageview(props?: Record<string, unknown>): void {
  if (!enabled) return;
  posthog.capture('$pageview', props);
}

/** Manually capture a pageleave (pair with {@link pageview}). */
export function pageleave(): void {
  if (!enabled) return;
  posthog.capture('$pageleave');
}

/** Report a caught exception (e.g. from a React error boundary). */
export function captureException(
  error: unknown,
  props?: Record<string, unknown>,
): void {
  if (!enabled) return;
  posthog.captureException(error, props);
}

/** True when a key is configured and analytics will actually send. */
export function isEnabled(): boolean {
  return enabled;
}

/**
 * The underlying PostHog client — always the singleton, even in no-op mode, so
 * `<PostHogProvider client={getClient()}>` and feature-flag/survey APIs work.
 * Prefer the typed helpers above for event capture.
 */
export function getClient(): PostHog {
  return posthog;
}

/** Feature flag: whether a flag is enabled for the current person. */
export function isFeatureEnabled(flag: string): boolean | undefined {
  if (!enabled) return undefined;
  return posthog.isFeatureEnabled(flag);
}

/** Feature flag: the variant value for a multivariate flag. */
export function getFeatureFlag(
  flag: string,
): boolean | string | undefined {
  if (!enabled) return undefined;
  return posthog.getFeatureFlag(flag);
}
