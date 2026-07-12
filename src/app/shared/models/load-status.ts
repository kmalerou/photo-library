export type LoadStatus<TError = string> =
  'idle' | 'loading' | 'loaded' | { readonly error: TError };
