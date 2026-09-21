#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { VERCEL_FINAL_BASE_REF, VERCEL_FINAL_GATE_REF } from './vercel-git-range.mjs';

const REPO = 'mykcs/basemodel';
const PUBLIC_CI_GATE_NAME = 'public-ci-gate';
const GITHUB_ACTIONS_APP_ID = 15368;
const prNumber = process.argv[2];
if (!/^\d+$/.test(prNumber ?? '')) {
  console.error('usage: node scripts/request-vercel-final-gate.mjs <PR_NUMBER>');
  process.exit(2);
}

function gh(args, options = {}) {
  return execFileSync('gh', args, {
    encoding: 'utf8',
    stdio: options.inherit ? 'inherit' : ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function json(args) {
  return JSON.parse(gh(args));
}

function refSha(ref) {
  try {
    return json(['api', `repos/${REPO}/git/ref/heads/${ref}`]).object.sha;
  } catch {
    return undefined;
  }
}

function updateRef(ref, sha) {
  gh(['api', '-X', 'PATCH', `repos/${REPO}/git/refs/heads/${ref}`, '-f', `sha=${sha}`, '-F', 'force=true']);
  const readback = refSha(ref);
  if (readback !== sha) throw new Error(`ref update did not read back exactly: ${ref}=${readback} expected=${sha}`);
}

function createRef(ref, sha) {
  gh(['api', '-X', 'POST', `repos/${REPO}/git/refs`, '-f', `ref=refs/heads/${ref}`, '-f', `sha=${sha}`]);
  const readback = refSha(ref);
  if (readback !== sha) throw new Error(`ref creation did not read back exactly: ${ref}=${readback} expected=${sha}`);
}

const pr = json(['pr', 'view', prNumber, '--repo', REPO, '--json', 'state,isDraft,baseRefName,headRefOid,url']);
if (pr.state !== 'OPEN' || pr.isDraft) throw new Error('final gate requires an open non-draft PR');
if (pr.baseRefName !== 'main') throw new Error(`final gate requires direct base main, got ${pr.baseRefName}`);

function assertPublicCiGate(headSha) {
  const payload = json([
    'api',
    `repos/${REPO}/commits/${headSha}/check-runs?check_name=${encodeURIComponent(PUBLIC_CI_GATE_NAME)}&filter=latest&per_page=100`,
  ]);
  const check = (payload.check_runs ?? []).find((item) => (
    item.name === PUBLIC_CI_GATE_NAME
    && item.head_sha === headSha
    && item.app?.id === GITHUB_ACTIONS_APP_ID
  ));
  if (!check) {
    throw new Error(`${PUBLIC_CI_GATE_NAME} is missing on exact head ${headSha}; wait for Public PR CI before spending Vercel`);
  }
  if (check.status !== 'completed' || check.conclusion !== 'success') {
    throw new Error(`${PUBLIC_CI_GATE_NAME} must be completed/success on exact head ${headSha}; got status=${check.status ?? 'unknown'} conclusion=${check.conclusion ?? 'unknown'}`);
  }
  return { id: check.id, detailsUrl: check.details_url ?? null };
}

function assertHeadContainsMain(mainSha, headSha) {
  const comparison = json(['api', `repos/${REPO}/compare/${mainSha}...${headSha}`]);
  const mergeBase = comparison.merge_base_commit?.sha;
  const behindBy = comparison.behind_by;
  const status = comparison.status;
  if (mergeBase !== mainSha || behindBy !== 0 || !['ahead', 'identical'].includes(status)) {
    throw new Error(`PR is not current with main: main=${mainSha} head=${headSha} merge_base=${mergeBase ?? 'unknown'} behind_by=${behindBy ?? 'unknown'} status=${status ?? 'unknown'}`);
  }
}

function assertGitHubMappedAuthor(sha) {
  const commit = json(['api', `repos/${REPO}/commits/${sha}`]);
  const email = commit.commit?.author?.email;
  const login = commit.author?.login;
  if (!email || !login) {
    throw new Error(
      `Vercel final gate requires the PR head commit author email to map to a GitHub account: head=${sha} author_email=${email ?? 'missing'}. Fix Git user.email to a GitHub-associated address and create a real follow-up commit before retrying.`,
    );
  }
  return { email, login };
}

const currentMain = json(['api', `repos/${REPO}/commits/main`]).sha;
assertHeadContainsMain(currentMain, pr.headRefOid);
assertGitHubMappedAuthor(pr.headRefOid);
const publicCi = assertPublicCiGate(pr.headRefOid);

const currentFinal = refSha(VERCEL_FINAL_GATE_REF);
if (!currentFinal) {
  throw new Error(`${VERCEL_FINAL_GATE_REF} must already exist; do not create a fresh final alias as the trigger`);
}
if (currentFinal === pr.headRefOid) {
  const status = json(['api', `repos/${REPO}/commits/${pr.headRefOid}/status`]);
  const vercel = status.statuses?.find((item) => item.context === 'Vercel');
  console.log(JSON.stringify({ status: 'ALREADY_TARGETED', pr: Number(prNumber), head: pr.headRefOid, vercel: vercel?.state ?? null }));
  process.exit(vercel?.state === 'success' ? 0 : 3);
}

const active = json(['api', `repos/${REPO}/commits/${currentFinal}/status`]);
const pendingVercel = active.statuses?.find((item) => item.context === 'Vercel' && item.state === 'pending');
if (pendingVercel) {
  throw new Error(`another Vercel final gate is still pending on ${currentFinal}; wait instead of canceling it`);
}

const baseCurrent = refSha(VERCEL_FINAL_BASE_REF);
if (baseCurrent) updateRef(VERCEL_FINAL_BASE_REF, currentMain);
else createRef(VERCEL_FINAL_BASE_REF, currentMain);

const prAfterBase = json(['pr', 'view', prNumber, '--repo', REPO, '--json', 'state,isDraft,baseRefName,headRefOid']);
const mainAfterBase = json(['api', `repos/${REPO}/commits/main`]).sha;
if (
  prAfterBase.state !== 'OPEN'
  || prAfterBase.isDraft
  || prAfterBase.baseRefName !== 'main'
  || prAfterBase.headRefOid !== pr.headRefOid
  || mainAfterBase !== currentMain
) {
  throw new Error('PR/main identity moved while arming the non-deploy gate-base ref; retry from fresh identities');
}
assertHeadContainsMain(currentMain, prAfterBase.headRefOid);
const publicCiAfterBase = assertPublicCiGate(prAfterBase.headRefOid);
if (publicCiAfterBase.id !== publicCi.id) {
  throw new Error(`${PUBLIC_CI_GATE_NAME} identity moved while arming the gate; retry from fresh provider state`);
}

updateRef(VERCEL_FINAL_GATE_REF, pr.headRefOid);
console.log(JSON.stringify({
  status: 'REQUESTED',
  pr: Number(prNumber),
  url: pr.url,
  base: currentMain,
  head: pr.headRefOid,
  gate_base_ref: VERCEL_FINAL_BASE_REF,
  gate_final_ref: VERCEL_FINAL_GATE_REF,
  public_ci_check: PUBLIC_CI_GATE_NAME,
  public_ci_check_id: publicCi.id,
  public_ci_details_url: publicCi.detailsUrl,
}));
