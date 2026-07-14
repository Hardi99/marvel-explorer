import { lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
// Home reste en eager : c'est la landing page auditée (/), on évite une requête en cascade.
import Home from './pages/Home';
// Les autres routes sont chargées à la demande (code-splitting) pour alléger le bundle initial.
const Characters = lazy(() => import('./pages/Characters'));
const Character = lazy(() => import('./pages/Character'));
const Comics = lazy(() => import('./pages/Comics'));
const Comic = lazy(() => import('./pages/Comic'));
const Favourites = lazy(() => import('./pages/Favourites'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const NotFound = lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              {/* Routes publiques */}
              <Route path="/" element={<Home />} />
              <Route path="/user/login" element={<Login />} />
              <Route path="/user/signup" element={<Signup />} />
              <Route path="/user/forgot-password" element={<ForgotPassword />} />
              <Route path="/user/reset-password" element={<ResetPassword />} />

              {/* Routes protégées */}
              <Route element={<ProtectedRoute />}>
                <Route path="/characters" element={<Characters />} />
                <Route path="/character/:id" element={<Character />} />
                <Route path="/comics" element={<Comics />} />
                <Route path="/comic/:id" element={<Comic />} />
                <Route path="/favourites" element={<Favourites />} />
              </Route>

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#1a1a1a',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#f1f1f1',
            },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
