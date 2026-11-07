import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/fonts.css';
import './styles/variables.css';
import './styles/reset.css';
import './styles/global.css';
import { removeBootSplash } from '@/boot-splash/boot-splash';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

removeBootSplash();
