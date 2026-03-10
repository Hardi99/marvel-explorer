import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email),
    onSuccess: () => setSent(true),
  });

  if (sent) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block tracking-tighter mb-8">
            MARVEL
          </div>
          <div className="bg-zinc-900 border border-white/5 rounded-xl p-8">
            <div className="w-10 h-1 bg-[#ec1d24] mx-auto mb-6" />
            <h2 className="text-xl font-black uppercase text-white mb-3">Email envoyé</h2>
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Si un compte existe pour <span className="text-white/70">{email}</span>, tu recevras un lien de réinitialisation valable 1 heure.
            </p>
            <Link to="/user/login" className="text-[#ec1d24] text-sm hover:underline">
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
          <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block tracking-tighter mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Mot de passe oublié</h1>
          <p className="text-white/40 text-sm mt-1">Un lien de réinitialisation sera envoyé à ton adresse</p>
        </div>

        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="bg-zinc-900 border border-white/5 rounded-xl p-8 flex flex-col gap-5"
        >
          <Input
            label="Email"
            id="email"
            type="email"
            placeholder="tony@stark.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Button type="submit" disabled={mutation.isPending} className="mt-2">
            {mutation.isPending ? 'Envoi...' : 'Envoyer le lien'}
          </Button>

          <p className="text-center text-white/40 text-sm">
            <Link to="/user/login" className="text-[#ec1d24] hover:underline">
              Retour à la connexion
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
