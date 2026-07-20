# @empoweredvote/analytics

The shared PostHog wrapper for every Empowered Vote app. One init, one **typed
event catalog**, one cross-app identity model. Replaces the copy-pasted
`posthog.init(...)` + ad-hoc `posthog.capture('some_string')` in each app.

## Why this exists

All EV apps report to **one** PostHog project, distinguished by an `app`
super-property. Before this package, each app hand-rolled its own init and event
names, which drifted (duplicate `tab_switched` vs `essentials_tab_switched`
events, apps with no identity call, dev traffic polluting prod). This package is
the single source of truth that keeps them consistent.

## Install

```bash
npm install @empoweredvote/analytics posthog-js
```

`posthog-js` is a peer dependency (`>=1.376`).

## Usage

### 1. Initialize once, at startup

```ts
import { init } from '@empoweredvote/analytics';

init({
  app: 'essentials',                       // stamped on every event
  key: import.meta.env.VITE_POSTHOG_KEY,   // unset locally = no-op mode
  // environment is inferred from hostname; override if needed
});
```

**No-op mode:** when `key` is falsy (e.g. a local `.env` without it), every call
below is a silent no-op — nothing sends, nothing throws. This is how dev/preview
traffic is kept out of production data. Set `VITE_POSTHOG_KEY` only in the
deployed environments you want to count.

Every event is auto-stamped with `app` and `environment`
(`production | preview | development`) so the shared project slices cleanly.

### 2. Track — names and props are typed

```ts
import { track } from '@empoweredvote/analytics';

track('essentials_address_searched', { method: 'manual' }); // ✅
track('essentials_tab_switched', { from: 'overview', to: 'finance' }); // ✅
track('landing_financials_clicked'); // ✅ void event, no props

track('made_up_event');                       // ✗ compile error: unknown event
track('essentials_address_searched', {});     // ✗ compile error: missing props
track('essentials_address_searched', { method: 'telepathy' }); // ✗ not in union
```

A typo or ad-hoc event name is a **TypeScript build error**. This is the
guardrail that prevents catalog drift. To add an event, add it to the relevant
file in `src/events/` and cut a release.

### 3. Identity — the same person across every app

```ts
import { identify, reset } from '@empoweredvote/analytics';

// On login — pass the Connected Account UUID (/account/me → id) so the SAME
// person stitches across landing → essentials → compass → readrank → ctc.
identify(accountId);

// On logout — always reset so a shared device doesn't blend two people.
reset();
```

Anonymous journeys already stitch across `*.empowered.vote` subdomains via the
shared cross-subdomain cookie (enabled by default here).

### 4. SPA pageviews

```ts
import { pageview, pageleave } from '@empoweredvote/analytics';
// call on route change (auto pageview capture is off by default)
```

### 5. Error tracking

`capture_exceptions` is **on by default** — unhandled errors and promise
rejections are captured automatically, with a built-in noise filter (drops
ResizeObserver/extension/aborted-fetch junk) and 5s fingerprint de-dup so an
error loop can't spike ingestion.

React render errors aren't seen by autocapture, so wrap the app in the error
boundary from the `/react` subpath (React-only; not pulled into non-React
bundles):

```tsx
import { AppErrorBoundary } from '@empoweredvote/analytics/react';

<AppErrorBoundary>
  <App />
</AppErrorBoundary>
```

For manually caught errors, `captureException` is on the main export:

```ts
import { captureException } from '@empoweredvote/analytics';
```

### 6. Escape hatch

```ts
import { getClient, isFeatureEnabled, getFeatureFlag } from '@empoweredvote/analytics';
// getClient() returns the raw PostHog singleton (feature flags, surveys, etc.)
// and works with <PostHogProvider client={getClient()}>.
```

## Config reference

See `AnalyticsConfig` in [`src/config.ts`](src/config.ts). Notable defaults:

| Option | Default | Note |
|---|---|---|
| `personProfiles` | `identified_only` | matches every existing EV app |
| `capturePageview` | `false` | SPAs capture manually |
| `captureExceptions` | `true` | error tracking on |
| `sessionRecording` | `false` | rrweb is expensive; opt in per-app, sampled + masked |
| `captureDeadClicks` | `false` | |

## Releasing

See [PUBLISHING.md](PUBLISHING.md). Bump, tag, push — CI publishes to npm via
OIDC and opens autobump PRs in every consumer repo.
