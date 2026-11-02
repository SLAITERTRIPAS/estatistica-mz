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
    console.error(`Error saving account ${email} to Firestore:`, error);
  }
}

// Delete an account from Firestore
export async function deleteAccountFromFirestore(email: string) {
  try {
    const docRef = doc(db, 'registered_accounts', email.toLowerCase().trim());
    await deleteDoc(docRef);
    console.log(`Account ${email} deleted from Firestore successfully.`);
  } catch (error) {
    console.error(`Error deleting account ${email} from Firestore:`, error);
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

    if (firestoreAccounts.length > 0) {
      // Merge: For each firestore account, update or add to local list
      firestoreAccounts.forEach((fAcc) => {
        const index = localAccounts.findIndex((lAcc: any) => lAcc.email.toLowerCase().trim() === fAcc.email.toLowerCase().trim());
        if (index >= 0) {
          localAccounts[index] = fAcc;
        } else {
          localAccounts.push(fAcc);
        }
      });

      // Also upload any local-only accounts to Firestore to sync both ways
      for (const lAcc of localAccounts) {
        if (lAcc.email && lAcc.password && lAcc.user) {
          const existsInFirestore = firestoreAccounts.some((fAcc) => fAcc.email.toLowerCase().trim() === lAcc.email.toLowerCase().trim());
          if (!existsInFirestore) {
            await saveAccountToFirestore(lAcc.email, lAcc.password, lAcc.user);
          }
        }
      }

      localStorage.setItem('stat_registered_accounts', JSON.stringify(localAccounts));
      console.log('Synchronized accounts with Firestore successfully. Total:', localAccounts.length);
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
    console.error('Error syncing accounts with Firestore:', error);
  }
}

