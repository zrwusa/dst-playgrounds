import { useState, useCallback } from 'react';
import type { ModuleType } from '../types';

export function useCodeExecution() {
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const clearOutput = useCallback(() => {
    setOutput('');
    setError(null);
  }, []);

  const executeCode = useCallback(async (code: string, moduleType: ModuleType) => {
    if (!code.trim()) {
      setError('Please enter some code');
      return;
    }

    setIsLoading(true);
    setError(null);
    setOutput('');

    try {
      if (!window.dataStructureTyped) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/data-structure-typed/dist/umd/data-structure-typed.min.js';
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load library'));
          document.head.appendChild(script);
        });
      }

      const logs: string[] = [];
      const originalLog = console.log;
      const originalError = console.error;

      console.log = (...args: any[]) => {
        const message = args
          .map((arg) => {
            if (typeof arg === 'object') {
              try {
                return JSON.stringify(arg, null, 2);
              } catch {
                return String(arg);
              }
            }
            return String(arg);
          })
          .join(' ');
        logs.push(message);
        originalLog(...args);
      };

      console.error = (...args: any[]) => {
        const message = args.join(' ');
        logs.push(`ERROR: ${message}`);
        originalError(...args);
      };

      try {
        if (moduleType === 'esm') {
          const blob = new Blob([code], { type: 'application/javascript' });
          const url = URL.createObjectURL(blob);
          try {
            await import(url);
            URL.revokeObjectURL(url);
          } catch (e) {
            URL.revokeObjectURL(url);
            throw e;
          }
        } else if (moduleType === 'cjs') {
          const require = (moduleName: string) => {
            if (moduleName === 'data-structure-typed') {
              return window.dataStructureTyped;
            }
            throw new Error(`Module not found: ${moduleName}`);
          };
          const module = { exports: {} };
          const exports = module.exports;
          eval(code);
        } else if (moduleType === 'umd') {
          eval(code);
        }

        console.log = originalLog;
        console.error = originalError;

        setOutput(logs.length > 0 ? logs.join('\n') : '✓ Code executed successfully');
      } catch (error) {
        console.log = originalLog;
        console.error = originalError;
        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      setOutput('');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { output, error, isLoading, executeCode, clearOutput };
}
