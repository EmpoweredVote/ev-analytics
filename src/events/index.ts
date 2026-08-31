import type { LandingEvents } from './landing';
import type { EssentialsEvents } from './essentials';
import type { CompassEvents } from './compass';
import type { ReadRankEvents } from './readrank';
import type { CtcEvents } from './ctc';
import type { TreasuryEvents } from './treasury';

export type { LandingEvents } from './landing';
export type { EssentialsEvents } from './essentials';
export type { CompassEvents } from './compass';
export type {
  CalibrationSurface,
  CalibrationStep,
  CalibrationEntryReason,
  CalibrationExitVia,
} from './compass';
export type { ReadRankEvents } from './readrank';
export type { CtcEvents } from './ctc';
export type { TreasuryEvents } from './treasury';

/**
 * The master catalog of every custom event any EV app may send. This is the
 * single source of truth: `track()` accepts only these names, and each event's
 * value is its required property shape (`void` = no properties).
 *
 * To add an event: add it to the relevant per-app interface above, then cut a
 * release. Consumers pick up the new type via the autobump PR.
 */
export interface EventMap
  extends LandingEvents,
    EssentialsEvents,
    CompassEvents,
    ReadRankEvents,
    CtcEvents,
    TreasuryEvents {}

/** Union of every valid custom event name. */
export type EventName = keyof EventMap;

/** track() argument tuple: no props for `void` events, required props otherwise. */
export type TrackArgs<K extends EventName> = EventMap[K] extends void
  ? []
  : [props: EventMap[K]];
