'use client';
import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import NextAppDirEmotionCacheProvider from './EmotionCache';
import type { ReactNode } from 'react';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

// Define the props type
interface ThemeRegistryProps {
  children: ReactNode;
}

// Apply the type to the props
export default function ThemeRegistry({ children }: ThemeRegistryProps) {
  return (
    <NextAppDirEmotionCacheProvider options={{ key: 'mui' }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}