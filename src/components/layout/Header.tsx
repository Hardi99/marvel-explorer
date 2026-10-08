'use client';

import { useEffect, useState } from 'react';
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

  // Échap referme le menu mobile.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-1.5 font-bold text-[17px] tracking-[2px] uppercase transition-colors ${
      isActive ? 'text-white underline decoration-marvel decoration-[3px] underline-offset-8' : 'text-neutral-300 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `page-x flex items-center gap-2 py-3 font-display text-2xl uppercase border-b border-white/10 ${
      isActive ? 'text-marvel' : 'text-white'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-ink border-b-[3px] border-marvel">
      <div className="page-x h-[72px] flex items-center gap-8">
        <Link href="/" aria-label="Marvel Explorer, accueil" className="flex items-center gap-2.5" onClick={closeMenu}>
          <Logo />
          <span className="hidden sm:inline font-display text-[15px] tracking-[3px] text-white">EXPLORER</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:flex gap-7 flex-1">
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
            onClick={closeMenu}
            className="shrink-0 w-11 h-11 flex items-center justify-center border-2 border-neutral-700 text-white hover:border-white transition-colors"
          >
            <Search size={20} strokeWidth={2.5} />
          </Link>

          <div className="hidden lg:flex items-center gap-4">
            {isLoggedIn ? (
              <>
                {/* Nom affiché seulement quand la place le permet */}
                <span className="hidden xl:flex items-center gap-1.5 text-neutral-300 text-base whitespace-nowrap">
                  <User size={16} /> {username}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="h-11 flex items-center gap-2 px-4 border-2 border-white text-white font-bold tracking-[1.5px] uppercase whitespace-nowrap hover:bg-white hover:text-ink transition-colors cursor-pointer"
                >
                  <LogOut size={16} /> Déconnexion
                </button>
              </>
            ) : (
              <Link
                href="/user/login"
                className="h-11 flex items-center px-[18px] border-2 border-white text-white font-bold text-base tracking-[1.5px] uppercase whitespace-nowrap hover:bg-white hover:text-ink transition-colors"
              >
                Se connecter
              </Link>
            )}
          </div>

          <button
            type="button"
            className="lg:hidden w-11 h-11 flex items-center justify-center text-white cursor-pointer"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Menu mobile toujours présent, déplié en douceur (hauteur 0 → contenu) ; « inert » le retire
          du clavier et des lecteurs d'écran quand il est replié. */}
      <div
        id="mobile-menu"
        inert={!menuOpen}
        className={`lg:hidden grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${
          menuOpen ? 'grid-rows-[1fr] border-t border-white/10' : 'grid-rows-[0fr]'
        }`}
      >
        <div className="overflow-hidden bg-ink">
          <nav aria-label="Navigation mobile" className="flex flex-col">
            <NavLink href="/characters" className={mobileNavLinkClass} onClick={closeMenu}>Personnages</NavLink>
            <NavLink href="/comics" className={mobileNavLinkClass} onClick={closeMenu}>Comics</NavLink>
            <NavLink href="/favourites" className={mobileNavLinkClass} onClick={closeMenu}>
              Favoris {!isLoggedIn && <Lock size={18} aria-label="(compte requis)" />}
            </NavLink>
            <div className="page-x py-6">
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
      </div>
    </header>
  );
}
