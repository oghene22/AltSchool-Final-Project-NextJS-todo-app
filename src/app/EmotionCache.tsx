'use client';
import * as React from 'react';
import { useServerInsertedHTML } from 'next/navigation';
import createCache from '@emotion/cache';
import { CacheProvider as EmotionCacheProvider } from '@emotion/react'; 
import type { EmotionCache, Options as EmotionCacheOptions } from '@emotion/cache'; 
import type { ReactNode } from 'react'; 

interface NextAppDirEmotionCacheProviderProps {
  options: Omit<EmotionCacheOptions, 'insertionPoint'>;
  children: ReactNode;
}

export default function NextAppDirEmotionCacheProvider(props: NextAppDirEmotionCacheProviderProps) { 
  const { options, children } = props;

  const [{ cache, flush }] = React.useState<{
    cache: EmotionCache;
    flush: () => string[];
  }>(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = []; 
    cache.insert = (...args) => {
      const serialized = args[1];
      if (typeof serialized === 'object' && serialized !== null && 'name' in serialized && typeof serialized.name === 'string') {
        if (cache.inserted[serialized.name] === undefined) {
          inserted.push(serialized.name);
        }
      }
      return prevInsert(...args);
    };
    const flush = (): string[] => { 
      const prevInserted = inserted;
      inserted = []; 
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();
    if (names.length === 0) {
      return null;
    }
    let styles = '';
    for (const name of names) {
      styles += cache.inserted[name];
    }
    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(' ')}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <EmotionCacheProvider value={cache}>{children}</EmotionCacheProvider>;
}