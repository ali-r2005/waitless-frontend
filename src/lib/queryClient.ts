import { QueryClient } from '@tanstack/react-query'; // Or 'react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Optional: Add default settings, e.g., staleTime
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});