import React from 'react';
import { examples } from '../data/examples';
import type { ModuleType } from '../types';

interface ExampleSelectorProps {
  currentTab: ModuleType;
  onExampleChange: (exampleKey: string) => void;
}

const exampleLabels = {
  heap: '📚 Heap (Min/Max)',
  stack: '📌 Stack Operations',
  queue: '📤 Queue & Deque',
  linkedlist: '🔗 Linked List',
  bst: '🌳 Binary Search Tree',
  graph: '🕸️ Graph & DFS',
  trie: '🔤 Trie Search',
};

export default function ExampleSelector({
  currentTab,
  onExampleChange,
}: ExampleSelectorProps) {
  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      <label className="block text-sm font-semibold text-slate-900 mb-3">
        Load Example
      </label>

      <div className="relative">
        <select
          onChange={(e) => onExampleChange(e.target.value)}
          defaultValue="heap"
          className="w-full appearance-none px-4 py-2 pr-10 border border-slate-300 rounded-lg
            bg-white text-slate-900 font-medium
            hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0
            cursor-pointer transition-colors"
        >
          <option value="">-- Select an example --</option>
          {Object.entries(exampleLabels).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>

        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-600">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 10 10 6 14 10"></polyline>
          </svg>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-200">
        <p className="text-xs text-slate-600">
          Current module type: <span className="font-semibold text-slate-900">{currentTab.toUpperCase()}</span>
        </p>
        <p className="text-xs text-slate-500 mt-2">
          {currentTab === 'esm' && '📍 ES Modules (browser native)'}
          {currentTab === 'cjs' && '📍 CommonJS (Node.js standard)'}
          {currentTab === 'umd' && '📍 Universal Module (all environments)'}
        </p>
      </div>
    </div>
  );
}
