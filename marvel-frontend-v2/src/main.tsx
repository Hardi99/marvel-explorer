import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Police Marvel self-hostée (fontsource) — supprime la chaîne render-blocking vers Google Fonts.
// Latin uniquement, poids 400/700 (les seuls fournis par cette police). Italique 400 pour les placeholders.
import '@fontsource/marvel/latin-400.css'
import '@fontsource/marvel/latin-700.css'
import '@fontsource/marvel/latin-400-italic.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
