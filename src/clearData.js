// One-time script to clear all Firestore data
// Run this in browser console or as a temporary page

import { db, COLLECTIONS } from './data/firebase.js';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, collectionName, d.id)));
  await Promise.all(deletePromises);
  console.log(`Cleared ${collectionName}: ${snapshot.docs.length} documents deleted`);
}

async function clearAllData() {
  const collectionsToDelete = [
    COLLECTIONS.TENANTS,
    COLLECTIONS.RENT,
    COLLECTIONS.ELECTRICITY,
    COLLECTIONS.EXPENSES,
    COLLECTIONS.VISITORS,
    COLLECTIONS.NOTICES,
    COLLECTIONS.PAYMENT_REMINDERS,
    COLLECTIONS.SHARING,
    COLLECTIONS.REWARDS_PRODUCTS,
    COLLECTIONS.REWARDS_POINTS,
    COLLECTIONS.REWARDS_PURCHASES,
    COLLECTIONS.REWARDS_REDEMPTIONS,
    COLLECTIONS.PAYMENT_LINKS,
    COLLECTIONS.NOTIFICATIONS,
    COLLECTIONS.PROFILE_UPDATES,
    COLLECTIONS.ENQUIRIES,
    COLLECTIONS.TENANT_HISTORY,
  ];

  console.log('Starting data clear...');
  for (const col of collectionsToDelete) {
    try {
      await clearCollection(col);
    } catch (err) {
      console.log(`Skipped ${col}: ${err.message}`);
    }
  }
  console.log('All data cleared! You can start fresh now.');
  alert('All data cleared successfully! Refresh the page.');
}

clearAllData();
