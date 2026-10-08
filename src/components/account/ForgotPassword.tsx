'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAsyncAction } from '@/hooks/useAsyncAction';
import { forgotPassword } from '@/lib/api/auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const mutation = useAsyncAction({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-marvel text-white font-display text-3xl px-3 pt-1.5 pb-1 inline-block mb-8">
            MARVEL
          </div>
          <div className="bg-panel border-4 border-white shadow-[8px_8px_0_#ec1d24] p-8">
            <div className="w-10 h-1 bg-marvel mx-auto mb-6" />
            <h2 className="text-xl font-display font-normal uppercase text-white mb-3">Email envoyé</h2>
            <p className="text-neutral-400 text-sm leading-relaxed mb-6">
              Si un compte existe pour <span className="text-white/70">{email}</span>, tu recevras un lien de réinitialisation valable 1 heure.
            </p>
            <Link href="/user/login" className="text-marvel text-sm hover:underline">
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="bg-marvel text-white font-display text-3xl px-3 pt-1.5 pb-1 inline-block mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-display font-normal uppercase text-white">Mot de passe oublié</h1>
          <p className="text-neutral-400 text-sm mt-1">Un lien de réinitialisation sera envoyé à ton adresse</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="bg-panel border-4 border-white shadow-[8px_8px_0_#ec1d24] p-8 flex flex-col gap-5"
        >
          <Input
            label="Email"
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="tony@stark.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Envoi...' : 'Envoyer le lien'}
          </Button>

          <p className="text-center text-neutral-400 text-sm">
            <Link href="/user/login" className="text-marvel hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
