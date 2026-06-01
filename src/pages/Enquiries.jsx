import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Phone, User, Clock, CheckCircle2, Trash2, MessageCircle } from 'lucide-react';
import { getCollection, COLLECTIONS, updateDocument, deleteDocument } from '../data/firebase';
import { formatDate } from '../data/store';

export default function Enquiries() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEnquiries = async () => {
    const data = await getCollection(COLLECTIONS.ENQUIRIES);
    setEnquiries(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    setLoading(false);
  };

  useEffect(() => { loadEnquiries(); }, []);

  const markAsRead = async (id) => {
    await updateDocument(COLLECTIONS.ENQUIRIES, id, { status: 'read' });
    setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status: 'read' } : e));
  };

  const deleteEnquiry = async (id) => {
    if (!window.confirm('Delete this enquiry?')) return;
    await deleteDocument(COLLECTIONS.ENQUIRIES, id);
    setEnquiries(prev => prev.filter(e => e.id !== id));
  };

  const contactOnWhatsApp = (phone, name) => {
    const message = encodeURIComponent(`Hi ${name}, thank you for your enquiry about KalpDev PG. How can we help you?`);
    window.open(`https://wa.me/91${phone}?text=${message}`, '_blank');
  };

  const newCount = enquiries.filter(e => e.status === 'new').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Enquiries</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {enquiries.length} total • {newCount} new from website contact form
          </p>
        </div>
      </div>

      {enquiries.length === 0 ? (
        <div className="glass-card-solid p-12 text-center">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No enquiries yet. They'll appear here when someone fills the contact form on your website.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {enquiries.map((e, i) => (
            <motion.div
              key={e.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className={`glass-card-solid p-5 border-l-4 ${e.status === 'new' ? 'border-pink-500' : 'border-gray-200 dark:border-gray-600'}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-4 h-4 text-gray-500" />
                    <span className="font-semibold text-gray-900 dark:text-white text-sm">{e.name}</span>
                    {e.status === 'new' && (
                      <span className="px-1.5 py-0.5 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded text-[10px] font-bold">NEW</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    <a href={`tel:${e.phone}`} className="text-sm text-blue-600 hover:underline">{e.phone}</a>
                  </div>
                  {e.message && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 mt-2">
                      "{e.message}"
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    <Clock className="w-3 h-3 text-gray-400" />
                    <span className="text-xs text-gray-400">{formatDate(e.createdAt)}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => contactOnWhatsApp(e.phone, e.name)}
                    className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition"
                    title="Reply on WhatsApp"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>
                  {e.status === 'new' && (
                    <button
                      onClick={() => markAsRead(e.id)}
                      className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition"
                      title="Mark as read"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteEnquiry(e.id)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
