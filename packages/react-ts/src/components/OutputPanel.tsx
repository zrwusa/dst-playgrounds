import React from 'react';
import { AlertCircle, CheckCircle, Loader } from 'lucide-react';

interface OutputPanelProps {
  output: string;
  error: string | null;
  isLoading: boolean;
}

export default function OutputPanel({
  output,
  error,
  isLoading,
}: OutputPanelProps) {
  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-md overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-slate-50 to-slate-100 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
        <h2 className="text-lg font-semibold text-slate-900">Output</h2>
        {isLoading && <Loader size={18} className="animate-spin text-blue-600" />}
      </div>

      <div className="flex-1 overflow-auto">
        {error ? (
          <div className="h-full p-6 bg-red-50 flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-red-900">Error</h3>
                <pre className="mt-2 text-sm text-red-700 whitespace-pre-wrap break-words font-mono">
                  {error}
                </pre>
              </div>
            </div>
          </div>
        ) : output ? (
          <div className="h-full p-6 bg-green-50">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-1" />
              <h3 className="font-semibold text-green-900">Success</h3>
            </div>
            <pre className="text-sm text-slate-900 whitespace-pre-wrap break-words font-mono bg-white p-4 rounded border border-green-200">
              {output}
            </pre>
          </div>
        ) : (
          <div className="h-full p-6 flex items-center justify-center bg-slate-50">
            <div className="text-center text-slate-500">
              <p className="font-semibold mb-2">No output yet</p>
              <p className="text-sm">Write code and click "Run Code" to see results</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-600">
        <p>💡 Tip: Use console.log() to print values</p>
      </div>
    </div>
  );
}
