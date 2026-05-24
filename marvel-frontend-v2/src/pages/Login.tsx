import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { useAuthStore } from '../store/auth';
import { login } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location })?.from?.pathname ?? '/';
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAuth(data.username);
      navigate(from, { replace: true });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    mutation.mutate(form);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block tracking-tighter mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Connexion</h1>
          <p className="text-white/40 text-sm mt-1">Accédez à l'univers Marvel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 rounded-xl p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="tony@stark.com"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            required
          />

          <Input
            label="Mot de passe"
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Connexion...' : 'Se connecter'}
          </Button>

          <div className="flex items-center justify-between text-sm">
            <Link to="/user/forgot-password" className="text-white/40 hover:text-white/70 transition-colors">
              Mot de passe oublié ?
            </Link>
            <p className="text-white/40">
              <Link to="/user/signup" className="text-[#ec1d24] hover:underline">
                S'inscrire
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
