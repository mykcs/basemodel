# Vercel “GitHub user not found” caused by Git author identity — engineering case

Status: **historical engineering case**
Date: **2026-09-21**
Repository: `mykcs/basemodel`

Current deployment policy and executable checks remain authoritative. This file records the incident, diagnosis, repair, and reusable engineering lessons; PR numbers, SHAs, and provider objects below are historical evidence only.

## Scope

This case began with a Vercel Deployments warning:

```text
GitHub user not found
Commit Author: agent@openai.invalid
GitHub User: OpenAI Agent
Vercel Account: Unavailable
```

Vercel's “Fix Git Configuration” dialog also reported that the commit author email was not a valid address for account identification.

The important engineering question was not “how do we dismiss the warning?” It was:

```text
which Git configuration produced this author identity,
why did it override the expected GitHub-linked identity,
and how do we make the release path reject the same class before Vercel sees it?
```

## What made the symptom misleading

The machine already had a valid global Git identity. A quick global-only check therefore looked healthy:

```text
user.name  = myk (macm2max)
user.email = <GitHub-linked noreply address>
```

But BaseModel commits were still being created as:

```text
OpenAI Agent <agent@openai.invalid>
```

The missing fact was configuration precedence. The repository had more-specific local Git configuration, and that local value overrode the valid global setting.

The useful diagnostic was therefore not:

```bash
git config --global --get user.email
```

but:

```bash
git config --show-origin --get-regexp '^user\.(name|email)$'
git var GIT_AUTHOR_IDENT
```

The first command shows **where every competing value came from**. The second shows the identity Git would actually use for the next commit.
## Root cause

The BaseModel checkout contained repository-local values:

```text
user.name  = OpenAI Agent
user.email = agent@openai.invalid
```

Those values were more specific than the valid global identity and therefore won.

The repository also used linked worktrees. The problematic identity lived in the repository-level configuration shared by those worktrees, so creating an isolated worktree did not by itself remove the bad author identity.

This is a general Git lesson:

```text
“my global Git config is correct”
does not imply
“this repository will create commits with that identity”
```

Always inspect effective configuration and its origin when commit metadata matters to an external provider.

## GitHub-side proof

The GitHub commit API made the difference observable.

For a bad historical commit, the raw commit metadata contained the invalid author email, while GitHub could not associate the commit with a GitHub account:

```text
commit.author.email = agent@openai.invalid
author              = null
```

For the repaired commit, GitHub returned both a GitHub-linked noreply email in raw commit metadata and a concrete GitHub `author.login`.
That distinction matters because Vercel's Git integration depends on GitHub identity information, not merely on an arbitrary syntactically present author string.

A compact verification pattern is:

```bash
gh api repos/mykcs/basemodel/commits/$SHA \
  --jq '{email:.commit.author.email, login:.author.login}'
```

For a deployable candidate, a missing `author.login` is a strong warning that GitHub itself did not map the primary commit author to an account.

## Repair

The repair had two layers.

### 1. Fix the commit-producing configuration

The repository-local Git identity was changed to the GitHub-linked identity already used by the owner.

After the change:

```bash
git var GIT_AUTHOR_IDENT
```

returned the expected GitHub-linked author.

This machine-local configuration change was **not** committed as repository content. The repository should not hard-code a particular maintainer's personal Git identity.

### 2. Add a release-path guard

PR #764 added a defensive check to:

```text
scripts/request-vercel-final-gate.mjs
```
Before moving the persistent Vercel final-gate ref, the script now reads the candidate head through the GitHub API and requires:

```text
commit.commit.author.email   -> present
commit.author.login          -> present
```

If GitHub cannot map the primary commit author, the final gate fails locally with an actionable message instead of sending the bad candidate into Vercel.

This is defense in depth:

```text
correct local Git identity
+
GitHub-mapped-author preflight
+
Vercel exact-head acceptance
```

No one layer substitutes for the others.

## Why we did not rewrite history

Older commits with `agent@openai.invalid` remain in Git history.

Rewriting them would have changed commit SHAs, disturbed already-merged ancestry, invalidated historical references, and created much more risk than value.

The desired invariant is forward-looking:

```text
new deployable commit heads use a GitHub-mapped author
```

Historical commits remain evidence of what actually happened.

## Important nuance: commit author metadata is not the same as a message trailer

A merge commit can contain text such as:

```text
Co-authored-by: OpenAI Agent <agent@openai.invalid>
```

without its **primary commit author** being `agent@openai.invalid`.
In this incident, Vercel identity trouble tracked the primary commit author metadata that GitHub exposes as `commit.author` / `author`, not the presence of an arbitrary `Co-authored-by` line in the commit message.

