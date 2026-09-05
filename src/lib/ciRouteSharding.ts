export function partitionRoundRobin<T>(
  items: readonly T[],
  shardCount: number,
): T[][] {
  if (!Number.isInteger(shardCount) || shardCount < 1) {
    throw new Error(`shardCount must be a positive integer, got ${shardCount}`);
  }

  const shards = Array.from({ length: shardCount }, () => [] as T[]);
  items.forEach((item, index) => {
    shards[index % shardCount]!.push(item);
  });
  return shards;
}
