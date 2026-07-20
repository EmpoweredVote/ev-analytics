/**
 * read-rank (readrank.empowered.vote) — blind candidate evaluation game.
 * Typed from the track() call sites across read-rank/src.
 */
export interface ReadRankEvents {
  /** Light/dark theme toggled. */
  readrank_theme_toggled: { to: string };
  /** User initiated sign-in (redirect to the accounts hub). */
  readrank_sign_in_initiated: void;
  /** User signed out. */
  readrank_signed_out: void;
  /** Practice round started from the landing screen. */
  readrank_practice_started: void;
  /** Address entered to find local races. */
  readrank_address_searched: { state?: string; matched_count: number };
  /** A race was started. */
  readrank_race_started: {
    race_id: string;
    office?: string;
    [key: string]: unknown;
  };
  /** Issue/topic selection confirmed for a race. */
  readrank_issue_selection_confirmed: {
    race_id: string;
    topics_selected: number;
  };
  /** A verdict (agree/disagree) was cast on a quote. */
  readrank_verdict: {
    verdict: string;
    race_id?: string;
    [key: string]: unknown;
  };
  /** The ranked ballot was revealed at the end of a race. */
  readrank_ballot_revealed: { race_id: string; agreed_count: number };
  /** Anonymous verdicts were promoted onto a newly-identified account. */
  readrank_verdicts_promoted: { count: number };
  /** A candidate's details were expanded on the ballot. */
  readrank_candidate_details_expanded: {
    candidate_id: string;
    rank?: number;
  };
  /** The cross-link to the Essentials profile was clicked. */
  readrank_essentials_link_clicked: { candidate_id: string; rank?: number };
  /** "Play again" clicked from the results screen. */
  readrank_play_again_clicked: void;
}
