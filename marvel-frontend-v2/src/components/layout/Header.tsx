import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/auth';
import { LogOut, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function Header() {
  const { token, username, logout } = useAuthStore();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/');
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-semibold uppercase tracking-widest transition-colors ${
      isActive ? 'text-[#ec1d24]' : 'text-white/70 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `block py-3 px-4 text-base font-semibold uppercase tracking-widest transition-colors border-b border-white/5 ${
      isActive ? 'text-[#ec1d24]' : 'text-white/70 hover:text-white hover:bg-white/5'
    }`;

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <div className="bg-[#ec1d24] text-white font-black text-xl px-3 py-1 tracking-tighter">
            MARVEL
          </div>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={navLinkClass}>Accueil</NavLink>
          <NavLink to="/characters" className={navLinkClass}>Personnages</NavLink>
          <NavLink to="/comics" className={navLinkClass}>Comics</NavLink>
          {token && (
            <NavLink to="/favourites" className={navLinkClass}>
              <span className="flex items-center gap-1.5">
                <Heart size={14} />
                Favoris
              </span>
            </NavLink>
          )}
        </nav>

        {/* Auth desktop */}
        <div className="hidden md:flex items-center gap-3 flex-shrink-0">
          {token ? (
            <>
              <span className="text-white/50 text-sm flex items-center gap-1.5">
                <User size={14} />
                {username}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-white/50 hover:text-[#ec1d24] text-sm transition-colors"
              >
                <LogOut size={16} />
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/user/login">
                <Button variant="ghost" size="sm">Connexion</Button>
              </Link>
              <Link to="/user/signup">
                <Button size="sm">S'inscrire</Button>
              </Link>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors ml-auto"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="md:hidden bg-black/95 border-t border-white/5">
          <nav className="flex flex-col">
            <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Accueil
            </NavLink>
            <NavLink to="/characters" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Personnages
            </NavLink>
            <NavLink to="/comics" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
              Comics
            </NavLink>
            {token && (
              <NavLink to="/favourites" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                <span className="flex items-center gap-1.5">
                  <Heart size={14} />
                  Favoris
                </span>
              </NavLink>
            )}

            <div className="p-4 flex flex-col gap-3 border-t border-white/5">
              {token ? (
                <>
                  <span className="text-white/40 text-sm flex items-center gap-1.5">
                    <User size={14} /> {username}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-white/50 hover:text-[#ec1d24] text-sm transition-colors"
                  >
                    <LogOut size={16} /> Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <Link to="/user/login" onClick={() => setMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Connexion</Button>
                  </Link>
                  <Link to="/user/signup" onClick={() => setMenuOpen(false)}>
                    <Button size="sm" className="w-full">S'inscrire</Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
