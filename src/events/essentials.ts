/**
 * essentials (essentials.empowered.vote) — the who-represents-me app.
 * Typed from the posthog?.capture() call sites across essentials/src.
 */
export interface EssentialsEvents {
  /** Results view tab switched (e.g. overview → voting record). */
  essentials_tab_switched: { from: string; to: string };
  /** Address entered, via autocomplete selection or manual entry. */
  essentials_address_searched: { method: 'autocomplete' | 'manual' };
  /** A browse-by-area shortcut was clicked from the landing screen. */
  essentials_browse_area_clicked: {
    label?: string;
    type?: 'government_list' | 'geo' | 'address' | (string & {});
    state?: string | null;
  };
  /** A locality search result was selected. */
  essentials_locality_searched: {
    label: string;
    state?: string;
    kind?: string;
  };
  /** A politician profile was opened/viewed. */
  essentials_politician_viewed: {
    level?: 'federal' | 'state' | 'local' | (string & {});
    district_type?: string;
    office_title?: string;
  };
  /** A candidate row/card was clicked. */
  essentials_candidate_clicked: { candidate_id: string };
  /** A results filter changed. */
  essentials_filter_changed: { filter_type: string; value: unknown };
  /** The embedded Compass mode was toggled on/off. */
  essentials_compass_mode_toggled: { enabled: boolean };
  /** A Compass lens was explicitly selected on the results view. */
  essentials_compass_lens_selected: { lens: string; tab: string };
  /** Stance alignment slider set to an extreme (from the results Compass). */
  essentials_stance_alignment_set: { alignment: 'max' | 'min' };
  /** Stance alignment set from a politician profile Compass card. */
  essentials_compass_stance_alignment_set: {
    alignment: 'max' | 'min';
    context: string;
  };
  /** The local-lens toggle on a Compass card was changed. */
  essentials_compass_local_lens_toggled: { active: boolean };
  /** Voting-record filter changed. */
  essentials_voting_record_filter_changed: { filter: string };
  /** A bill/council file was opened from the voting record. */
  essentials_voting_record_bill_opened: void;
  /** Voting-record pagination. */
  essentials_voting_record_page_changed: { direction: 'prev' | 'next' };
  /** A truncated bio was expanded. */
  essentials_bio_expanded: void;
  /** An expanded bio was collapsed. */
  essentials_bio_collapsed: void;
  /** Campaign-finance donor search performed. */
  essentials_donor_searched: { query_length: number; has_results: boolean };
  /** Campaign-finance election cycle changed. */
  essentials_campaign_finance_cycle_changed: { cycle: string };
}
