import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Web3Wrapper ko bypass karo taaki external scripts chal sakein
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
);
