# Publishing & setup — @empoweredvote/analytics

This mirrors the `ev-ui` release pipeline: tag a version, CI publishes to npm via
OIDC trusted publishing, then dispatches autobump PRs to every consumer repo.

## Release workflow (recurring)

1. Make changes on a branch, PR into `main`.
2. After merging, bump + tag:
   ```bash
   npm version patch    # or minor / major
   git push origin main --follow-tags
   ```
3. `publish.yml` verifies the version matches the tag, typechecks, builds,
   publishes to npm, and dispatches `analytics-published` to each consumer.

## One-time setup (must be done by a human — cannot be scripted from here)

These require org/npm admin and secrets, so they are **not** done in-repo:

1. **Create the GitHub repo** `EmpoweredVote/ev-analytics` and push this folder.
2. **npm trusted publisher**: on npmjs.com, configure a trusted publisher for
   `@empoweredvote/analytics` pointing at `EmpoweredVote/ev-analytics`, workflow
   file `publish.yml`. (No `NPM_TOKEN` secret — OIDC only. Requires the
   `id-token: write` permission already set in the workflow.)
3. **Autobump GitHub App**: install the same `ev-ui-autobump` app (or an
   equivalent) on `ev-analytics` and on each consumer repo, and add `APP_ID` +
   `APP_PRIVATE_KEY` secrets to `ev-analytics`.
4. **Consumer bump workflows**: in each of the 5 npm consumers (CompassV2,
   essentials, read-rank, Civic-Trivia-Championships, treasury-tracker), add a
   `.github/workflows/analytics-bump.yml` — copy the `ev-ui-bump.yml` from any
   consumer and swap `ev-ui` → `analytics` and the dispatch type
   `ev-ui-published` → `analytics-published`. Enable "Allow auto-merge" and
   require the build check, same as the ev-ui setup.
5. Verify the consumer repo names in `publish.yml`'s `matrix.consumer` match the
   actual GitHub repo names under `EmpoweredVote`.

## Consumers

npm consumers (get autobump PRs): **CompassV2, essentials, read-rank,
Civic-Trivia-Championships, treasury-tracker**.

**ev-landing** is static HTML — it uses the inline PostHog snippet, not npm, so
it is intentionally excluded. Keep its inline `posthog.init(...)` config in sync
with this package's defaults by hand (it's a single `<script>` block).

## Local development

```bash
npm install
npm run typecheck   # strict; the event catalog is enforced here
npm run build       # tsup → dist (ESM + CJS + .d.ts)
```

To test against a consumer before publishing, use `npm pack` and install the
resulting tarball, or `npm link`.
