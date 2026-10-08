'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { notify } from '@/lib/notify';
import { signup } from '@/lib/api/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function Signup() {
  const router = useRouter();

  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const mutation = useAsyncAction({
    mutationFn: signup,
    onSuccess: () => {
      void notify('success', 'Compte créé !', 'Un email de bienvenue t\'a été envoyé.');
      router.push('/user/login');
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

    const { username, email, password } = form;
    mutation.mutate({ username, email, password });
  };

  const update = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-marvel text-white font-display text-3xl px-3 pt-1.5 pb-1 inline-block mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-display font-normal uppercase text-white">Créer un compte</h1>
          <p className="text-neutral-400 text-sm mt-1">Rejoignez l’univers Marvel</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel border-4 border-white shadow-[8px_8px_0_#ec1d24] p-8 flex flex-col gap-5">
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Input
            label="Nom d'utilisateur"
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            placeholder="TonyStark"
            value={form.username}
            onChange={update('username')}
            pattern="[\p{L}\p{N}_.\-]{3,30}"
            title="3 à 30 lettres, chiffres, « _ », « . » ou « - »"
            required
          />

          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tony@stark.com"
            value={form.email}
            onChange={update('email')}
            required
          />

          <Input
            label="Mot de passe"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            minLength={8}
            required
          />
          <p className="-mt-3 text-sm text-neutral-400">8 caractères minimum.</p>

          <Input
            label="Confirmer le mot de passe"
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Création...' : 'Créer un compte'}
          </Button>

          <p className="text-center text-neutral-400 text-sm">
            Déjà un compte ?{' '}
            <Link href="/user/login" className="text-marvel hover:underline">
              Se connecter
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
