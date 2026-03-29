export const examples = {
  heap: {
    esm: `import { MinHeap, MaxHeap } from 'https://cdn.jsdelivr.net/npm/data-structure-typed/dist/esm/index.js';

const minHeap = new MinHeap([9, 5, 6, 2, 3]);
console.log('MinHeap:', minHeap.toArray());
console.log('Poll:', minHeap.poll());`,
    cjs: `const { MinHeap } = require('data-structure-typed');
const minHeap = new MinHeap([9, 5, 6, 2, 3]);
console.log('MinHeap:', minHeap.toArray());`,
    umd: `const { MinHeap } = window.dataStructureTyped;
const minHeap = new MinHeap([9, 5, 6, 2, 3]);
console.log('MinHeap:', minHeap.toArray());`
  },
  // ... 其他 6 个示例（参考 COMPLETE_CODE_PACKAGE.md）
};
