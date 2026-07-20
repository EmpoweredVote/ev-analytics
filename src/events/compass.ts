/**
 * CompassV2 (compass.empowered.vote) — political alignment quiz + calibration.
 * Typed from the posthog?.capture() call sites across CompassV2/src.
 */
export interface CompassEvents {
  /** Calibration flow started. */
  compass_calibration_started: { total_topics: number };
  /** A calibration question was answered. */
  compass_calibration_question_answered: {
    topic_id?: string | number;
    index?: number;
  };
  /** A calibration question was skipped. */
  compass_calibration_question_skipped: {
    topic_id?: string | number;
    index?: number;
  };
  /** Calibration completed (full flow, or a lens-scoped overlay). */
  compass_calibration_completed: {
    topics_answered?: number;
    lens?: string;
  };
  /** Calibration abandoned before completion. */
  compass_calibration_abandoned: {
    answered?: number;
    total?: number;
  };
  /** A quiz was started. */
  compass_quiz_started: {
    quiz_type: string;
    topic_count?: number;
    lens?: string;
  };
  /** A quiz question was answered. */
  compass_quiz_question_answered: {
    topic_id?: string | number;
    index?: number;
  };
  /** A quiz was completed. */
  compass_quiz_completed: { quiz_type: string; topics_answered: number };
  /** A quiz was abandoned before completion. */
  compass_quiz_abandoned: { quiz_type?: string; answered?: number };
  /** A politician was added to the comparison. */
  compass_politician_compared: {
    politician_id: string | number;
    politician_name: string;
  };
}
