import React, { useState } from 'react';
import { db, COLLECTIONS } from '../data/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

export default function ResetPayments() {
  const [status, setStatus] = useState('');
  const [done, setDone] = useState(false);

  const handleReset = async () => {
    if (!window.confirm('Reset all payment links and rent records?')) return;
    setStatus('Clearing...\n');

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PAYMENT_LINKS));
      for (const d of snap.docs) await deleteDoc(doc(db, COLLECTIONS.PAYMENT_LINKS, d.id));
      setStatus(prev => prev + `✓ Payment links: ${snap.docs.length} deleted\n`);
    } catch (e) { setStatus(prev => prev + `⚠ Payment links: ${e.message}\n`); }

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.RENT));
      for (const d of snap.docs) await deleteDoc(doc(db, COLLECTIONS.RENT, d.id));
      setStatus(prev => prev + `✓ Rent records: ${snap.docs.length} deleted\n`);
    } catch (e) { setStatus(prev => prev + `⚠ Rent records: ${e.message}\n`); }

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.PAYMENT_REMINDERS));
      for (const d of snap.docs) await deleteDoc(doc(db, COLLECTIONS.PAYMENT_REMINDERS, d.id));
      setStatus(prev => prev + `✓ Payment reminders: ${snap.docs.length} deleted\n`);
    } catch (e) { setStatus(prev => prev + `⚠ Reminders: ${e.message}\n`); }

    try {
      const snap = await getDocs(collection(db, COLLECTIONS.NOTIFICATIONS));
      for (const d of snap.docs) await deleteDoc(doc(db, COLLECTIONS.NOTIFICATIONS, d.id));
      setStatus(prev => prev + `✓ Notifications: ${snap.docs.length} deleted\n`);
    } catch (e) { setStatus(prev => prev + `⚠ Notifications: ${e.message}\n`); }

    setStatus(prev => prev + '\n✅ Done! Refresh the app.');
    setDone(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold text-gray-900 mb-2">Reset Payment Data</h1>
        <p className="text-gray-500 text-sm mb-6">Clears all payment links, rent records, reminders, notifications. Sapna and Nann can then submit fresh payment requests.</p>
        {!done ? (
          <button onClick={handleReset} className="w-full py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition">
            Reset All Payment Data
          </button>
        ) : (
          <div>
            <p className="text-green-600 font-medium mb-3">Done! Now Sapna and Nann will see "Pay Now" again on their dashboard.</p>
            <a href="/admin" className="text-purple-600 font-medium">Go to Admin →</a>
          </div>
        )}
        {status && (
          <pre className="mt-4 text-left text-xs bg-gray-100 rounded-xl p-4 whitespace-pre-wrap">{status}</pre>
        )}
      </div>
    </div>
  );
}
