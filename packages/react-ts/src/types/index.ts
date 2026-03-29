export type ModuleType = 'esm' | 'cjs' | 'umd';

export interface Example {
  esm: string;
  cjs: string;
  umd: string;
}

export interface ExecutionResult {
  output: string;
  error: string | null;
}
