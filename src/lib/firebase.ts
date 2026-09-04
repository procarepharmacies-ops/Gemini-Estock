import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as fbSignOut,
  onAuthStateChanged,
  signInAnonymously,
  User,
  Auth,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  query,
  orderBy,
  Firestore,
} from "firebase/firestore";
import { MigrationProject, UserProfile } from "../types";

// Check for configured Firebase keys in environment
const envConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if user saved custom configuration in localStorage
const savedCustomConfig = localStorage.getItem("firebase_custom_config");
const customConfig = savedCustomConfig ? JSON.parse(savedCustomConfig) : null;

export const activeFirebaseConfig = customConfig || (envConfig.apiKey ? envConfig : null);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

export const isFirebaseConfigured = Boolean(
  activeFirebaseConfig && activeFirebaseConfig.apiKey && activeFirebaseConfig.projectId
);

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(activeFirebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (err) {
    console.warn("Failed to initialize Firebase with current config:", err);
  }
}

// Local storage backup persistence key
const LOCAL_STORAGE_PROJECTS_KEY = "modernizer_saved_projects";

// Mock user for offline / unconfigured demo mode
const DEMO_USER: UserProfile = {
  uid: "demo-engineer-01",
  displayName: "ProCare DB Architect",
  email: "procarepharmacies@gmail.com",
  photoURL: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&auto=format&fit=crop&q=80",
  isAnonymous: false,
};

export async function loginWithGoogle(): Promise<UserProfile> {
  if (auth && isFirebaseConfigured) {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        isAnonymous: user.isAnonymous,
      };
    } catch (error: any) {
      console.error("Firebase Google Auth error:", error);
      throw error;
    }
  }

  // Fallback demo simulation
  localStorage.setItem("modernizer_active_user", JSON.stringify(DEMO_USER));
  return DEMO_USER;
}

export async function loginAsGuest(): Promise<UserProfile> {
  if (auth && isFirebaseConfigured) {
    try {
      const res = await signInAnonymously(auth);
      return {
        uid: res.user.uid,
        email: null,
        displayName: "Guest Migrator",
        photoURL: null,
        isAnonymous: true,
      };
    } catch (e) {
      console.warn("Anonymous sign in error, fallback to demo user", e);
    }
  }

  const guest: UserProfile = {
    uid: "guest-" + Math.random().toString(36).substring(2, 9),
    displayName: "Guest Architect",
    email: null,
    photoURL: null,
    isAnonymous: true,
  };
  localStorage.setItem("modernizer_active_user", JSON.stringify(guest));
  return guest;
}

export async function logOutUser(): Promise<void> {
  if (auth && isFirebaseConfigured) {
    await fbSignOut(auth);
  }
  localStorage.removeItem("modernizer_active_user");
}

export function subscribeToAuthState(callback: (user: UserProfile | null) => void) {
  if (auth && isFirebaseConfigured) {
    return onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        callback({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        });
      } else {
        // Check local storage demo user
        const stored = localStorage.getItem("modernizer_active_user");
        callback(stored ? JSON.parse(stored) : null);
      }
    });
  }

  // No Firebase auth configured: read from localStorage
  const stored = localStorage.getItem("modernizer_active_user");
  callback(stored ? JSON.parse(stored) : DEMO_USER);
  return () => {};
}

// Save Migration Project to Firestore or Local Storage
export async function saveProject(project: Omit<MigrationProject, "id">, userId?: string): Promise<MigrationProject> {
  const timestamp = new Date().toISOString();
  
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, "modernization_projects");
      const docRef = await addDoc(colRef, {
        ...project,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: userId || "anonymous",
      });
      return {
        ...project,
        id: docRef.id,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: userId || "anonymous",
      };
    } catch (err) {
      console.warn("Firestore save failed, persisting locally:", err);
    }
  }

  // Fallback to localStorage
  const existing = getLocalProjects();
  const newProject: MigrationProject = {
    ...project,
    id: "proj_" + Date.now(),
    createdAt: timestamp,
    updatedAt: timestamp,
    userId: userId || "demo",
  };
  existing.unshift(newProject);
  localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(existing));
  return newProject;
}

// Fetch Projects
export async function fetchProjects(userId?: string): Promise<MigrationProject[]> {
  if (db && isFirebaseConfigured) {
    try {
      const colRef = collection(db, "modernization_projects");
      const q = query(colRef, orderBy("updatedAt", "desc"));
      const snapshot = await getDocs(q);
      const list: MigrationProject[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as any;
        list.push({
          id: d.id,
          title: data.title || "Untitled Project",
          description: data.description || "",
          originalSql: data.originalSql || "",
          targetPlatform: data.targetPlatform || "firestore",
          targetOutput: data.targetOutput || "",
          migrationScript: data.migrationScript || "",
          verificationQueries: data.verificationQueries || "",
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString(),
          userId: data.userId,
        });
      });
      if (list.length > 0) return list;
    } catch (err) {
      console.warn("Firestore fetch failed, using local projects:", err);
    }
  }

  return getLocalProjects();
}

// Delete Project
export async function deleteProject(id: string): Promise<void> {
  if (db && isFirebaseConfigured) {
    try {
      await deleteDoc(doc(db, "modernization_projects", id));
      return;
    } catch (err) {
      console.warn("Firestore delete failed:", err);
    }
  }

  const existing = getLocalProjects();
  const filtered = existing.filter((p) => p.id !== id);
  localStorage.setItem(LOCAL_STORAGE_PROJECTS_KEY, JSON.stringify(filtered));
}

function getLocalProjects(): MigrationProject[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PROJECTS_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveCustomFirebaseConfig(config: any) {
  localStorage.setItem("firebase_custom_config", JSON.stringify(config));
  window.location.reload();
}
