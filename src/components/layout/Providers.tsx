'use client'; // Essential if you're using App Router in Next.js

import { QueryClientProvider } from '@tanstack/react-query'; // Or 'react-query'
import { queryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}