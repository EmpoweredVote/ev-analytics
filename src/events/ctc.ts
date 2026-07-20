/**
 * Civic Trivia Championships (ctc.empowered.vote).
 *
 * NEW instrumentation — CTC currently emits only $pageview. These events are
 * the planned Phase 1 catalog (routes: Dashboard → Play/Game → Leaderboard,
 * plus Signup/Login/Profile). Refine props against real call sites when the app
 * is wired up.
 */
export interface CtcEvents {
  /** A trivia game/round was started. */
  ctc_game_started: { mode?: string };
  /** A question was answered. */
  ctc_question_answered: {
    correct: boolean;
    topic?: string;
    /** Time-to-answer in milliseconds. */
    ms?: number;
  };
  /** A game was completed. */
  ctc_game_completed: {
    score: number;
    correct: number;
    total: number;
    xp?: number;
  };
  /** A game was abandoned before completion. */
  ctc_game_abandoned: { answered: number };
  /** The leaderboard was viewed. */
  ctc_leaderboard_viewed: void;
  /** Signup flow started. */
  ctc_signup_started: void;
  /** Signup completed (account created). */
  ctc_signup_completed: void;
  /** The profile page was viewed. */
  ctc_profile_viewed: void;
}
