import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  GoogleAuthProvider, 
  signInWithPopup, 
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  UserCredential,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  serverTimestamp, 
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { User, UserProfile, AuthError, SignupData, LoginData, UpdateProfileData } from '../types/User';

// Error mapping for user-friendly messages
const ERROR_MESSAGES: Record<string, string> = {
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/email-already-in-use': 'An account with this email already exists.',
  'auth/weak-password': 'Password should be at least 6 characters long.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled.',
  'auth/popup-blocked': 'Sign-in popup was blocked. Please allow popups for this site.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email address but different sign-in credentials.',
  'auth/requires-recent-login': 'Please sign in again to complete this action.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'This operation is not allowed.',
  'auth/invalid-credential': 'Invalid credentials.',
  'auth/user-token-expired': 'Your session has expired. Please sign in again.',
  'auth/user-mismatch': 'The provided credentials do not match the current user.',
  'auth/invalid-verification-code': 'Invalid verification code.',
  'auth/invalid-verification-id': 'Invalid verification ID.',
  'auth/quota-exceeded': 'Service temporarily unavailable. Please try again later.',
  'auth/insufficient-permission': 'You do not have permission to perform this action.',
  'auth/unavailable': 'Service is currently unavailable. Please try again later.',
  'auth/unknown': 'An unknown error occurred. Please try again.'
};

// Helper function to create user-friendly error messages
const createAuthError = (error: any): AuthError => {
  const code = error.code || 'unknown';
  const message = ERROR_MESSAGES[code] || error.message || 'An unexpected error occurred.';
  
  return {
    code,
    message,
    field: code.includes('email') ? 'email' : code.includes('password') ? 'password' : undefined
  };
};

// Validation functions
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }
  
  return { isValid: errors.length === 0, errors };
};

export const validateDisplayName = (displayName: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (displayName.length < 2) {
    errors.push('Display name must be at least 2 characters long');
  }
  if (displayName.length > 50) {
    errors.push('Display name must be less than 50 characters');
  }
  if (!/^[a-zA-Z\s]+$/.test(displayName)) {
    errors.push('Display name can only contain letters and spaces');
  }
  
  return { isValid: errors.length === 0, errors };
};

// Create user profile in Firestore
const createUserProfile = async (firebaseUser: FirebaseUser, signupData: SignupData): Promise<UserProfile> => {
  const userProfile: UserProfile = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: signupData.displayName,
    photoURL: firebaseUser.photoURL,
    role: 'customer', // Default role, can be changed by admin
    isEmailVerified: firebaseUser.emailVerified,
    createdAt: new Date(),
    lastLogin: new Date(),
    phoneNumber: signupData.phoneNumber,
    preferences: {
      newsletter: false,
      marketing: false,
      notifications: true
    }
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
    lastLogin: serverTimestamp()
  });

  return userProfile;
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return null;
    }
    
    const data = userDoc.data();
    return {
      uid: data.uid,
      email: data.email,
      displayName: data.displayName,
      photoURL: data.photoURL,
      role: data.role || 'customer',
      isEmailVerified: data.isEmailVerified,
      createdAt: data.createdAt?.toDate() || new Date(),
      lastLogin: data.lastLogin?.toDate() || new Date(),
      phoneNumber: data.phoneNumber,
      address: data.address,
      preferences: data.preferences
    };
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
};

// Update user profile
export const updateUserProfile = async (uid: string, updateData: UpdateProfileData): Promise<void> => {
  try {
    const updateFields: any = {};
    
    if (updateData.displayName !== undefined) updateFields.displayName = updateData.displayName;
    if (updateData.photoURL !== undefined) updateFields.photoURL = updateData.photoURL;
    if (updateData.phoneNumber !== undefined) updateFields.phoneNumber = updateData.phoneNumber;
    if (updateData.address !== undefined) updateFields.address = updateData.address;
    if (updateData.preferences !== undefined) updateFields.preferences = updateData.preferences;
    
    await updateDoc(doc(db, 'users', uid), updateFields);
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw createAuthError(error);
  }
};