Do not diagnose author mapping from commit-message text alone.

## Verification and closeout

The repaired candidate used a GitHub-mapped primary author.

Validation covered:

- repository lint and syntax checks;
- full `npm run verify:deploy`;
- `npm run build`;
- public GitHub Actions deterministic checks;
- all eight browser shards;
- exact-head Vercel final-gate Preview;
- merge of PR #764;
- post-merge Production reaching `READY`.

The repair was therefore proven at three different layers:

```text
Git metadata identity
-> GitHub account mapping
-> Vercel exact-head / Production execution
```

A green result at only one of these layers would have been weaker evidence.

## Shortcuts that would have been wrong

### Only changing global Git config

Wrong because the repository-local value was the effective override.

### Clicking “Fix Git Configuration” in Vercel without inspecting Git

The dialog correctly identified the symptom, but the durable fix belonged at the commit-producing Git configuration and release preflight.
### Rewriting historical commits

Unnecessary and high-risk. The problem was future candidate identity, not historical aesthetics.

### Creating a no-op commit only to wake Vercel

BaseModel policy already rejects source churn whose only purpose is retriggering a provider. A new commit should represent a real change. In this case the follow-up commit added the actual preventive guard.

### Treating every non-public email as invalid

The invariant is not “the email must be publicly visible”. GitHub noreply addresses are valid when they map to the intended account.

### Treating every synthetic CI commit the same as a deployable head

Some internal test fixtures or synthetic merge objects may deliberately use non-user identities. The strict mapping requirement applies at the Git-connected Vercel candidate boundary, where provider identity is part of acceptance.

## Durable lessons

### 1. Commit metadata is part of deployment configuration

For a Git-integrated deployment provider, source code and build configuration are not the whole input. Commit author identity can influence provider authorization and attribution.

### 2. Inspect configuration origin, not only configuration value

When local and global Git state disagree, `git config --show-origin` is more informative than reading one scope in isolation.

### 3. Verify the effective identity before creating the commit

`git var GIT_AUTHOR_IDENT` answers the operational question: “what author will Git use now?”

### 4. Bind provider diagnosis to the exact commit

A provider warning belongs to one commit/ref/deployment object. Historical bad metadata does not prove the current head is bad, and a repaired current head does not rewrite history.
### 5. Convert a provider-specific incident into a pre-provider invariant

The strongest repair was not merely changing one workstation setting. The final-gate script now prevents the same class from reaching Vercel when GitHub cannot map the candidate author.

### 6. Do not confuse GitHub mapping with final Vercel acceptance

A non-null GitHub `author.login` is a precondition used by the BaseModel guard. Vercel remains the final authority for whether the exact candidate is accepted.

## Future-Agent operator checklist

When Vercel shows “GitHub user not found”, “Vercel Account Unavailable”, or an unexpected commit author:

```text
[ ] bind the warning to the exact commit SHA and deployment
[ ] inspect raw commit author email and GitHub author.login
[ ] inspect git config with --show-origin
[ ] inspect git var GIT_AUTHOR_IDENT
[ ] fix the narrowest effective Git config scope
[ ] do not rewrite old commits just to clean the dashboard
[ ] create only a meaningful follow-up commit
[ ] require the candidate head to map to a GitHub account
[ ] run exact-head Vercel acceptance
[ ] verify post-merge Production separately
```

Useful commands:

```bash
git config --show-origin --get-regexp '^user\.(name|email)$'
git var GIT_AUTHOR_IDENT
gh api repos/mykcs/basemodel/commits/$SHA \
  --jq '{email:.commit.author.email, login:.author.login}'
```

## Information-lifetime classification

### Long-lived

- configuration-origin diagnosis;
- effective-author verification;
- GitHub-mapped author as a final-gate precondition;
- historical commits should not be rewritten merely to repair provider attribution;
- exact-head provider verification after the identity fix.

### Project-scoped

- BaseModel's persistent `ci/vercel-gate-final` flow;
- `scripts/request-vercel-final-gate.mjs` as the enforcement point;
- Vercel as BaseModel's exact-head final acceptance authority.

### Historical only

- PR #764 state at any particular moment;
- the incident's individual commit SHAs;
- deployment IDs and temporary Preview URLs;
- the local worktree path used during repair;
- the current `main` SHA at the time this case was written.

## Related current owners

Read current policy before using this historical case:

- `docs/agents/current/deployment-policy.md`
- `docs/agents/current/provider-failure-attribution-runbook.md`
- `docs/agents/current/release-closeout-protocol.md`
- `scripts/request-vercel-final-gate.mjs`

Historical implementation PR:

- https://github.com/mykcs/basemodel/pull/764
