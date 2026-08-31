/**
 * Compile-time test: the compass catalog vs. the payloads CompassV2 actually
 * sends. Not bundled (tsup only builds index.ts + react.tsx) and never called —
 * `tsc --noEmit` is the assertion, so CI fails if the two drift apart.
 *
 * This file exists because they DID drift: the props added on 2026-08-30
 * (`surface`, `entry_step`, `entry_reason`, `from_step`, `exit_from`,
 * `exit_via`, `answer_type`) flowed through `track()` for a while before the
 * catalog described them, since `track()` does not validate at runtime. A
 * catalog nobody can trust is worse than no catalog.
 *
 * When a compass call site changes, update this file in the same PR.
 */
import { track } from '../client';

/* eslint-disable @typescript-eslint/no-unused-vars */
export function __compassCatalogTypeTest(): void {
  // --- CalibrationOverlay.jsx (via src/lib/calibrationEvents.js) ---------------
  track('compass_quiz_started', {
    quiz_type: 'calibration', lens: 'default', surface: 'overlay',
    entry_step: 'welcome', entry_reason: 'auto_uncalibrated', resume: false,
  });
  track('compass_quiz_started', {
    quiz_type: 'calibration', lens: 'federal_lens', surface: 'overlay',
    entry_step: 'lens_intro', entry_reason: 'lens_link', resume: false, topic_count: 8,
  });
  track('compass_calibration_started', {
    total_topics: 8, surface: 'overlay', from_step: 'welcome', lens: 'default',
  });
  track('compass_calibration_question_answered', {
    topic_slug: 'climate-change', answered_count: 3, total_topics: 8,
    surface: 'overlay', answer_type: 'stance',
  });
  track('compass_calibration_question_answered', {
    topic_slug: 'housing', answered_count: 1, total_topics: 8,
    surface: 'overlay', answer_type: 'write_in',
  });
  track('compass_calibration_question_skipped', {
    topic_slug: 'taxes', answered_count: 2, total_topics: 8, surface: 'overlay',
  });
  track('compass_calibration_completed', {
    answered_count: 7, total_topics: 8, lens: 'default', surface: 'overlay',
  });
  track('compass_calibration_abandoned', {
    answered_count: 0, total_topics: 0, progress_pct: 0,
    exit_from: 'welcome', exit_via: 'dismiss', surface: 'overlay',
  });
  track('compass_calibration_abandoned', {
    answered_count: 0, total_topics: 8, progress_pct: 0,
    exit_from: 'answer', exit_via: 'back', surface: 'overlay',
  });
  // The unknown entry reason a caller that passes nothing reports.
  track('compass_quiz_started', {
    quiz_type: 'calibration', lens: 'resume', surface: 'overlay',
    entry_step: 'answer', entry_reason: 'unknown', resume: true, topic_count: 8,
  });

  // --- FullCalibration.jsx ----------------------------------------------------
  track('compass_calibration_started', { total_topics: 44, surface: 'full' });
  track('compass_calibration_question_answered', {
    topic_slug: 'taxes', answered_count: 5, total_topics: 44, surface: 'full',
  });
  track('compass_calibration_question_skipped', {
    topic_slug: 'taxes', answered_count: 5, total_topics: 44, surface: 'full',
  });
  track('compass_calibration_completed', {
    answered_count: 44, total_topics: 44, surface: 'full',
  });
  track('compass_calibration_abandoned', {
    answered_count: 5, total_topics: 44, progress_pct: 11, surface: 'full',
  });

  // --- Quiz.jsx: must still typecheck WITHOUT the new props -------------------
  track('compass_quiz_started', { quiz_type: 'daily', topic_count: 5 });
  track('compass_quiz_question_answered', {
    quiz_type: 'daily', question_index: 0, questions_total: 5,
    topic_slug: 'taxes', answer_type: 'stance',
  });
  track('compass_quiz_completed', { quiz_type: 'daily', topics_answered: 5 });

  // --- Negative controls: each of these MUST be an error ----------------------
  // @ts-expect-error surface is a closed union, not any string
  track('compass_calibration_started', { total_topics: 8, surface: 'popup' });
  // @ts-expect-error exit_via does not include a step name
  track('compass_calibration_abandoned', { answered_count: 0, total_topics: 8, progress_pct: 0, exit_via: 'answer' });
  // @ts-expect-error entry_step is a step, not a reason
  track('compass_quiz_started', { quiz_type: 'calibration', entry_step: 'lens_link' });
  // @ts-expect-error total_topics is still required on a start
  track('compass_calibration_started', { surface: 'overlay' });
}
