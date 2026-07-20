/**
 * ev-landing (empowered.vote) — static marketing landing page.
 * Events map to the inline posthog.capture() calls in ev-landing/index.html.
 *
 * Convention: an event whose value is `void` takes no properties;
 * `track('landing_financials_clicked')` with no second argument.
 */
export interface LandingEvents {
  /** A tool card in the tools grid was clicked. */
  landing_tool_clicked: { tool: string };
  /** The hero call-to-action button was clicked. */
  landing_hero_cta_clicked: void;
  /** An outbound link to one of the EV apps was clicked. */
  landing_app_link_clicked: { app: string; href: string };
  /** The "talk to us" / contact affordance was clicked. */
  landing_talk_clicked: { location?: string };
  /** A link to financials.empowered.vote was clicked. */
  landing_financials_clicked: void;
  /** The feedback affordance was clicked. */
  landing_feedback_clicked: void;
  /** Scroll-depth milestone reached (e.g. 25/50/75/100). */
  landing_scroll_depth: { depth: number };
  /** Light/dark theme toggled. */
  landing_theme_toggled: { to: string };
}
