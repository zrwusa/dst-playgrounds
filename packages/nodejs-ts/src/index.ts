import { TreeMap, TreeSet, RedBlackTree } from 'data-structure-typed';

// Descending comparator — highest scores first
const leaderboard = new RedBlackTree<number, string>(
  [
    [100, 'Alice'],
    [85, 'Bob'],
    [92, 'Charlie'],
  ],
  { comparator: (a, b) => b - a }
);

// Top-2 via lazy iterator — O(2 log n), no full traversal
const iter = leaderboard.entries();
for (let i = 0; i < 2; i++) {
  const {
    value: [score, player],
  } = iter.next();
  console.log(`${score}: ${player}`);
}
// Output: 100: Alice → 92: Charlie

// Update score — O(log n)
leaderboard.delete(85);
leaderboard.set(95, 'Bob');

// Top-k — O(k log n), no array copy needed
const top3: [number, string][] = [];
let score = leaderboard.getLeftMost(); // highest score
while (score !== undefined && top3.length < 3) {
  top3.push([score, leaderboard.get(score)!]);
  score = leaderboard.higher(score); // next in tree order
}

// Range query — players scoring 90~100, O(log n + k)
const scores90to100 = leaderboard.rangeSearch([90, 100]);
// [100, 95, 92] — automatically respects tree order

// TreeMap range search for filtering

interface Product {
  name: string;
  price: number;
}

const products = [
  { name: 'Item A', price: 10 },
  { name: 'Item B', price: 25 },
  { name: 'Item C', price: 40 },
  { name: 'Item D', price: 50 },
];

const priceIndexedProducts = new TreeMap<number, Product, Product>(products, {
  toEntryFn: (rawProduct) => [rawProduct.price, rawProduct],
});

// Find products in price range [20, 45]
const inRangeEntries = priceIndexedProducts.rangeSearch([20, 45]);

console.log(inRangeEntries);
// [
//   [ 25, { name: 'Item B', price: 25 } ],
//   [ 40, { name: 'Item C', price: 40 } ]
// ];

interface User {
  id: number;
  name: string;
}

const users: User[] = [
  { id: 3, name: 'Charlie' },
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
];

// 1. Extract a field — store only that field
const ids = new TreeSet<number, User>(users, { toElementFn: (u) => u.id });
// [1, 2, 3] — numbers only, original objects not kept

// 2. Store full objects — sort by a field
const fullSet = new TreeSet<User>(users, { comparator: (a, b) => a.id - b.id });
// [{ id: 1, name: 'Alice' }, { id: 2, ... }, { id: 3, ... }]

// 3. Split into key-value — field as key, anything as value
const map = new TreeMap<number, User, User>(users, {
  toEntryFn: (u) => [u.id, u],
});
// map.get(1) → { id: 1, name: 'Alice' }