// Sign up with email and password
export const signup = async (signupData: SignupData): Promise<User> => {
  try {
    // Validate input
    if (!validateEmail(signupData.email)) {
      throw createAuthError({ code: 'auth/invalid-email', message: 'Please enter a valid email address.' });
    }

    const passwordValidation = validatePassword(signupData.password);
    if (!passwordValidation.isValid) {
      throw createAuthError({ 
        code: 'auth/weak-password', 
        message: passwordValidation.errors.join(', ') 
      });
    }

    const displayNameValidation = validateDisplayName(signupData.displayName);
    if (!displayNameValidation.isValid) {
      throw createAuthError({ 
        code: 'auth/invalid-display-name', 
        message: displayNameValidation.errors.join(', ') 
      });
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      signupData.email, 
      signupData.password
    );

    // Update Firebase Auth profile
    await updateProfile(userCredential.user, {
      displayName: signupData.displayName
    });

    // Create user profile in Firestore
    const userProfile = await createUserProfile(userCredential.user, signupData);

    // Send email verification
    await sendEmailVerification(userCredential.user);

    // Return user with profile
    return {
      ...userCredential.user,
      profile: userProfile
    } as User;

  } catch (error) {
    throw createAuthError(error);
  }
};

// Sign in with email and password
export const signin = async (loginData: LoginData): Promise<User> => {
  try {
    // Validate input
    if (!validateEmail(loginData.email)) {
      throw createAuthError({ code: 'auth/invalid-email', message: 'Please enter a valid email address.' });
    }

    if (!loginData.password) {
      throw createAuthError({ code: 'auth/missing-password', message: 'Password is required.' });
    }

    // Sign in with Firebase Auth
    const userCredential = await signInWithEmailAndPassword(
      auth, 
      loginData.email, 
      loginData.password
    );

    // Get user profile from Firestore
    const userProfile = await getUserProfile(userCredential.user.uid);
    if (!userProfile) {
      throw createAuthError({ code: 'auth/user-not-found', message: 'User profile not found.' });
    }

    // Update last login
    await updateDoc(doc(db, 'users', userCredential.user.uid), {
      lastLogin: serverTimestamp()
    });

    // Return user with profile
    return {
      ...userCredential.user,
      profile: { ...userProfile, lastLogin: new Date() }
    } as User;

  } catch (error) {
    throw createAuthError(error);
  }
};

// Sign in with Google
export const signinWithGoogle = async (): Promise<User> => {
  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    const userCredential = await signInWithPopup(auth, provider);
    
    // Check if user profile exists
    let userProfile = await getUserProfile(userCredential.user.uid);
    
    if (!userProfile) {
      // Create new user profile for Google sign-in
      userProfile = await createUserProfile(userCredential.user, {
        email: userCredential.user.email!,
        password: '', // Not needed for Google sign-in
        displayName: userCredential.user.displayName || 'User'
      });
    } else {
      // Update last login
      await updateDoc(doc(db, 'users', userCredential.user.uid), {
        lastLogin: serverTimestamp()
      });
      userProfile.lastLogin = new Date();
    }

    return {
      ...userCredential.user,
      profile: userProfile
    } as User;

  } catch (error) {
    throw createAuthError(error);
  }
};

// Sign out
export const signout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error) {
    throw createAuthError(error);
  }
};

// Send password reset email
export const sendPasswordReset = async (email: string): Promise<void> => {
  try {
    if (!validateEmail(email)) {
      throw createAuthError({ code: 'auth/invalid-email', message: 'Please enter a valid email address.' });
    }

    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw createAuthError(error);
  }
};

// Get user count (admin only)
export const getUserCount = async (): Promise<number> => {
  try {
    const usersQuery = query(collection(db, 'users'));
    const snapshot = await getDocs(usersQuery);
    return snapshot.size;
  } catch (error) {
    console.error('Error getting user count:', error);
    return 0;
  }
};

// Get all users (admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(usersQuery);
    
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        uid: data.uid,
        email: data.email,
        displayName: data.displayName,
        photoURL: data.photoURL,
        role: data.role || 'customer',
        isEmailVerified: data.isEmailVerified,
        createdAt: data.createdAt?.toDate() || new Date(),
        lastLogin: data.lastLogin?.toDate() || new Date(),
        phoneNumber: data.phoneNumber,
        address: data.address,
        preferences: data.preferences
      };
    });
  } catch (error) {
    console.error('Error getting all users:', error);
    return [];
  }
};

// Update user role (admin only)
export const updateUserRole = async (uid: string, role: UserProfile['role']): Promise<void> => {
  try {
    await updateDoc(doc(db, 'users', uid), { role });
  } catch (error) {
    console.error('Error updating user role:', error);
    throw createAuthError(error);
  }
};

// Auth state listener
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        const user: User = {
          ...firebaseUser,
          profile: userProfile
        };
        callback(user);
      } else {
        callback(null);
      }
    } else {
      callback(null);
    }
  });
}; 