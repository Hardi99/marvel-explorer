import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { logout as logoutApi } from '../../api/auth';
import { LogOut, User, Lock, Menu, X, Search } from 'lucide-react';

export function Logo({ size = 'md' }: { size?: 'sm' | 'md' }) {
  return (
    <span
      className={`bg-marvel text-white font-display leading-none tracking-[-0.5px] ${
        size === 'md' ? 'text-[30px] px-2.5 pt-1.5 pb-1' : 'text-xl px-2 pt-1 pb-0.5'
      }`}
    >
      MARVEL
    </span>
  );
}

export function Header() {
  const { isLoggedIn, username, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logoutApi().catch(() => {});
    logout();
    setMenuOpen(false);
    navigate('/');
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
        <Link to="/" aria-label="Marvel Explorer, accueil" className="flex items-center gap-2.5" onClick={closeMenu}>
          <Logo />
          <span className="hidden sm:inline font-display text-[15px] tracking-[3px] text-white">EXPLORER</span>
        </Link>

        <nav aria-label="Navigation principale" className="hidden md:flex gap-7 flex-1">
          <NavLink to="/characters" className={navLinkClass}>Personnages</NavLink>
          <NavLink to="/comics" className={navLinkClass}>Comics</NavLink>
          <NavLink to="/favourites" className={navLinkClass}>
            Favoris
            {!isLoggedIn && <Lock size={14} strokeWidth={2.5} aria-label="(compte requis)" />}
          </NavLink>
        </nav>

        <div className="flex items-center gap-3.5 ml-auto">
          <Link
            to="/characters"
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
                to="/user/login"
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
            <NavLink to="/characters" className={mobileNavLinkClass} onClick={closeMenu}>Personnages</NavLink>
            <NavLink to="/comics" className={mobileNavLinkClass} onClick={closeMenu}>Comics</NavLink>
            <NavLink to="/favourites" className={mobileNavLinkClass} onClick={closeMenu}>
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
                  to="/user/login"
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
