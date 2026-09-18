// src/pages/Login.jsx
import { useState } from "react";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "../firebase";

export default function Login({ currentUser, isAuthorized }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleGoogleAuth = async () => {
    setAuthError("");
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      setAuthError(err.message.replace("Firebase: ", ""));
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  if (currentUser && !isAuthorized) {
    return (
      <div className="center-screen">
        <div className="lockout-card">
          <div className="warning-icon">🔒</div>
          <h2 className="brand-title">Authorization Required</h2>
          <p>
            Your account (<strong>{currentUser.email}</strong>) has been
            registered.
          </p>
          <div className="contact-box">
            <p>
              Please contact admin to verify and authorize your account access.
            </p>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      {/* Decorative background elements */}
      <div className="glow-orb orb-1"></div>
      <div className="glow-orb orb-2"></div>

      <div className="auth-card glass-panel">
        <h2 className="brand-title">
          <span className="ai-highlight">AI</span> HEALTH MONITORING
        </h2>
        <p className="auth-subtitle">
          {isSignUp
            ? "Initialize new neural profile"
            : "Authenticate to access dashboard"}
        </p>

        {authError && <div className="error-banner">{authError}</div>}

        <form onSubmit={handleEmailAuth} className="auth-form">
          <label>Email Address</label>
          <div className="input-group">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@health-ai.com"
            />
          </div>

          <label>Password</label>
          <div className="input-group">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="primary-btn ai-btn">
            {isSignUp ? "Initialize Account" : "Access System"}
          </button>
        </form>

        <div className="divider">
          <span>SECURE LOGIN</span>
        </div>

        <button onClick={handleGoogleAuth} className="google-btn">
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.35 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          Google Authentication
        </button>

        <p className="toggle-mode">
          {isSignUp ? "Profile established?" : "No profile found?"}{" "}
          <button
            type="button"
            className="link-btn"
            onClick={() => setIsSignUp(!isSignUp)}
          >
            {isSignUp ? "Authenticate Here" : "Create Profile"}
          </button>
        </p>
      </div>
    </div>
  );
}
