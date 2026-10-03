import json, subprocess, datetime
from pathlib import Path
# Run manually from this repository with authenticated gh; never called by build/CI.
root = Path.cwd()
if not (root / 'docs/plans/site-upgrade-20261002/tasks/Q01.md').is_file():
    raise SystemExit('Run from the BaseModel repository root')
def run(*args):
    return subprocess.check_output(args, cwd=root, text=True)
def api(endpoint):
    return json.loads(run('gh', 'api', endpoint))
repo = 'mykcs/basemodel'
pairs = [('A01',814),('A02',815),('A03',816),('B01',817),('B02',818),('B03',819),('C01',827),('C02',820),('C03',821),('D01',822),('D02',823),('D03',824),('D04',825),('X783',783),('X805',805),('X806',806),('X812',812)]
rows = []
for packet, number in pairs:
    pr = api(f'repos/{repo}/pulls/{number}')
    pages = json.loads(run('gh','api',f'repos/{repo}/pulls/{number}/files?per_page=100','--paginate','--slurp'))
    files = [dict(path=f['filename'], blob=f['sha'], status=f['status']) for page in pages for f in page]
    assert api(f'repos/{repo}/pulls/{number}')['head']['sha'] == pr['head']['sha'], f'Head moved while reading {number}'
    assert len(files) == pr['changed_files'], (number, len(files), pr['changed_files'])
    rows.append(dict(packet=packet,pr=number,head=pr['head']['sha'],base=pr['base']['sha'],branch=pr['head']['ref'],draft=pr['draft'],merged=pr['merged'],state=pr['state'],files=files))
heads = [row['head'] for row in rows]
subprocess.run(['git','fetch','--quiet','origin',*heads], cwd=root, check=True)
for row in rows:
    row['includedInCandidate'] = subprocess.run(['git','merge-base','--is-ancestor',row['head'],'HEAD'],cwd=root).returncode == 0
    workflow = api(f"repos/{repo}/actions/runs?event=pull_request&head_sha={row['head']}&per_page=20")
    eligible = [r for r in workflow['workflow_runs'] if r['name']=='Public PR CI']
    row['individualPublicCI'] = None if not eligible else {k:eligible[0][k] for k in ['id','head_sha','status','conclusion','html_url']}
by_path = {}
for row in rows:
    for item in row['files']:
        if item['path'].startswith(('src/','scripts/','.github/')) or item['path'] in ('package.json','package-lock.json','astro.config.mjs'):
            by_path.setdefault(item['path'], []).append(dict(packet=row['packet'],pr=row['pr'],blob=item['blob'],status=item['status']))
overlap = [dict(path=key,participants=value,classification='same-file-state' if len({(x['blob'],x['status']) for x in value})==1 else 'different-file-states-needs-owner-reconciliation') for key,value in sorted(by_path.items()) if len(value)>1]
plan_ref = 'refs/heads/docs/site-upgrade-scientific-tables-20261002'
plan_result = run('git','ls-remote','origin',plan_ref).strip()
plan_prs = json.loads(run('gh','pr','list','--repo',repo,'--state','all','--head','docs/site-upgrade-scientific-tables-20261002','--json','number,headRefOid,state'))
record = dict(schema='basemodel.q01-dependency-audit.v1', observedAt=datetime.datetime.now(datetime.timezone.utc).isoformat(), candidateBeforeImplementation=run('git','rev-parse','HEAD').strip(), dependencies=rows, c01=dict(planRef=plan_ref,head=plan_result.split()[0] if plan_result else None,prs=plan_prs), overlaps=overlap, status='integration_pending', boundary='File overlap is not a merge-conflict verdict; identical blobs often reflect stacked dependencies. Individual CI is not combined-candidate CI. No scientific or publication authority added.')
target = root / 'docs/plans/site-upgrade-20261002/tasks/Q01-DEPENDENCIES.json'
target.write_text(json.dumps(record,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(dict(dependencies=len(rows),included=sum(r['includedInCandidate'] for r in rows),overlapPaths=len(overlap),differentStates=sum(r['classification'].startswith('different') for r in overlap),c01=record['c01']),ensure_ascii=False,indent=2))
