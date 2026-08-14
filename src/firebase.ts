import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { User as UserProfile, DigitalStoryCard } from './types';

// Default Demo / Production Firebase Configuration
// (In production, environment variables can be provided in Vercel project settings)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoConfigKeyForMebDigitalPortal2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ankara-meb-hikaye.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ankara-meb-hikaye",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ankara-meb-hikaye.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "987654321012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:987654321012:web:abcdef123456789"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export interface TeacherRegistrationInput {
  fullName: string;
  email: string;
  phone: string;
  school: string;
  birthDate: string;
  branch: string;
  password: string;
}

/**
 * Registers a new teacher account and saves full details to Firestore.
 * Enforces single account per person (checks email & phone number in Firestore).
 */
export async function registerTeacher(input: TeacherRegistrationInput): Promise<UserProfile> {
  const emailClean = input.email.trim().toLowerCase();
  const phoneClean = input.phone.trim();

  // 1. Enforce unique phone number check in Firestore
  if (phoneClean) {
    const phoneQuery = query(collection(db, 'users'), where('phone', '==', phoneClean));
    const phoneSnap = await getDocs(phoneQuery);
    if (!phoneSnap.empty) {
      throw new Error('Bu telefon numarasına ait aktif bir öğretmen hesabı zaten bulunmaktadır.');
    }
  }

  // 2. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, emailClean, input.password);
  const uid = userCredential.user.uid;

  const profileData: UserProfile = {
    id: uid,
    name: input.fullName.trim(),
    email: emailClean,
    phone: phoneClean,
    school: input.school.trim(),
    birthDate: input.birthDate,
    branch: input.branch.trim(),
    role: 'teacher',
    trainingCompleted: true
  };

  // 3. Save to Firestore users collection
  await setDoc(doc(db, 'users', uid), {
    ...profileData,
    createdAt: serverTimestamp()
  });

  return profileData;
}

/**
 * Logs in a teacher with email & password and retrieves full profile.
 */
export async function loginTeacher(email: string, pass: string): Promise<UserProfile> {
  const userCredential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), pass);
  const uid = userCredential.user.uid;

  // Retrieve user document from Firestore
  const userDocRef = doc(db, 'users', uid);
  const userDoc = await getDoc(userDocRef);

  if (userDoc.exists()) {
    return userDoc.data() as UserProfile;
  } else {
    // Fallback profile if Firestore doc was not found
    return {
      id: uid,
      name: userCredential.user.displayName || email.split('@')[0],
      email: email,
      phone: '',
      school: 'Ankara İl Millî Eğitim Müdürlüğü',
      birthDate: '',
      branch: 'Öğretmen',
      role: 'teacher',
      trainingCompleted: true
    };
  }
}

/**
 * Signs out current user.
 */
export async function logoutTeacher(): Promise<void> {
  await signOut(auth);
}
