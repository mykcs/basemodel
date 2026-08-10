# Cloudflare Direct Upload credential handoff

Last reviewed: **2026-08-11 01:36 +08:00**

Status: **current credential/integration handoff.** Ordinary website Preview traffic now uses the validated Vercel Preview path documented in `LATEST.md`; this file covers the Cloudflare Wrangler Direct Upload fallback / Cloudflare-specific Preview path and the remaining credential-injection work.

## Why this file exists

The owner wants web-based ChatGPT / coding agents to be able to modify the private `mykcs/basemodel` repository, validate/build it, and produce a public Preview without consuming a Git-integrated Cloudflare Pages Build merely to see the result.

The repository-side Direct Upload workflow is now implemented. The unresolved part is how a web ChatGPT / Agent execution environment receives Cloudflare credentials securely and persistently enough to run it.

## What has already been completed

PR #103 added and merged the repository-owned command:

```bash
npm run preview:cloudflare
```

Implementation:

```text
scripts/direct-upload-preview.mjs
src/lib/directUploadPreview.test.ts
package.json                         # preview:cloudflare
docs/agents/current/direct-upload-preview-command.md
docs/agents/current/direct-upload-preview-policy.md
```

The command:

1. requires `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`;
2. reads the exact Git SHA and source branch;
3. refuses a dirty worktree by default;
4. generates a unique `agent-preview-*` non-production branch;
5. runs `npm run build:cloudflare` before upload;
6. checks the built root has Preview `robots noindex`;
7. runs Wrangler Pages Direct Upload against project `basemodel`;
8. records the Git SHA on the deployment;
9. verifies the returned public `pages.dev` URL;
10. prints machine-readable URL / branch / commit evidence.

The implementation landed in `main` without intentionally consuming a Cloudflare Git-integrated Pages Build.

## Important architecture update after that work

Vercel Preview has since passed the repository acceptance gate and is now the **ordinary first-choice Preview path** for non-main branches / PRs. See:

- `docs/agents/LATEST.md`;
- `docs/agents/current/vercel-preview-migration-plan.md`;
- `docs/agents/current/preview-platform-evaluation.md`.

Therefore Cloudflare Direct Upload is no longer required for every ordinary Preview. It remains useful as:

- a Cloudflare-specific integration Preview;
- a fallback when Vercel is unavailable or unsuitable;
- a way to verify the prebuilt artifact on Cloudflare without spending the Git-integrated Pages Build quota.

Do not undo the validated Vercel Preview split merely because the Wrangler credential path becomes available.

## Credential problem discovered during implementation

A web ChatGPT session can have private GitHub repository access while its execution environment still lacks one or more of:

- `CLOUDFLARE_API_TOKEN`;
- `CLOUDFLARE_ACCOUNT_ID`;
- persisted `wrangler login` state;
- a Cloudflare account connector;
- reliable npm access for installing Wrangler;
- a checkout/runtime that can execute the repository build.

GitHub-read access and an execution sandbox with deploy credentials are separate capabilities.

## Decision: do not store the live token as normal Git content

The owner asked whether a dedicated private GitHub repository could hold the token so ChatGPT could read it through the GitHub connector.

Technical observation:

- if a live token is committed as an ordinary file in a readable private repository, a GitHub connector with repository read access may be able to read it;
- this can bridge the read-access problem, but it turns the bearer credential into ordinary Git content and Git history;
- every sufficiently privileged user, GitHub App, integration, backup, or future repository reader becomes part of the secret's trust boundary.

Decision:

**Do not adopt plaintext-in-private-repo as the preferred credential mechanism.** It is a last-resort convenience experiment only, and only with a short-lived, minimum-permission token if the owner explicitly accepts that tradeoff.

GitHub Actions Secrets / Agent Secrets are safer, but their APIs intentionally do not return the decrypted secret value. They are usable only when the corresponding runtime injects the secret; a generic GitHub-reading ChatGPT session cannot treat them as a plaintext key-value database.

## Recommended order of attempts

Proceed in this order. Do not jump directly to plaintext Git storage.

### 1. Codex / Agent execution-environment injection

Current OpenAI Codex Cloud behavior was re-checked against official documentation on 2026-08-11:

- Codex Cloud checks out the selected repository into a cloud container before the Agent phase;
- normal **Environment variables** are available for the full cloud chat, including setup scripts and the Agent phase;
- encrypted **Secrets** are decrypted only for setup scripts and are removed before the Agent phase;
- setup scripts run before the Agent edits the task state, so a setup-only Secret cannot directly perform the final post-edit Wrangler deployment;
- do **not** bypass this security boundary by copying a setup-only Secret into a repository file or other Agent-readable plaintext location.

Therefore the original ideal of "Codex Secret -> final Agent-phase `wrangler pages deploy`" is **not directly supported by the current Codex Secret lifecycle**.

The practical first experiment is instead:

```text
Codex Cloud environment for mykcs/basemodel
  + CLOUDFLARE_API_TOKEN as an Environment variable
  + CLOUDFLARE_ACCOUNT_ID as an Environment variable
  + narrowly restricted Agent internet access
  -> npm run preview:cloudflare
```

