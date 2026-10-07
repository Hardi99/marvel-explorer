import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Polices self-hostées (fontsource), latin uniquement : aucune requête render-blocking vers Google Fonts.
// Anton : titres façon affiche · Barlow Condensed : texte · Bangers : onomatopées et bulles.
import '@fontsource/anton/latin-400.css'
import '@fontsource/barlow-condensed/latin-400.css'
import '@fontsource/barlow-condensed/latin-500.css'
import '@fontsource/barlow-condensed/latin-700.css'
import '@fontsource/bangers/latin-400.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
