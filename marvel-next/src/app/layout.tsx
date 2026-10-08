import type { Metadata, Viewport } from 'next';
import { Anton, Bangers, Barlow_Condensed } from 'next/font/google';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { INTRO_SCRIPT } from '@/components/home/Intro';
import './globals.css';

// Polices téléchargées au déploiement et servies par le site lui-même (aucun appel à Google côté visiteur).
// Anton : titres façon affiche · Barlow Condensed : texte · Bangers : onomatopées et bulles.
const anton = Anton({ weight: '400', subsets: ['latin'], variable: '--font-anton', display: 'swap' });
const barlow = Barlow_Condensed({ weight: ['400', '500', '700'], subsets: ['latin'], variable: '--font-barlow', display: 'swap' });
const bangers = Bangers({ weight: '400', subsets: ['latin'], variable: '--font-bangers', display: 'swap' });

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://marvel-explorer-app.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: 'Marvel Explorer — Personnages & Comics', template: '%s · Marvel Explorer' },
  description: "Explorez l'univers Marvel : parcourez des milliers de personnages et de comics, et gardez vos favoris.",
  openGraph: {
    type: 'website',
    siteName: 'Marvel Explorer',
    locale: 'fr_FR',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: "Marvel Explorer — Tout l'univers Marvel" }],
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#0b0b0b' };

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning : INTRO_SCRIPT ajoute data-intro sur <html> avant l'hydratation.
    <html lang="fr" className={`${anton.variable} ${barlow.variable} ${bangers.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="min-h-screen flex flex-col bg-ink text-white overflow-x-clip">
        <Providers>
          <Header />
          {/* Hauteur réservée dès le départ : le pied de page ne saute pas quand le contenu arrive. */}
          <main className="flex-1 min-h-[100svh]">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
