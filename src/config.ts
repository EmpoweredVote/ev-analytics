import type { CaptureResult } from 'posthog-js';

/**
 * Every Empowered Vote app that reports to PostHog. Stamped on each event as the
 * `app` super-property so a single shared project can be sliced per-app, and so
 * the strict event catalog can enforce the `<app>_<object>_<action>` convention.
 */
export type AppName =
  | 'landing'
  | 'essentials'
  | 'compass'
  | 'readrank'
  | 'ctc'
  | 'treasury';

/** Deployment environment, stamped on every event as `environment`. */
export type Environment = 'production' | 'preview' | 'development';

export interface AnalyticsConfig {
  /** Which app is initializing. Stamped on every event as `app`. */
  app: AppName;

  /**
   * PostHog project key. Pass it from the consumer's env, e.g.
   * `import.meta.env.VITE_POSTHOG_KEY`.
   *
   * When falsy, analytics runs in **no-op mode**: nothing is sent and nothing
   * throws. This is how dev/preview traffic is kept out of production data —
   * leave the env var unset locally and every call below becomes a no-op.
   */
  key: string | undefined;

  /** Ingestion host. Defaults to the EV US cloud host. */
  host?: string;

  /**
   * Environment tag. When omitted it is inferred from the hostname:
   * localhost / *.local → development, *.onrender.com or hosts containing
   * `preview` / `-pr-` → preview, everything else → production.
   */
  environment?: Environment;

  /** Person-profile mode. Defaults to 'identified_only' (matches every EV app). */
  personProfiles?: 'always' | 'identified_only';

  /**
   * Auto-capture pageviews. Defaults to false — EV apps are SPAs and capture
   * pageviews manually on route changes via `pageview()`.
   */
  capturePageview?: boolean;

  /** Capture unhandled exceptions + promise rejections. Defaults to true. */
  captureExceptions?: boolean;

  /** Auto-capture dead clicks. Defaults to false. */
  captureDeadClicks?: boolean;

  /**
   * Enable session replay (rrweb). Defaults to **false**. rrweb serializes DOM
   * mutations on the main thread and pegged it on search-heavy pages
   * (treasury-tracker, essentials). Turn this on per-app — sampled and masked —
   * only where the replay value beats the perf cost.
   */
  sessionRecording?: boolean;

  /**
   * Extra `before_send` hook, run AFTER the built-in noise filter. Return null
   * to drop an event. Use for app-specific redaction or filtering.
   */
  beforeSend?: (event: CaptureResult | null) => CaptureResult | null;

  /** PostHog verbose debug logging. Defaults to false. */
  debug?: boolean;
}

/** Best-effort environment inference from the current hostname. */
export function inferEnvironment(): Environment {
  if (typeof window === 'undefined') return 'development';
  const host = window.location.hostname;
  if (host === 'localhost' || host === '127.0.0.1' || host.endsWith('.local')) {
    return 'development';
  }
  if (
    host.endsWith('.onrender.com') ||
    host.includes('preview') ||
    host.includes('-pr-')
  ) {
    return 'preview';
  }
  return 'production';
}
