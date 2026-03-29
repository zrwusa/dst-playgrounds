import { RedBlackTree, TreeSet, TreeMap } from 'data-structure-typed';

const tree = new RedBlackTree([5, 2, 8, 1, 9]);
tree.has(3); // O(log n) - Logarithmic search

// Iterating tree is already sorted
for (const [key] of tree) {
  console.log(key); // 1, 2, 5, 8, 9 (automatically sorted!)
}

const users = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// 1. Extract a field — store only that field
const ids = new TreeSet(users, { toElementFn: (u) => u.id });
console.log([...ids]);
// [1, 2, 3] — numbers only, original objects not kept

// 2. Store full objects — sort by a field
const fullSet = new TreeSet(users, { comparator: (a, b) => a.id - b.id });

console.log([...fullSet]);
// [{ id: 1, name: 'Alice' }, { id: 2, ... }, { id: 3, ... }]

// 3. Split into key-value — field as key, anything as value
const map = new TreeMap(users, { toEntryFn: (u) => [u.id, u] });

console.log(map.get(1));
// map.get(1) → { id: 1, name: 'Alice' }
