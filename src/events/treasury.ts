/**
 * treasury-tracker (treasurytracker.empowered.vote / financials.empowered.vote)
 * — government budget explorer.
 *
 * NEW instrumentation — treasury-tracker currently emits only $pageview. These
 * events are the planned Phase 1 catalog (entity → visualize → drill → line item
 * → donate). Refine props against real call sites when the app is wired up.
 */
export interface TreasuryEvents {
  /** A government entity/jurisdiction was selected. */
  treasury_entity_selected: { entity: string; level?: string };
  /** The budget visualization mode was changed. */
  treasury_visualization_changed: {
    view: 'icicle' | 'sunburst' | 'tree' | (string & {});
  };
  /** A budget category was drilled into. */
  treasury_category_drilled: { category?: string; depth?: number };
  /** A line item was opened/viewed. */
  treasury_line_item_viewed: { category?: string; label?: string };
  /** A linked transaction was viewed. */
  treasury_transaction_viewed: { transaction_id?: string };
  /** Budget search performed. */
  treasury_search: { query_length: number; has_results?: boolean };
  /** The fiscal year selector changed. */
  treasury_year_changed: { year: number | string };
  /** The donate affordance was clicked (opens the DonateModal). */
  treasury_donate_clicked: void;
}
