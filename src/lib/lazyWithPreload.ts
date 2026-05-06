import { ComponentType, lazy } from 'react';

export type PreloadableComponent<T extends ComponentType<any>> = ReturnType<typeof lazy<T>> & {
  preload: () => Promise<{ default: T }>;
};

/**
 * Wraps React.lazy with a `preload()` method so chunks can be fetched
 * eagerly on hover/touchstart for instant navigation.
 */
export function lazyWithPreload<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): PreloadableComponent<T> {
  let promise: Promise<{ default: T }> | null = null;
  const load = () => {
    if (!promise) promise = factory();
    return promise;
  };
  const Component = lazy(load) as PreloadableComponent<T>;
  Component.preload = load;
  return Component;
}
