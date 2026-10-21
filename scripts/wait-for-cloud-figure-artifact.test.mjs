import assert from 'node:assert/strict';
import test from 'node:test';
import { positiveArtifactId, waitForArtifactIndex, main } from './wait-for-cloud-figure-artifact.mjs';

test('known-bad eventual consistency: absent on first listing, exact ID appears later', async () => {
  let calls = 0;
  const delays = [];
  const result = await waitForArtifactIndex({
    artifactId: '12340680259',
    listArtifacts: async () => {
      calls += 1;
      if (calls < 3) return [{id: 12338651505, name:'older evidence'}, {id:12340680258, name:'same-name lookalike'}];
      return [{id:12340680259, name:'exact accepted evidence'}];
    },
    delay: async duration => { delays.push(duration); },
    attempts: 5,
    delayMs: 7,
  });
  assert.deepEqual(result, {artifactId:12340680259,attempt:3});
  assert.equal(calls, 3);
  assert.deepEqual(delays, [7,7]);
});

test('fast path: visible exact ID is accepted without unnecessary sleeps', async () => {
  const delays = [];
  const result = await waitForArtifactIndex({
    artifactId: 12,
    listArtifacts: async () => [{id:12}],
    delay: async ms => { delays.push(ms); },
  });
  assert.deepEqual(result,{artifactId:12,attempt:1});
  assert.deepEqual(delays, []);
});

test('bounds persistent missing-ID retries and never accepts a different artifact', async () => {
  let calls = 0;
  const waits = [];
  await assert.rejects(() => waitForArtifactIndex({
    artifactId:13,
    listArtifacts:async()=>{calls += 1;return [{id:12}]},
    delay:async ms=>{ waits.push(ms); },
    attempts:3,delayMs:5,
  }), /not discoverable after bounded retries/);
  assert.equal(calls,3);
  assert.deepEqual(waits,[5,5]);
});

test('rejects invalid identity and malformed listing rather than declaring success', async () => {
  for(const bad of [0,-1,'',undefined,'3abc',1.5,NaN]) {
    assert.throws(()=>positiveArtifactId(bad),/Invalid positive artifact ID/);
  }
  await assert.rejects(()=>waitForArtifactIndex({
    artifactId:7,listArtifacts:async()=>({artifacts:[]}),delay:async()=>{},
  }),/must contain an array/);
});

test('real run query stays read-only and is scoped to exact run and artifact ID', async () => {
  const requests = [];
  const waits = [];
  const env = {
    GITHUB_REPOSITORY:'mykcs/basemodel',GITHUB_RUN_ID:'39583288998',
    FIGURE_ACCEPTED_ARTIFACT_ID:'12340680259', GH_TOKEN:'test-only-placeholder',
  };
  let reads=0;
  const result=await main(env,async(url,options)=>{
    requests.push({url,options});
    reads += 1;
    return {ok:true,status:200,json:async()=>({
      total_count:10,
      artifacts: reads===1 ? [{id:12340680258}]:[{id:12340680259}],
    })};
  },async ms=>waits.push(ms));
  assert.equal(result.attempt,2);
  assert.deepEqual(waits,[3000]);
  assert.equal(requests.length,2);
  assert.equal(requests[0].url,'https://api.github.com/repos/mykcs/basemodel/actions/runs/39583288998/artifacts?per_page=100');
  assert.equal(requests[0].options.headers.Authorization,'Bearer test-only-placeholder');
  assert.equal(requests[0].options.method,undefined);
});

test('fail closed on unbounded artifact population and provider errors', async () => {
  const env={GITHUB_REPOSITORY:'mykcs/basemodel',GITHUB_RUN_ID:'1',FIGURE_ACCEPTED_ARTIFACT_ID:'2',GH_TOKEN:'test'};
  await assert.rejects(()=>main(env,async()=>({ok:false,status:403}),async()=>{}),/HTTP 403/);
  await assert.rejects(()=>main(env,async()=>({ok:true,json:async()=>({total_count:101,artifacts:[{id:2}]})}),async()=>{}),/exceeds single-page/);
});
