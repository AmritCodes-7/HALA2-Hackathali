import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';

const AuthContext = createContext(null);

/**
 * AuthProvider — wraps the app and provides authentication + role state.
 *
 * Exposes:
 *   user     — Firebase Auth user object (or null)
 *   role     — 'customer' | 'pro' | null  (fetched from Firestore users/{uid})
 *   loading  — true while auth state is being determined
 *   signInWithGoogle()  — triggers Google OAuth popup
 *   logout()            — signs out and clears state
 *   updateRole(newRole) — writes role to Firestore and updates local state
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // ── Fetch user profile (role) from Firestore ──
  const fetchUserRole = async (firebaseUser) => {
    try {
      const userDocRef = doc(db, 'users', firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const data = userDoc.data();
        setRole(data.role || null);
      } else {
        // First‑time user — create a placeholder doc with no role
        await setDoc(userDocRef, {
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          createdAt: new Date().toISOString(),
          role: null,
        });
        setRole(null);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setRole(null);
    }
  };

  // ── Listen for auth state changes ──
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserRole(firebaseUser);
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ── Google OAuth sign‑in ──
  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result.user;
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  // ── Sign out ──
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setRole(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  // ── Update role in Firestore + local state ──
  const updateRole = async (newRole, additionalData = {}) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        { role: newRole, ...additionalData },
        { merge: true }
      );
      setRole(newRole);
    } catch (error) {
      console.error('Error updating role:', error);
      throw error;
    }
  };

  const value = {
    user,
    role,
    loading,
    signInWithGoogle,
    logout,
    updateRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth context from any component.
 * Usage: const { user, role, signInWithGoogle } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
