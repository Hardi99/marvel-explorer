'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { notify } from '@/lib/notify';
import { resetPassword } from '@/lib/api/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldError, setFieldError] = useState('');

  const mutation = useAsyncAction({
    mutationFn: () => resetPassword(token, password),
    onSuccess: () => {
      void notify('success', 'Mot de passe mis à jour', 'Tu peux maintenant te connecter.');
      router.push('/user/login');
    },
  });

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Lien invalide ou expiré.</p>
          <Link href="/user/forgot-password" className="text-marvel hover:underline text-sm">
            Demander un nouveau lien
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError('');
    if (password !== confirm) {
      setFieldError('Les mots de passe ne correspondent pas.');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-marvel text-white font-display text-3xl px-3 pt-1.5 pb-1 inline-block mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-display font-normal uppercase text-white">Nouveau mot de passe</h1>
          <p className="text-neutral-400 text-sm mt-1">Choisis un mot de passe d’au moins 8 caractères</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-panel border-4 border-white shadow-[8px_8px_0_#ec1d24] p-8 flex flex-col gap-5">
          {(fieldError || mutation.isError) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
              {fieldError || (mutation.error as Error).message}
            </div>
          )}

          <Input
            label="Nouveau mot de passe"
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />

          <Input
            label="Confirmer le mot de passe"
            id="confirm"
            name="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Mise à jour...' : 'Mettre à jour'}
          </Button>
        </form>
      </div>
    </div>
  );
}
