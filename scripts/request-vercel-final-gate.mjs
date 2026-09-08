#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { VERCEL_FINAL_BASE_REF, VERCEL_FINAL_GATE_REF } from './vercel-git-range.mjs';

const REPO = 'mykcs/basemodel';
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

const pr = json(['pr', 'view', prNumber, '--repo', REPO, '--json', 'state,isDraft,baseRefName,baseRefOid,headRefOid,url']);
if (pr.state !== 'OPEN' || pr.isDraft) throw new Error('final gate requires an open non-draft PR');
if (pr.baseRefName !== 'main') throw new Error(`final gate requires direct base main, got ${pr.baseRefName}`);

const currentMain = json(['api', `repos/${REPO}/commits/main`]).sha;
if (pr.baseRefOid !== currentMain) {
  throw new Error(`PR is not current with main: base=${pr.baseRefOid} live_main=${currentMain}`);
}

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

const prAfterBase = json(['pr', 'view', prNumber, '--repo', REPO, '--json', 'state,isDraft,baseRefOid,headRefOid']);
const mainAfterBase = json(['api', `repos/${REPO}/commits/main`]).sha;
if (
  prAfterBase.state !== 'OPEN'
  || prAfterBase.isDraft
  || prAfterBase.headRefOid !== pr.headRefOid
  || prAfterBase.baseRefOid !== currentMain
  || mainAfterBase !== currentMain
) {
  throw new Error('PR/main identity moved while arming the non-deploy gate-base ref; retry from fresh identities');
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
}));
