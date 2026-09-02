# Server storage pressure audit SOP

Status: **current**
Last reviewed: **2026-09-03**
Audience: Agents auditing or reclaiming space on the shared experiment server

## Purpose

Use this SOP when the owner asks how full the server is, who is using space, or what can be reclaimed quickly. The first pass is **read-only**. Do not turn a storage audit into an opportunistic cleanup of models, checkpoints, runs, containers, or another user's files.

The public Base Model site may publish only aggregate hardware facts and **anonymous capacity rankings**. Never commit a real username, home path, container name/ID, GPU UUID, SSH alias, IP, token, or an anonymous-label-to-person mapping.

## 1. Fast read-only inventory

Start with the filesystem, not one user's home directory:

```bash
df -B1 /
df -h /
```

Record total, used, available, and `Use%`. Keep `df` semantics intact: `Use%` can differ from simple `used / total` because filesystem reserve and rounding exist.

Then measure identifiable home directories with `du -x -s -B1`. Do **not** assume the current mount namespace can see every `/data/home/*` directory. On this shared Docker host, a reliable inventory may require enumerating bind-mounted home roots from authorized development containers and running the read-only `du` from the namespace that can see each mount.

**Completeness gate:** if the namespace exposes fewer homes than the known shared-server topology or the running development-container mounts imply, stop. The result is an incomplete view, not an anonymous ranking. Resolve the missing namespaces before publishing user counts or percentages.

Public output is sorted by **attributable total** (home + reliably attributable Docker writable layer) and renamed every snapshot:

```text
User 1 = largest attributable total in this snapshot
User 2 = second largest
...
```

The mapping is ephemeral and must not be written into the repository. Never add a special “ours / our account” row; the owner is anonymous under the same rule as every other account.

## 2. Split personal and shared usage

For an authorized user's home, find the large roots first:

```bash
du -x -B1 -d1 /path/to/authorized/home | sort -nr | head -40
du -x -B1 -d1 /path/to/authorized/workspace | sort -nr | head -40
```

Typical categories are `runs`, `models`, `control/worktrees`, retention archives, caches, and temporary files. Treat a directory name as a clue, not deletion authority.

Docker is a **shared daemon**. `docker system df` reports daemon-wide storage, not per-user ownership. An image's repository name, a Compose label, or a task working directory does not justify charging the whole image to one person because image layers may be shared by many containers.

For account attribution, inspect container writable-layer size (`SizeRw`) and mounts. Assign a writable layer to an account **only** when a single reliable bind-mounted home identifies that owner. Keep ambiguous or ownerless writable layers separate. Then calculate the public buckets as:

```text
account attributable total = home bytes + reliably attributable Docker SizeRw
unattributed Docker writable layers = sum(SizeRw with no reliable account owner)
shared/system used = df used - sum(account attributable totals) - unattributed Docker writable layers
```

`df used` already includes the bytes represented by those buckets; do not add them again. Reconcile `df total` separately with `used + available + filesystem reserve/rounding`.

### Docker failure fallback

A daemon-wide summary can fail because one historical snapshot/image record is inconsistent. Do **not** repair the daemon, remove images, or run prune merely to make the audit command succeed. Instead:

1. record `docker system df` as unavailable for this snapshot;
2. continue the attribution audit with read-only per-container `docker inspect --size`;
3. if a batch inspect fails, retry per container or in smaller batches so one stale object does not erase all usable measurements;
4. count any truly unreadable containers and leave their size/ownership **unknown**, not zero;
5. publish only the measurements that were actually obtained.

## 3. Safety gate before any deletion

A path is not safe to delete merely because nothing has it open **right now**. Before mutation, answer all of these:

1. Is it owned by the user whose cleanup was authorized?
2. Is it part of the current or next planned experiment working set?
3. Do running processes, container mounts, watchers, or orchestration scripts reference it?
4. Is it unique scientific evidence, a checkpoint, a frozen model dependency, or a rollback point?
5. If it is rebuildable, is the exact immutable revision/content identity known?
6. If it is archived, has the archive passed SHA-256 and full-stream/listing verification?
7. If it is a Git checkout, is it clean and is the exact HEAD available from an accepted remote?

If any answer is unknown, classify it as **hold / inspect**, not delete.

## 4. Preferred reclaim order

Prefer reversible, high-confidence cleanup in this order:

1. Agent-created scratch and incomplete temporary artifacts that no other task uses.
2. Clean Git clones/worktrees whose exact HEAD is remote-recoverable and unreferenced.
3. Old text/JSON/log-heavy run directories: create a cold archive, record size + SHA-256 + restore command, verify `tar -tzf`, then remove the original directory.
4. Tool-owned caches after proving no relevant process is using them.
5. Exited container writable layers only when orchestration no longer needs their state; measure `SizeRw` first because hundreds of container shells may reclaim very little.
6. Unused Docker images only with ownership evidence and after proving no container references them. Never run broad shared-daemon prune from size output alone.

Models, checkpoints, active runs, latest retention points, and another user's files stay out of the quick-clean path unless the owner explicitly authorizes that exact asset after provenance/recovery review.

## 5. Cold-archive pattern

For an old unreferenced directory that should remain recoverable:

```bash
tar -C "$(dirname "$SRC")" -czf "$ARCHIVE.tmp" "$(basename "$SRC")"
tar -tzf "$ARCHIVE.tmp" >/dev/null
sha256sum "$ARCHIVE.tmp"
mv "$ARCHIVE.tmp" "$ARCHIVE"
# write manifest: source path, source bytes, archive bytes, SHA-256, restore command
rm -rf --one-file-system "$SRC"
```

Unix sockets and other non-persistable runtime endpoints may be skipped by `tar`; record that fact. Do not silently skip regular scientific files.

## 6. Reporting format

A useful quick report answers four questions in this order:

```text
filesystem: total / used / available / Use%
anonymous attributable ranking: User 1, User 2, ...
unattributed Docker writable layers: size / unknown count
shared/system remainder: size + what it may contain
safe reclaim candidates: estimated reclaim + why each is recoverable
```

After cleanup, report **measured deletion/reclaim bytes** separately from the new `df` value. Other experiments can write concurrently, so a change in free space is not automatically equal to the bytes deleted by this Agent.

## 7. Public-page privacy contract

When refreshing `/research/seed-openevo/flow/server/`:

- use a dated static snapshot with an explicit timezone;
- publish only anonymous user rankings and aggregate hardware/storage facts;
- regenerate anonymous numbering from that snapshot's attributable-total order and never single out “our” account;
- never publish or persist the identity mapping or a user's internal directory names;
- keep shared Docker/system usage unattributed unless ownership is independently proven;
- keep server inventory separate from live GPU allocation/authorization;
- update each factual number from the fresh measurement, not from chained global string replacement against the previous snapshot; after editing, sweep for stale old timestamp/used/free/percent/bucket values and verify the arithmetic before expensive browser acceptance;
- say that the page is a snapshot, not a live monitor.

The owning privacy/topology policy remains `personal-compute-profile-consumer.md`; this SOP owns the storage-audit procedure.
