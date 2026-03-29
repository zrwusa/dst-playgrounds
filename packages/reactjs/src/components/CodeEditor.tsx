import React from 'react';
import { Play, RotateCcw } from 'lucide-react';

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onClear: () => void;
  isLoading: boolean;
}

export default function CodeEditor({
  value,
  onChange,
  onRun,
  onClear,
  isLoading,
}: CodeEditorProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Code Editor</h2>
      </div>

      <div className="flex-1 overflow-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full p-6 font-mono text-sm text-slate-900 bg-slate-50 
            border-none outline-none resize-none placeholder-slate-400
            focus:bg-white focus:ring-2 focus:ring-blue-500 focus:ring-inset"
          placeholder="Enter your code here..."
          spellCheck="false"
        />
      </div>

      <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex gap-3">
        <button
          onClick={onRun}
          disabled={isLoading}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 
            disabled:bg-slate-400 disabled:cursor-not-allowed
            text-white font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <Play size={18} />
          {isLoading ? 'Running...' : 'Run Code'}
        </button>

        <button
          onClick={onClear}
          disabled={isLoading}
          className="flex items-center justify-center gap-2 bg-slate-200 hover:bg-slate-300 
            disabled:bg-slate-100 disabled:cursor-not-allowed
            text-slate-700 font-semibold py-2 px-4 rounded-lg transition-colors"
        >
          <RotateCcw size={18} />
          Clear
        </button>
      </div>
    </div>
  );
}
