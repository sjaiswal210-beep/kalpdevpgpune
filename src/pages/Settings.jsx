import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Key, Building2, Save, Check, Wifi, Plus, Trash2 } from 'lucide-react';
import { getAdminCreds, saveAdminCreds } from '../data/store';
import { getDocument, setDocument, COLLECTIONS } from '../data/firebase';

export default function Settings() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [wifiList, setWifiList] = useState([]);
  const [wifiSaved, setWifiSaved] = useState(false);
  const [newWifi, setNewWifi] = useState({ name: '', password: '' });

  useEffect(() => {
    const loadData = async () => {
      const creds = await getAdminCreds();
      setUsername(creds.username);
      setPassword(creds.password);
      // Load WiFi details
      const wifiDoc = await getDocument(COLLECTIONS.SETTINGS, 'wifi_details');
      if (wifiDoc && wifiDoc.networks) {
        setWifiList(wifiDoc.networks);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    await saveAdminCreds({ username, password, name: 'KalpDev Admin' });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addWifi = () => {
    if (!newWifi.name) return;
    setWifiList(prev => [...prev, { ...newWifi, id: Date.now().toString() }]);
    setNewWifi({ name: '', password: '' });
  };

  const removeWifi = (id) => {
    setWifiList(prev => prev.filter(w => w.id !== id));
  };

  const saveWifi = async () => {
    await setDocument(COLLECTIONS.SETTINGS, 'wifi_details', { networks: wifiList });
    setWifiSaved(true);
    setTimeout(() => setWifiSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage admin credentials and preferences</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Admin Credentials */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-solid p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">Admin Credentials</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Update login username and password</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field"
              />
            </div>
            <button type="submit" className="btn-premium flex items-center gap-2">
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* PG Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-solid p-6"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">PG Information</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Building configuration</p>
            </div>
          </div>
          <div className="space-y-3">
            <InfoItem label="PG Name" value="KalpDev PG" />
            <InfoItem label="Total Floors" value="3" />
            <InfoItem label="Total Rooms" value="9" />
            <InfoItem label="Total Beds" value="17" />
            <InfoItem label="Standard Rent" value="₹3,500/month" />
            <InfoItem label="Premium Rent (101)" value="₹7,500/month" />
            <InfoItem label="1st Floor" value="1 Premium Room, 1 Bed" />
            <InfoItem label="2nd Floor" value="4 Rooms, 8 Beds" />
            <InfoItem label="3rd Floor" value="4 Rooms, 8 Beds" />
          </div>
        </motion.div>
      </div>

      {/* WiFi Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card-solid p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <Wifi className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">WiFi Details</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Manage WiFi networks visible to tenants</p>
            </div>
          </div>
          <button onClick={saveWifi} className="btn-premium flex items-center gap-2 text-sm">
            {wifiSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {wifiSaved ? 'Saved!' : 'Save WiFi'}
          </button>
        </div>

        {/* Add new WiFi */}
        <div className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="WiFi Name (SSID)"
            value={newWifi.name}
            onChange={e => setNewWifi({ ...newWifi, name: e.target.value })}
            className="input-field flex-1"
          />
          <input
            type="text"
            placeholder="Password"
            value={newWifi.password}
            onChange={e => setNewWifi({ ...newWifi, password: e.target.value })}
            className="input-field flex-1"
          />
          <button onClick={addWifi} disabled={!newWifi.name} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>

        {/* WiFi List */}
        {wifiList.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No WiFi networks added yet. Add one above.</p>
        ) : (
          <div className="space-y-2">
            {wifiList.map(w => (
              <div key={w.id} className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-500" /> {w.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Password: <span className="font-mono">{w.password}</span></div>
                </div>
                <button onClick={() => removeWifi(w.id)} className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 hover:bg-red-100 transition">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
