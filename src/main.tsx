import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Direct App render karo bina kisi wrapper ke
createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
  </StrictMode>,
);
