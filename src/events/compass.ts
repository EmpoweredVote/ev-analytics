/**
 * CompassV2 (compass.empowered.vote) — political alignment quiz + calibration.
 * Typed from the track() call sites across CompassV2/src.
 */

/**
 * Which calibration surface sent the event.
 *
 * `overlay` is the onboarding overlay hosted by `CombinedPage` — the one nearly
 * every real user meets, because it opens ITSELF for anyone uncalibrated.
 * `full` is the standalone `/calibrate` page, which carries almost no traffic.
 *
 * ⚠ **Absent means `/calibrate`.** Nothing sent this prop before 2026-08-30, when
 * `compass_calibration_started` was a `/calibrate`-only event; the overlay began
 * sending the same event that day, so any funnel spanning that date must treat a
 * missing `surface` as `full` rather than as unknown.
 */
export type CalibrationSurface = 'overlay' | 'full';

/** A step of the onboarding overlay. */
export type CalibrationStep =
  | 'welcome'
  | 'lens_intro'
  | 'pick'
  | 'answer'
  | 'complete';

/**
 * Why the calibration overlay is on screen — whether it was shown to someone or
 * asked for by them. The overlay auto-routes uncalibrated visitors, so without
 * this the two are indistinguishable.
 *
 * `unknown` is what a caller that did not pass a reason reports; it means the
 * instrumentation is incomplete, not that the reason was unknowable.
 */
export type CalibrationEntryReason =
  | 'auto_uncalibrated'
  | 'auto_unanswered_topics'
  | 'lens_link'
  | 'user_requested'
  | 'unknown';

/**
 * How someone left a calibration they did not finish. A reversal and a decision
 * are different signals: `back` is the Back arrow on question one, which exits
 * the flow as a side effect of navigating.
 */
export type CalibrationExitVia = 'dismiss' | 'back';

export interface CompassEvents {
  /**
   * Calibration genuinely began — a deliberate act, not the flow merely being on
   * screen. From the overlay this means the user pressed through the welcome
   * screen, or the overlay opened PAST welcome (resume / lens / recalibrate),
   * where there is no press to wait for.
   *
   * ⚠ Sent by both surfaces since 2026-08-30; see {@link CalibrationSurface}.
   * Compare `compass_quiz_started`, which only means the flow appeared.
   */
  compass_calibration_started: {
    total_topics: number;
    surface?: CalibrationSurface;
    /** Overlay only: the step the start was triggered from. */
    from_step?: CalibrationStep;
    lens?: string;
  };
  /** A calibration question was answered. */
  compass_calibration_question_answered: {
    topic_slug: string;
    /** Includes the answer being reported, so it reads as a progress curve. */
    answered_count: number;
    total_topics: number;
    surface?: CalibrationSurface;
    /** Overlay only: whether the answer was a pre-written stance or a write-in. */
    answer_type?: 'write_in' | 'stance';
  };
  /** A calibration question was skipped. */
  compass_calibration_question_skipped: {
    topic_slug: string;
    answered_count: number;
    total_topics: number;
    surface?: CalibrationSurface;
  };
  /**
   * Calibration completed. Fires from the full calibration flow (with answer
   * counts) and from the lens-scoped overlay (with the lens), so every prop is
   * optional.
   *
   * ⚠ From the overlay this fires when the user LEAVES the celebration screen,
   * not when they reach it — so finishing and then closing the tab is neither a
   * completion nor an abandonment. Known gap, tracked in CompassV2.
   */
  compass_calibration_completed: {
    answered_count?: number;
    total_topics?: number;
    lens?: string;
    surface?: CalibrationSurface;
  };
  /**
   * Calibration abandoned before completion.
   *
   * Leaving the overlay mid-answers with enough answered to keep a compass is
   * deliberately NOT this: that path ends on the complete step and reports a
   * completion whose `answered_count < total_topics`.
   */
  compass_calibration_abandoned: {
    answered_count: number;
    total_topics: number;
    progress_pct: number;
    surface?: CalibrationSurface;
    /** Overlay only: which step the exit happened from. */
    exit_from?: CalibrationStep;
    /** Overlay only: the gesture that caused it. */
    exit_via?: CalibrationExitVia;
  };
  /**
   * A quiz was started — or, from the calibration overlay, THE FLOW APPEARED.
   *
   * 🔴 This is not an intent signal from the overlay. It fires when the overlay
   * mounts, and the overlay mounts itself for anyone uncalibrated, so it counts
   * appearances rather than decisions. Use `compass_calibration_started` for
   * "someone chose to begin"; use this with `entry_reason` to ask "who was this
   * shown to".
   */
  compass_quiz_started: {
    quiz_type: string;
    topic_count?: number;
    lens?: string;
    surface?: CalibrationSurface;
    /** Overlay only: the step the flow opened on. */
    entry_step?: CalibrationStep;
    /** Overlay only: shown vs. asked for. */
    entry_reason?: CalibrationEntryReason;
    /** Overlay only: resuming a part-finished calibration. */
    resume?: boolean;
  };
  /** A quiz question was answered. */
  compass_quiz_question_answered: {
    quiz_type: string;
    question_index: number;
    questions_total: number;
    topic_slug: string;
    answer_type: 'write_in' | 'stance';
  };
  /** A quiz was completed. */
  compass_quiz_completed: { quiz_type: string; topics_answered: number };
  /** A quiz was abandoned before completion. */
  compass_quiz_abandoned: {
    quiz_type: string;
    question_index: number;
    questions_total: number;
    topic_slug?: string;
  };
  /** A politician was added to the comparison. */
  compass_politician_compared: {
    politician_id: string | number;
    politician_name: string;
  };
}
