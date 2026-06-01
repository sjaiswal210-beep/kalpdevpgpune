import React, { useState } from 'react';
import { db, COLLECTIONS } from '../data/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

async function clearCollection(collectionName) {
  const snapshot = await getDocs(collection(db, collectionName));
  const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, collectionName, d.id)));
  await Promise.all(deletePromises);
  return snapshot.docs.length;
}

export default function ClearData() {
  const [status, setStatus] = useState('');
  const [clearing, setClearing] = useState(false);
  const [done, setDone] = useState(false);

  const handleClear = async () => {
    if (!window.confirm('Are you SURE you want to delete ALL data? This cannot be undone!')) return;
    if (!window.confirm('LAST WARNING: This will permanently delete all tenants, rent records, expenses, rewards, everything. Continue?')) return;

    setClearing(true);
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

    let log = '';
    for (const col of collectionsToDelete) {
      try {
        const count = await clearCollection(col);
        log += `✓ ${col}: ${count} deleted\n`;
        setStatus(log);
      } catch (err) {
        log += `⚠ ${col}: skipped (${err.message})\n`;
        setStatus(log);
      }
    }
    log += '\n✅ All data cleared! Start fresh.';
    setStatus(log);
    setClearing(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">⚠️ Clear All Data</h1>
        <p className="text-gray-500 text-sm mb-6">This will permanently delete all tenants, rent records, expenses, rewards, notifications, and everything else.</p>
        
        {!done ? (
          <button
            onClick={handleClear}
            disabled={clearing}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition disabled:opacity-50"
          >
            {clearing ? 'Clearing...' : 'Clear All Data & Start Fresh'}
          </button>
        ) : (
          <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
            <p className="text-green-700 font-semibold">All data cleared! You can start fresh now.</p>
            <a href="/admin/login" className="text-sm text-purple-600 mt-2 inline-block">Go to Admin Login →</a>
          </div>
        )}

        {status && (
          <pre className="mt-4 text-left text-xs bg-gray-100 rounded-xl p-4 max-h-64 overflow-y-auto whitespace-pre-wrap">
            {status}
          </pre>
        )}
      </div>
    </div>
  );
}
