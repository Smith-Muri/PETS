import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from './ui/button';
import { useState } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-gradient-to-r from-white to-indigo-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center">
              <span className="text-lg">🐕</span>
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              PetsHub
            </h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-4 py-2 text-slate-700 hover:bg-indigo-100 rounded-lg transition font-medium"
            >
              Inicio
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className="px-4 py-2 text-slate-700 hover:bg-indigo-100 rounded-lg transition font-medium"
              >
                Mis Mascotas
              </Link>
            )}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900">{user?.name}</span>
                    <span className="text-xs text-slate-500">{user?.email}</span>
                  </div>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  size="sm"
                  className="gap-2 h-10"
                >
                  <LogOut size={16} />
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm" className="h-10">
                    Inicia Sesión
                  </Button>
                </Link>
                <Link to="/register">
                  <Button size="sm" className="h-10 font-semibold">
                    Registrarse
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-indigo-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X size={24} className="text-slate-700" />
            ) : (
              <Menu size={24} className="text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-slate-200 space-y-3">
            <Link
              to="/"
              className="block px-4 py-2 text-slate-700 hover:bg-indigo-100 rounded-lg transition font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Inicio
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-slate-700 hover:bg-indigo-100 rounded-lg transition font-medium"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mis Mascotas
                </Link>
                <div className="px-4 py-3 bg-indigo-50 rounded-lg border border-indigo-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center text-white font-bold">
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-900">{user?.name}</span>
                      <span className="text-xs text-slate-500">{user?.email}</span>
                    </div>
                  </div>
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="w-full gap-2 h-9"
                  >
                    <LogOut size={16} />
                    Cerrar Sesión
                  </Button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button variant="outline" className="w-full h-10">
                    Inicia Sesión
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="w-full">
                  <Button className="w-full h-10 font-semibold">
                    Registrarse
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

