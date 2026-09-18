// src/App.jsx
import { useState, useEffect } from "react";
import { auth, db, ref, set, get, onValue } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./App.css"; // Keep your existing App.css here

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  const syncUserRecord = async (user) => {
    const userRef = ref(db, `users/${user.uid}`);
    const snapshot = await get(userRef);
    if (!snapshot.exists()) {
      await set(userRef, {
        email: user.email,
        isAuthorized: false,
        createdAt: new Date().toISOString(),
      });
    }
  };

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        await syncUserRecord(user);

        // Listen for database authorization changes in real-time
        const userAuthRef = ref(db, `users/${user.uid}/isAuthorized`);
        const unsubscribeUser = onValue(userAuthRef, (snapshot) => {
          setIsAuthorized(snapshot.val() === true);
          setLoading(false);
        });

        return () => unsubscribeUser();
      } else {
        setCurrentUser(null);
        setIsAuthorized(false);
        setLoading(false);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  if (loading) {
    return (
      <div className="center-screen">
        <p>Loading system...</p>
      </div>
    );
  }

  // If user is not logged in OR logged in but not authorized, show Login/Lockout
  if (!currentUser || !isAuthorized) {
    return <Login currentUser={currentUser} isAuthorized={isAuthorized} />;
  }

  // If user is logged in AND authorized, show Dashboard
  return <Dashboard currentUser={currentUser} />;
}
