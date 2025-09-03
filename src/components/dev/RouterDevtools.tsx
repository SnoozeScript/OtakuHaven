import { TanStackRouterDevtools } from '@tanstack/router-devtools';

export const RouterDevtools = () => {
  // Only show in development
  if (import.meta.env.PROD) return null;
  
  return <TanStackRouterDevtools />;
};
