import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { PageSpinner } from '../ui/Spinner';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />
      <main>
        {/* Fallback affiché pendant le chargement d'une page lazy — le Header reste visible. */}
        <Suspense fallback={<PageSpinner />}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
