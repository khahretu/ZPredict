import React, { useState } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider 
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, handleFirestoreError, OperationType } from "../firebase";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (userId: string, email: string) => void;
}

function getFriendlyAuthErrorMessage(err: any): string {
  const code = err?.code || "";
  const msg = err?.message || "";
  
  if (code === "auth/email-already-in-use" || msg.includes("email-already-in-use")) {
    return "This email address is already registered. Please sign in instead by clicking \"Sign In instead\" below.";
  }
  if (code === "auth/invalid-credential" || msg.includes("invalid-credential") || code === "auth/wrong-password" || msg.includes("wrong-password")) {
    return "Incorrect password or email. Please verify your credentials or click \"Register a Profile\" to create a new account.";
  }
  if (code === "auth/user-not-found" || msg.includes("user-not-found")) {
    return "No registered account has been found under this email address. Please register a profile first.";
  }
  if (code === "auth/weak-password" || msg.includes("weak-password")) {
    return "For zPredict protocol security, passwords must be at least 6 characters long.";
  }
  if (code === "auth/invalid-email" || msg.includes("invalid-email")) {
    return "The provided email format is invalid. Please double check.";
  }
  if (code === "auth/popup-closed-by-user" || msg.includes("popup-closed-by-user")) {
    return "Google Authentication was cancelled before finalizing security signature. Please try again.";
  }
  
  let cleanMessage = msg;
  if (cleanMessage.startsWith("Firebase: ")) {
    cleanMessage = cleanMessage.replace(/^Firebase:\s*Error\s*\(?/, "").replace(/\)?$/, "");
  }
  return cleanMessage || "An authentication validation error occurred. Click reload or try again.";
}

export default function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        // Sign up with Email/Password
        const credential = await createUserWithEmailAndPassword(auth, email, password);
        const user = credential.user;

        // Create standard user profile in Firestore
        const userPath = `users/${user.uid}`;
        try {
          await setDoc(doc(db, "users", user.uid), {
            userId: user.uid,
            email: user.email,
            displayName: displayName || user.email?.split("@")[0] || "User",
            walletAddress: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, userPath);
        }

        onSuccess(user.uid, user.email || "");
        onClose();
      } else {
        // Sign in with Email/Password
        const credential = await signInWithEmailAndPassword(auth, email, password);
        onSuccess(credential.user.uid, credential.user.email || "");
        onClose();
      }
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Sync user profile in Firestore
      const userPath = `users/${user.uid}`;
      try {
        await setDoc(doc(db, "users", user.uid), {
          userId: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          walletAddress: null,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (dbErr) {
        handleFirestoreError(dbErr, OperationType.WRITE, userPath);
      }

      onSuccess(user.uid, user.email || "");
      onClose();
    } catch (err: any) {
      setError(getFriendlyAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        id="auth-modal"
        className="w-full max-w-md overflow-hidden bg-slate-900 border border-slate-800 rounded-2xl shadow-xl transition-all"
      >
        <div className="relative p-6">
          {/* Header */}
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold tracking-tight text-white font-sans">
              {isSignUp ? "Create zPredict Account" : "Welcome Back"}
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              {isSignUp 
                ? "Register securely to synchronize multi-chain trading" 
                : "Enter credentials to access transaction charts"
              }
            </p>
          </div>

          <button 
            id="auth-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            ✕
          </button>

          {/* Form */}
          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                  Display Username
                </label>
                <input
                  id="auth-displayName-input"
                  type="text"
                  placeholder="e.g. Satoshi_99"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 text-white placeholder-slate-500 bg-slate-950 border border-slate-800 rounded-lg focus:outline-hidden focus:border-cyan-500 transition-colors text-sm"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                id="auth-email-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-white placeholder-slate-500 bg-slate-950 border border-slate-800 rounded-lg focus:outline-hidden focus:border-cyan-500 transition-colors text-sm"
                required
              />
            </div>

            <div>
              <label className="block mb-1 text-xs font-medium uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                id="auth-password-input"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-white placeholder-slate-500 bg-slate-950 border border-slate-800 rounded-lg focus:outline-hidden focus:border-cyan-500 transition-colors text-sm"
                required
              />
            </div>

            {error && (
              <div className="p-3 text-xs bg-rose-950/40 border border-rose-900/50 rounded-lg text-rose-300">
                {error}
              </div>
            )}

            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-sm font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Authorizing Security..." : (isSignUp ? "Sign Up Free" : "Authenticate Account")}
            </button>
          </form>

          {/* Social Provider */}
          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800"></div>
            </div>
            <span className="relative px-3 text-xs uppercase bg-slate-900 text-slate-500">
              Alternative Gateways
            </span>
          </div>

          <button
            id="google-auth-btn"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 text-sm font-semibold text-white bg-slate-950 border border-slate-800 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 1.56-1.56 2.95-3.24 3.5v2.9h5.22c3.05-2.81 4.78-6.94 4.78-11.89c0-.42-.04-.84-.1-1.24z" fill="#4285F4"/>
              <path d="M12.18 21.43c2.75 0 5.06-.92 6.75-2.5l-5.22-2.9c-.83.56-1.92.9-3.24.9c-2.48 0-4.58-1.68-5.32-3.95H.83v3.01c1.73 3.44 5.3 5.75 9.47 5.75z" fill="#34A853"/>
              <path d="M6.86 12.98c-.18-.56-.29-1.16-.29-1.78s.11-1.22.29-1.78V6.41H.83c-.6 1.22-.95 2.59-.95 4.04c0 1.45.35 2.82.95 4.04l5.12-3.51z" fill="#FBBC05"/>
              <path d="M12.18 4.54c1.49 0 2.83.51 3.89 1.52l2.91-2.91C17.22 1.4 14.9 0 12.18 0C8.01 0 4.44 2.31 2.71 5.75l5.13 3.54c.74-2.27 2.84-3.95 5.34-3.95z" fill="#EA4335"/>
            </svg>
            Sign-In via Google ID
          </button>

          {/* Switch link */}
          <div className="mt-6 text-center text-xs text-slate-400">
            {isSignUp ? "Already secured?" : "New to the platform?"}{" "}
            <button
              id="auth-toggle-btn"
              onClick={() => setIsSignUp(!isSignUp)}
              className="font-semibold text-cyan-400 hover:underline hover:text-cyan-300 focus:outline-hidden cursor-pointer"
            >
              {isSignUp ? "Sign In instead" : "Register a Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
