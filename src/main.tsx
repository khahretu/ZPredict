import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Is wrapper ko hum blank rakhenge taaki website crash na ho
const Web3Wrapper = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Web3Wrapper>
      <App />
    </Web3Wrapper>
  </StrictMode>,
);
