// Notifications (sonner) chargées à la demande : la bibliothèque n'est téléchargée qu'au
// premier message affiché, jamais au chargement de la page.
type Kind = 'success' | 'error' | 'info';

export async function notify(kind: Kind, message: string, description?: string) {
  const { toast } = await import('sonner');
  if (kind === 'success') toast.success(message, { description });
  else if (kind === 'error') toast.error(message, { description });
  else toast(message, { description });
}
