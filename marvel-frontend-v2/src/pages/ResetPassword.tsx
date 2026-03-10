import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { resetPassword } from '../api/auth';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [fieldError, setFieldError] = useState('');

  const mutation = useMutation({
    mutationFn: () => resetPassword(token, password),
    onSuccess: () => {
      toast.success('Mot de passe mis à jour', { description: 'Tu peux maintenant te connecter.' });
      navigate('/user/login');
    },
  });

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-400 mb-4">Lien invalide ou expiré.</p>
          <Link to="/user/forgot-password" className="text-[#ec1d24] hover:underline text-sm">
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
          <div className="bg-[#ec1d24] text-white font-black text-3xl px-3 py-1 inline-block tracking-tighter mb-4">
            MARVEL
          </div>
          <h1 className="text-2xl font-black uppercase text-white">Nouveau mot de passe</h1>
          <p className="text-white/40 text-sm mt-1">Choisis un mot de passe d'au moins 6 caractères</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/5 rounded-xl p-8 flex flex-col gap-5">
          {(fieldError || mutation.isError) && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-4 py-3 rounded">
              {fieldError || (mutation.error as Error).message}
            </div>
          )}

          <Input
            label="Nouveau mot de passe"
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Input
            label="Confirmer le mot de passe"
            id="confirm"
            type="password"
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
