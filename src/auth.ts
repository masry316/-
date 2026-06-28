import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from "firebase/auth";
import firebaseConfig from "../firebase-applet-config.json";

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Google Auth Provider setup with required Workspace scopes
export const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/spreadsheets");
provider.addScope("https://www.googleapis.com/auth/drive.file");
provider.addScope("https://www.googleapis.com/auth/calendar");
provider.addScope("https://www.googleapis.com/auth/calendar.events");
provider.addScope("https://mail.google.com/");
provider.addScope("https://www.googleapis.com/auth/gmail.readonly");
provider.addScope("https://www.googleapis.com/auth/gmail.send");
provider.addScope("https://www.googleapis.com/auth/gmail.compose");
provider.addScope("https://www.googleapis.com/auth/gmail.modify");

let isSigningIn = false;
let cachedAccessToken: string | null = typeof window !== 'undefined' ? sessionStorage.getItem("google_oauth_token") : null;

// Initialize auth state listener
export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else {
        // Try reading from storage
        const stored = sessionStorage.getItem("google_oauth_token");
        if (stored) {
          cachedAccessToken = stored;
          if (onAuthSuccess) onAuthSuccess(user, stored);
        } else if (!isSigningIn) {
          if (onAuthFailure) onAuthFailure();
        }
      }
    } else {
      cachedAccessToken = null;
      sessionStorage.removeItem("google_oauth_token");
      if (onAuthFailure) onAuthFailure();
    }
  });
};

// Perform Google Sign-In with popup
export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error("Failed to retrieve Google Access Token from Firebase Auth.");
    }
    cachedAccessToken = credential.accessToken;
    sessionStorage.setItem("google_oauth_token", cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error) {
    console.error("Firebase Google Auth Error:", error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  return cachedAccessToken || sessionStorage.getItem("google_oauth_token");
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
  sessionStorage.removeItem("google_oauth_token");
};

