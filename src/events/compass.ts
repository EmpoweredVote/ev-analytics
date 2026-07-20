/**
 * CompassV2 (compass.empowered.vote) — political alignment quiz + calibration.
 * Typed from the track() call sites across CompassV2/src.
 */
export interface CompassEvents {
  /** Calibration flow started. */
  compass_calibration_started: { total_topics: number };
  /** A calibration question was answered. */
  compass_calibration_question_answered: {
    topic_slug: string;
    answered_count: number;
    total_topics: number;
  };
  /** A calibration question was skipped. */
  compass_calibration_question_skipped: {
    topic_slug: string;
    answered_count: number;
    total_topics: number;
  };
  /**
   * Calibration completed. Fires from the full calibration flow (with answer
   * counts) and from the lens-scoped overlay (with the lens), so every prop is
   * optional.
   */
  compass_calibration_completed: {
    answered_count?: number;
    total_topics?: number;
    lens?: string;
  };
  /** Calibration abandoned before completion. */
  compass_calibration_abandoned: {
    answered_count: number;
    total_topics: number;
    progress_pct: number;
  };
  /** A quiz was started. */
  compass_quiz_started: {
    quiz_type: string;
    topic_count?: number;
    lens?: string;
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
