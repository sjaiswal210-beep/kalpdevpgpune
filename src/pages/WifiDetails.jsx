import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Copy, Check, Eye, EyeOff } from 'lucide-react';
import { getDocument, COLLECTIONS } from '../data/firebase';

export default function WifiDetails() {
  const [wifiList, setWifiList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [showPassword, setShowPassword] = useState({});

  useEffect(() => {
    const load = async () => {
      const doc = await getDocument(COLLECTIONS.SETTINGS, 'wifi_details');
      if (doc && doc.networks) {
        setWifiList(doc.networks);
      }
      setLoading(false);
    };
    load();
  }, []);

  const copyPassword = (id, password) => {
    navigator.clipboard.writeText(password);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePassword = (id) => {
    setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-2">
        <Wifi className="w-6 h-6 text-blue-600" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">WiFi Networks</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Available WiFi connections at KalpDev PG</p>
        </div>
      </div>

      {wifiList.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-card">
          <Wifi className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No WiFi details added yet. Ask admin to update.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {wifiList.map((w, i) => (
            <motion.div
              key={w.id || i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border border-blue-100 dark:border-blue-900/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Wifi className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{w.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                        {showPassword[w.id] ? w.password : '••••••••'}
                      </span>
                      <button
                        onClick={() => togglePassword(w.id)}
                        className="p-1 rounded text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword[w.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => copyPassword(w.id, w.password)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded-xl text-xs font-medium hover:bg-blue-100 transition"
                >
                  {copiedId === w.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedId === w.id ? 'Copied!' : 'Copy'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
