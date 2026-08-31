/**
 * @empoweredvote/analytics — the shared PostHog wrapper for every EV app.
 *
 * One init, one typed track, one identity model. See README.md.
 */
export {
  init,
  track,
  identify,
  reset,
  pageview,
  pageleave,
  captureException,
  isEnabled,
  getClient,
  isFeatureEnabled,
  getFeatureFlag,
} from './client';

export type { AnalyticsConfig, AppName, Environment } from './config';
export type {
  EventMap,
  EventName,
  LandingEvents,
  EssentialsEvents,
  CompassEvents,
  CalibrationSurface,
  CalibrationStep,
  CalibrationEntryReason,
  CalibrationExitVia,
  ReadRankEvents,
  CtcEvents,
  TreasuryEvents,
} from './events';
