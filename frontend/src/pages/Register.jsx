import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { useAuth } from '../hooks/useAuth';
import { Eye, EyeOff, Check } from 'lucide-react';
import { authAPI } from '../services/api';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const passwordLength = password.length;
  const passwordValid = passwordLength >= 8;

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Todos los campos son requeridos');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener mínimo 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.register({ name, email, password });
      const { token, user } = response.data.data;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error en registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full">
            <span className="text-3xl">🐕</span>
          </div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
            PetsHub
          </h1>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-indigo-100 border-b border-indigo-200 pb-6">
            <CardTitle className="text-center text-2xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-indigo-800">
              Crear Cuenta
            </CardTitle>
            <p className="text-center text-sm text-slate-600 mt-2">
              Únete a nuestra comunidad de amantes de mascotas
            </p>
          </CardHeader>

          <CardContent className="pt-8">
            <form onSubmit={handleRegister} className="space-y-6">
              {/* Nombre */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Nombre Completo
                </label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Juan Pérez"
                  required
                  className="bg-slate-50"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="bg-slate-50"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Contraseña
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="bg-slate-50 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-500 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                {/* Password Strength */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="h-2 flex-1 bg-slate-200 rounded-full overflow-hidden mr-2">
                    <div
                      className={`h-full transition-all ${
                        passwordLength === 0
                          ? 'w-0 bg-slate-200'
                          : passwordLength < 8
                          ? 'w-1/2 bg-orange-500'
                          : 'w-full bg-green-500'
                      }`}
                      style={{ width: `${Math.min((passwordLength / 12) * 100, 100)}%` }}
                    ></div>
                  </div>
                  {passwordValid && <Check size={18} className="text-green-500" />}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Mínimo 8 caracteres
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={loading || !passwordValid}
                className="w-full h-11 text-base font-semibold"
              >
                {loading ? 'Registrando...' : 'Crear Cuenta'}
              </Button>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500">o</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-slate-600">
                  ¿Ya tienes cuenta?{' '}
                  <Link
                    to="/login"
                    className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                  >
                    Inicia Sesión
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © 2024 PetsHub. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}

