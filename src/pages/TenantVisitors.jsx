import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserCheck, Plus, X, Phone, Calendar, FileText, CheckCircle2 } from 'lucide-react';
import { addVisitor, getLoggedInStudent, formatDate } from '../data/store';
import { useData } from '../data/DataContext';

export default function TenantVisitors() {
  const { visitors } = useData();
  const tenant = getLoggedInStudent();
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    visitorName: '',
    visitorPhone: '',
    reason: '',
    days: '',
    aadhaar: '',
  });

  const myVisitors = visitors.filter(v => v.tenantId === tenant?.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addVisitor({
      ...form,
      tenantId: tenant.id,
      tenantName: tenant.name,
      roomNumber: tenant.roomNumber,
      status: 'registered',
    });
    setForm({ visitorName: '', visitorPhone: '', reason: '', days: '', aadhaar: '' });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-purple-600" />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">My Visitors</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">Register visitors coming to meet you</p>
          </div>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl text-sm font-medium hover:from-purple-700 hover:to-indigo-700 transition"
        >
          <Plus className="w-4 h-4" /> Add Visitor
        </button>
      </div>

      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl flex items-center gap-2"
        >
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-400">Visitor registered successfully! Admin has been notified.</p>
        </motion.div>
      )}

      {/* Visitor List */}
      {myVisitors.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center shadow-card">
          <UserCheck className="w-10 h-10 mx-auto mb-2 text-gray-300" />
          <p className="text-gray-500 text-sm">No visitors registered yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {myVisitors.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{v.visitorName}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {v.visitorPhone} • {v.days} day(s) • {formatDate(v.createdAt)}
                  </p>
                  {v.reason && <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">Reason: {v.reason}</p>}
                </div>
                <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-[10px] font-bold">
                  Registered
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Visitor Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-sm shadow-2xl"
            >
              <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Register Visitor</h2>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Visitor Name *</label>
                  <input
                    type="text"
                    required
                    value={form.visitorName}
                    onChange={e => setForm({ ...form, visitorName: e.target.value })}
                    className="input-field"
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={form.visitorPhone}
                    onChange={e => setForm({ ...form, visitorPhone: e.target.value })}
                    className="input-field"
                    placeholder="10-digit number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason for Visit *</label>
                  <input
                    type="text"
                    required
                    value={form.reason}
                    onChange={e => setForm({ ...form, reason: e.target.value })}
                    className="input-field"
                    placeholder="e.g. Family visit, Friend"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Number of Days *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={form.days}
                    onChange={e => setForm({ ...form, days: e.target.value })}
                    className="input-field"
                    placeholder="How many days?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Aadhaar Number</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={form.aadhaar}
                    onChange={e => setForm({ ...form, aadhaar: e.target.value })}
                    className="input-field"
                    placeholder="12-digit Aadhaar (optional)"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition"
                >
                  Register Visitor
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
