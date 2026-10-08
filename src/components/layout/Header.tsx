'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { logout as logoutApi } from '@/lib/api/auth';
import { Logo } from './Logo';
import { LogOut, User, Lock, Menu, X, Search } from 'lucide-react';

// Lien de navigation qui se signale comme page courante (équivalent du NavLink de React Router).
function NavLink({ href, className, onClick, children }: {
  href: string;
  className: (state: { isActive: boolean }) => string;
  onClick?: () => void;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href.replace(/s$/, '')}/`) || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className={className({ isActive })} aria-current={isActive ? 'page' : undefined} onClick={onClick}>
      {children}
    </Link>
  );
}

export function Header() {
  const { isLoggedIn, username, logout } = useAuthStore();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi().catch(() => {});
    logout();
    setMenuOpen(false);
    router.push('/');
  };

  const closeMenu = () => setMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 font-bold text-[17px] tracking-[2px] uppercase transition-colors ${
      isActive ? 'text-white underline decoration-marvel decoration-[3px] underline-offset-8' : 'text-neutral-300 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 py-3 px-6 font-display text-2xl uppercase border-b border-white/10 ${
      isActive ? 'text-marvel' : 'text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-ink border-b-[3px] border-marvel">
      <div className="max-w-[1320px] mx-auto px-6 h-[72px] flex items-center gap-8">
        <Link href="/" aria-label="Marvel Explorer, accueil" className="flex items-center gap-2.5" onClick={closeMenu}>
          <Logo />
          <span className="hidden sm:inline font-display text-[15px] tracking-[3px] text-white">EXPLORER</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:flex gap-7 flex-1">
          <NavLink href="/characters" className={navLinkClass}>Personnages</NavLink>
          <NavLink href="/comics" className={navLinkClass}>Comics</NavLink>
          <NavLink href="/favourites" className={navLinkClass}>
            Favoris
            {!isLoggedIn && <Lock size={14} strokeWidth={2.5} aria-label="(compte requis)" />}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3.5 ml-auto">
          <Link
            href="/characters"
            aria-label="Rechercher un personnage"
            className="w-11 h-11 flex items-center justify-center border-2 border-neutral-700 text-white hover:border-white transition-colors"
          >
            <Search size={20} strokeWidth={2.5} />
          </Link>

          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                <span className="flex items-center gap-1.5 text-neutral-300 text-base">
                  <User size={16} /> {username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-11 flex items-center gap-2 px-4 border-2 border-white text-white font-bold tracking-[1.5px] uppercase hover:bg-white hover:text-ink transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/user/login"
                className="h-11 flex items-center px-[18px] border-2 border-white text-white font-bold text-base tracking-[1.5px] uppercase hover:bg-white hover:text-ink transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>

          <button
            type="button"
            className="md:hidden w-11 h-11 flex items-center justify-center text-white cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-ink border-t border-white/10">
          <nav aria-label="Navigation mobile" className="flex flex-col">
            <NavLink href="/characters" className={mobileNavLinkClass} onClick={closeMenu}>Personnages</NavLink>
            <NavLink href="/comics" className={mobileNavLinkClass} onClick={closeMenu}>Comics</NavLink>
            <NavLink href="/favourites" className={mobileNavLinkClass} onClick={closeMenu}>
              Favoris {!isLoggedIn && <Lock size={18} aria-label="(compte requis)" />}
            </NavLink>
            <div className="p-6">
              {isLoggedIn ? (
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-neutral-300"><User size={16} /> {username}</span>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="h-11 flex items-center gap-2 px-4 border-2 border-white font-bold uppercase tracking-[1.5px] cursor-pointer"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </div>
              ) : (
                <Link
                  href="/user/login"
                  onClick={closeMenu}
                  className="h-12 flex items-center justify-center border-2 border-white font-bold uppercase tracking-[1.5px]"
                >
                  Se connecter
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
