import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { signup } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      navigate('/user/login');
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    const { confirmPassword: _, ...payload } = form;
    mutation.mutate(payload);
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block tracking-tighter mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Créer un compte</h1>
          <p className="text-white/40 text-sm mt-1">Rejoignez l'univers Marvel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 rounded-xl p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Nom d'utilisateur"
            id="username"
            type="text"
            placeholder="TonyStark"
            value={form.username}
            onChange={update('username')}
            required
          />

          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="tony@stark.com"
            value={form.email}
            onChange={update('email')}
            required
          />

          <Input
            label="Mot de passe"
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            required
          />

          <Input
            label="Confirmer le mot de passe"
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Création...' : 'Créer un compte'}
          </Button>

          <p className="text-center text-white/40 text-sm">
            Déjà un compte ?{' '}
            <Link to="/user/login" className="text-[#ec1d24] hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