This is still preferable to committing the token into Git because it keeps the token outside repository history, but it is weaker than a setup-only Codex Secret: an Agent-phase environment variable is available to commands the Agent runs.

Risk reduction for this experiment:

- create a dedicated Cloudflare API token, never use the Global API Key;
- grant only the minimum Pages permission required by current Cloudflare documentation;
- restrict the token to the relevant Cloudflare account as far as Cloudflare allows;
- prefer a short expiration / TTL for the first proof;
- enable Agent internet access only for the domains needed for build/deploy rather than unrestricted access;
- remember that Wrangler deployment requires non-read HTTP methods, so a GET/HEAD-only network policy will not be sufficient for the final upload;
- remove/rotate the environment variable token after the proof if persistent Agent-phase exposure is not acceptable.

Acceptance gate:

- token is not committed to Git;
- token is not pasted into chat / PR / issue text;
- Codex runtime can execute the private repository;
- `npm run preview:cloudflare` returns an actual public `pages.dev` URL;
- exact Git SHA is reported;
- Production remains untouched;
- Cloudflare Git-integrated Pages Build count is not intentionally consumed.

If this environment-variable experiment is judged too permissive, stop and move to step 2 rather than weakening the token or Codex security model.

### 2. Narrow GitHub Actions Direct Upload runner, only if step 1 is unavailable or rejected

This is not a return to GitHub Actions as general CI.

Possible narrow purpose:

```text
manual / explicitly requested Preview action
  -> GitHub runtime receives GitHub Secret
  -> repository-owned validation/build
  -> Wrangler Direct Upload
  -> publish Preview URL as workflow output / PR evidence
```

The workflow must not become a broad automatic CI pipeline or a Git-integrated Cloudflare build trigger.

Use this only if the owner accepts reintroducing one narrowly scoped Action for secret injection/execution.

### 3. Short-lived minimum-permission token in a dedicated private repository, only as explicit fallback

Use only after steps 1 and 2 are unavailable or rejected.

If ever used:

- never use the Global API Key;
- use a dedicated Cloudflare API token;
- grant only the minimum Pages permission supported by current Cloudflare docs;
- restrict account/resources as far as Cloudflare allows;
- add an expiration/TTL where supported;
- rotate/revoke immediately after the experiment;
- keep it in a dedicated secrets-only private repository with the smallest possible GitHub App/user read scope;
- document that deletion from the current branch does not erase Git history;
- treat any accidental exposure as a compromise and rotate, rather than trying to "hide" the old commit.

This remains inferior to runtime injection.

## Current next action

The current next action is **not** another repository redesign.

Configure a Codex Cloud environment for `mykcs/basemodel` with a short-lived, minimum-permission Cloudflare token supplied as an **Environment variable** (not a setup-only Secret), plus `CLOUDFLARE_ACCOUNT_ID`, and narrowly scoped Agent internet access. Then run one real task that ends with:

```bash
npm run preview:cloudflare
```

If the real Direct Upload succeeds, record the returned `DIRECT_UPLOAD_PREVIEW_URL` and exact Git SHA and then decide whether the Agent-phase environment-variable exposure is acceptable for continued fallback use.

If it fails because Environment variables cannot be configured securely enough, network policy cannot support Wrangler without excessive exposure, or the owner rejects Agent-phase token availability, move to the narrow GitHub Actions runner.

Only after that should plaintext-in-private-repo be reconsidered.

## Security / evidence rules

Future Agents must keep these claims separate:

```text
GitHub can read the repository
!= Agent runtime can execute the repository
!= Agent runtime has Cloudflare credentials
!= Wrangler Direct Upload succeeded
!= public Preview was verified
!= Production changed
```

Never claim the credential problem is solved until a real runtime receives the credential and a real Direct Upload returns a verified public URL.

Never spend a Git-integrated Cloudflare Pages Build merely to compensate for missing Wrangler credentials without first warning the owner and receiving permission.

## Official references checked for this decision

OpenAI Codex Cloud:

- <https://developers.openai.com/codex/environments/cloud-environment>
- <https://learn.chatgpt.com/codex/cloud/internet-access>

Cloudflare Wrangler / Direct Upload:

- <https://developers.cloudflare.com/pages/how-to/use-direct-upload-with-continuous-integration/>
- <https://developers.cloudflare.com/workers/wrangler/system-environment-variables/>
- <https://developers.cloudflare.com/workers/wrangler/commands/pages/>

Re-check these before changing the credential lifecycle or network policy; both products evolve quickly.

## Related records

- `docs/agents/history/2026-08-11-cloudflare-direct-upload-preview-retrospective.md` — implementation success/failure retrospective.
- `docs/agents/current/direct-upload-preview-command.md` — executable one-command contract.
- `docs/agents/current/direct-upload-preview-policy.md` — build-budget and Direct Upload policy.
- `docs/agents/current/vercel-preview-migration-plan.md` — validated ordinary Preview path.
- `docs/agents/LATEST.md` — current architecture authority.
