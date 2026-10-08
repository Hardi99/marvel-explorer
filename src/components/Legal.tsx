import type { ReactNode } from 'react';

// Les valeurs entre crochets sont à remplacer par les informations réelles de l'éditeur du site.
const PUBLISHER = '[NOM ET PRÉNOM DE L’ÉDITEUR]';
const CONTACT_EMAIL = '[ADRESSE E-MAIL DE CONTACT]';

function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="max-w-3xl mx-auto px-6 py-16 flex flex-col gap-8 text-lg leading-relaxed text-neutral-300">
      <header className="flex flex-col gap-4">
        <h1 className="font-display font-normal text-5xl uppercase text-white">{title}</h1>
        <div className="h-1 w-12 bg-marvel" />
      </header>
      {children}
    </article>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display font-normal text-2xl uppercase text-white">{title}</h2>
      {children}
    </section>
  );
}

export function LegalNotice() {
  return (
    <LegalLayout title="Mentions légales">
      <Block title="Éditeur">
        <p>
          Marvel Explorer est un projet personnel et non commercial édité par {PUBLISHER}.<br />
          Contact : {CONTACT_EMAIL}
        </p>
        <p>Directeur de la publication : {PUBLISHER}.</p>
      </Block>
      <Block title="Hébergement">
        <p>
          Site : Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com
          <br />
          API et base de données : Railway Corporation, San Francisco, CA, États-Unis — railway.com
        </p>
      </Block>
      <Block title="Propriété intellectuelle">
        <p>
          Projet de fan non officiel, sans lien avec Marvel ni The Walt Disney Company. Les noms, personnages, images
          et marques Marvel appartiennent à leurs propriétaires respectifs. Data provided by Marvel. © Marvel.
        </p>
      </Block>
    </LegalLayout>
  );
}

export function PrivacyPolicy() {
  return (
    <LegalLayout title="Confidentialité">
      <Block title="Ce que nous collectons">
        <p>
          Le catalogue se consulte sans compte. Si vous créez un compte, nous enregistrons votre nom d’utilisateur, votre
          adresse e-mail, votre mot de passe sous forme chiffrée (il n’est jamais stocké en clair) et la liste de vos
          favoris. Ces données servent uniquement à faire fonctionner votre compte.
        </p>
      </Block>
      <Block title="Cookies et stockage local">
        <p>
          Un seul cookie, <code>auth_token</code>, garde votre session ouverte 24 heures après la connexion. Il est
          indispensable au service et ne sert à aucun suivi : il ne demande donc pas de consentement. Le navigateur garde
          aussi deux réglages d’affichage (votre nom d’utilisateur pour l’en-tête, et le fait d’avoir déjà vu l’intro).
          Aucun outil de statistiques ni de publicité n’est utilisé.
        </p>
      </Block>
      <Block title="Contenus externes">
        <p>
          Les images des personnages et des comics viennent du serveur d’images de Marvel, et les affiches de films de
          celui de TMDB : votre navigateur s’y connecte directement pour les afficher. Les bandes-annonces ne sont
          chargées depuis YouTube (en mode « sans cookie ») que si vous cliquez sur une affiche ; YouTube applique
          alors sa propre politique de confidentialité.
        </p>
      </Block>
      <Block title="Prestataires">
        <p>
          Vercel (hébergement du site), Railway (API et base de données) et Resend (envoi des e-mails de bienvenue et de
          réinitialisation du mot de passe). Ces prestataires sont situés aux États-Unis ; les transferts sont encadrés
          par leurs clauses contractuelles types.
        </p>
      </Block>
      <Block title="Durée de conservation">
        <p>Vos données sont conservées tant que votre compte existe et supprimées à votre demande.</p>
      </Block>
      <Block title="Vos droits">
        <p>
          Vous pouvez accéder à vos données, les corriger ou demander la suppression de votre compte en écrivant à{' '}
          {CONTACT_EMAIL}. Vous pouvez aussi adresser une réclamation à la CNIL (cnil.fr).
        </p>
      </Block>
    </LegalLayout>
  );
}
