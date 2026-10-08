import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { PageSpinner } from '../ui/Spinner';

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-ink text-white overflow-x-clip">
      <Header />
      <main className="flex-1 min-h-[100svh]">
        {/* Fallback affiché pendant le chargement d'une page lazy — le Header reste visible. */}
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
