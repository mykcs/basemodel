import { describe, expect, it } from 'vitest';
import { partitionRoundRobin } from './ciRouteSharding';

describe('CI route sharding', () => {
  it('covers every input exactly once across four shards', () => {
    const routes = Array.from({ length: 86 }, (_, index) => `/route-${index}/`);
    const shards = partitionRoundRobin(routes, 4);
    const flattened = shards.flat();

    expect(shards.map((shard) => shard.length)).toEqual([22, 22, 21, 21]);
    expect(flattened).toHaveLength(routes.length);
    expect(new Set(flattened).size).toBe(routes.length);
    expect([...flattened].sort()).toEqual([...routes].sort());
  });

  it('keeps deterministic index-modulo ownership', () => {
    expect(partitionRoundRobin(['a', 'b', 'c', 'd', 'e'], 2)).toEqual([
      ['a', 'c', 'e'],
      ['b', 'd'],
    ]);
  });

  it('rejects invalid shard counts', () => {
    expect(() => partitionRoundRobin(['a'], 0)).toThrow(/positive integer/);
    expect(() => partitionRoundRobin(['a'], 1.5)).toThrow(/positive integer/);
  });
});
