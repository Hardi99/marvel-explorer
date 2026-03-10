import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function Layout() {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
