import { Suspense, useEffect } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { ErrorBoundary } from "@/components/shared";
import { OnboardingDialog } from "@/components/shared/OnboardingDialog";
import { AuthProvider } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import AuthPage from "./pages/AuthPage";
import { routes, preloadAllOnIdle } from "@/lib/routePreload";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60_000, refetchOnWindowFocus: false, retry: 1 } },
});

function PageFallback() {
  return <div className="min-h-[40vh]" aria-hidden />;
}

function RoutePrewarmer() {
  useEffect(() => { preloadAllOnIdle(); }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={200}>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<AuthPage />} />
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <OnboardingDialog />
                  <RoutePrewarmer />
                  <AppLayout>
                    <ErrorBoundary>
                      <Suspense fallback={<PageFallback />}>
                        <Routes>
                          {Object.entries(routes).map(([path, Comp]) => (
                            <Route key={path} path={path} element={<Comp />} />
                          ))}
                          <Route path="*" element={<NotFound />} />
                        </Routes>
                      </Suspense>
                    </ErrorBoundary>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
