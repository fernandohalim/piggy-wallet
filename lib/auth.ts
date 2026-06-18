import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

const googleProvider = new GoogleAuthProvider();

export const signUpWithEmail = (email: string, password: string) =>
  createUserWithEmailAndPassword(auth, email, password);

export const signInWithEmail = (email: string, password: string) =>
  signInWithEmailAndPassword(auth, email, password);

export const signInWithGoogle = () => signInWithPopup(auth, googleProvider);

export const logOut = () => signOut(auth);

export function authErrorMessage(code: string): string {
  switch (code) {
    case "auth/invalid-email": return "That email doesn't look right.";
    case "auth/user-disabled": return "This account has been disabled.";
    case "auth/user-not-found":
    case "auth/wrong-password":
    case "auth/invalid-credential": return "Email or password is incorrect.";
    case "auth/email-already-in-use": return "An account with this email already exists.";
    case "auth/weak-password": return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user": return "Sign-in was cancelled.";
    case "auth/popup-blocked": return "Your browser blocked the popup. Allow popups and try again.";
    case "auth/network-request-failed": return "You appear to be offline. The first sign-in needs a connection.";
    case "auth/too-many-requests": return "Too many attempts. Please wait a moment and try again.";
    default: return "Something went wrong. Please try again.";
  }
}