import { initializeApp, FirebaseOptions } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence, collection, doc, setDoc, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfigJson from '../../firebase-applet-config.json';

const config = firebaseConfigJson as FirebaseOptions & { firestoreDatabaseId?: string };

const app = initializeApp(config);
export const db = getFirestore(app, config.firestoreDatabaseId);

// Enable offline persistence to suppress some transient backend connection errors
enableIndexedDbPersistence(db).catch((err) => {
  console.warn("Could not enable Firestore offline persistence: ", err.message);
});

export const auth = getAuth(app);

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Save or update an account in Firestore for persistent cloud-backed login
export async function saveAccountToFirestore(email: string, password: string, user: any) {
  try {
    const docRef = doc(db, 'registered_accounts', email.toLowerCase().trim());
    await setDoc(docRef, {
      email: email.toLowerCase().trim(),
      password,
      user
    });
    console.log(`Account ${email} saved to Firestore successfully.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'registered_accounts');
  }
}

// Delete an account from Firestore
export async function deleteAccountFromFirestore(email: string) {
  try {
    const docRef = doc(db, 'registered_accounts', email.toLowerCase().trim());
    await deleteDoc(docRef);
    console.log(`Account ${email} deleted from Firestore successfully.`);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'registered_accounts');
  }
}

// Load all accounts from Firestore and merge/sync them with LocalStorage
export async function syncAccountsWithFirestore() {
  try {
    const querySnapshot = await getDocs(collection(db, 'registered_accounts'));
    const firestoreAccounts: any[] = [];
    querySnapshot.forEach((doc) => {
      firestoreAccounts.push(doc.data());
    });

    // Get current localStorage accounts
    const stored = localStorage.getItem('stat_registered_accounts');
    let localAccounts = stored ? JSON.parse(stored) : [];

    // Clean and filter valid accounts only
    const validFirestore = firestoreAccounts.filter((f) => f && typeof f.email === 'string' && f.email.trim().length > 0);
    let validLocal = localAccounts.filter((l: any) => l && typeof l.email === 'string' && l.email.trim().length > 0);

    if (validFirestore.length > 0) {
      // Merge: For each firestore account, update or add to local list
      validFirestore.forEach((fAcc) => {
        const index = validLocal.findIndex((lAcc: any) => (lAcc.email || '').toLowerCase().trim() === (fAcc.email || '').toLowerCase().trim());
        if (index >= 0) {
          validLocal[index] = fAcc;
        } else {
          validLocal.push(fAcc);
        }
      });

      // Also upload any local-only accounts to Firestore to sync both ways
      for (const lAcc of validLocal) {
        if (lAcc.email && lAcc.password && lAcc.user) {
          const existsInFirestore = validFirestore.some((fAcc) => (fAcc.email || '').toLowerCase().trim() === (lAcc.email || '').toLowerCase().trim());
          if (!existsInFirestore) {
            await saveAccountToFirestore(lAcc.email, lAcc.password, lAcc.user);
          }
        }
      }

      localStorage.setItem('stat_registered_accounts', JSON.stringify(validLocal));
      console.log('Synchronized accounts with Firestore successfully. Total:', validLocal.length);
    } else {
      // If Firestore is empty, let's seed it with whatever is in LocalStorage
      if (localAccounts.length > 0) {
        for (const lAcc of localAccounts) {
          if (lAcc.email && lAcc.password && lAcc.user) {
            await saveAccountToFirestore(lAcc.email, lAcc.password, lAcc.user);
          }
        }
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, 'registered_accounts');
  }
}

