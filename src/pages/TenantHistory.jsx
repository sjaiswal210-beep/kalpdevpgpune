import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { History, Search, User, Phone, Calendar, BedDouble, MapPin, Eye, X } from 'lucide-react';
import { getTenantHistory, formatDate, formatCurrency, RENT_PER_PERSON } from '../data/store';

export default function TenantHistory() {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [viewTenant, setViewTenant] = useState(null);

  useEffect(() => {
    const load = async () => {
      const data = await getTenantHistory();
      setHistory(data.sort((a, b) => new Date(b.leftDate || b.createdAt) - new Date(a.leftDate || a.createdAt)));
      setLoading(false);
    };
    load();
  }, []);

  const filtered = history.filter(t =>
    (t.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.phone || '').includes(search) ||
    (t.roomNumber || '').includes(search)
  );

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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tenant History</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{history.length} past tenants who have left the PG</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name, phone, or room..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input-field pl-12"
        />
      </div>

      {/* History List */}
      {filtered.length === 0 ? (
        <div className="glass-card-solid p-12 text-center">
          <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">
            {history.length === 0 ? 'No tenant history yet. When tenants leave, their records will appear here.' : 'No results match your search.'}
          </p>
        </div>
      ) : (
        <div className="glass-card-solid overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Joined</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Left</th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {filtered.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {t.profileImage ? (
                          <img src={t.profileImage} alt={t.name} className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{t.name?.[0]}</span>
                          </div>
                        )}
                        <span className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">
                      Room {t.roomNumber} • Bed {t.bed}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{t.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">{formatDate(t.joinDate)}</td>
                    <td className="px-6 py-4 text-sm text-red-500">{formatDate(t.leftDate)}</td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => setViewTenant(t)} className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 transition">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Detail Modal */}
      {viewTenant && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setViewTenant(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Past Tenant Details</h2>
              <button onClick={() => setViewTenant(null)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6">
              {viewTenant.profileImage && (
                <img src={viewTenant.profileImage} alt={viewTenant.name} className="w-20 h-20 rounded-2xl object-cover mx-auto mb-4 border-2 border-gray-200" />
              )}
              <div className="space-y-3">
                <DetailRow label="Name" value={viewTenant.name} />
                <DetailRow label="Phone" value={viewTenant.phone} />
                <DetailRow label="Email" value={viewTenant.email || '-'} />
                <DetailRow label="Aadhaar" value={viewTenant.aadhaar || '-'} />
                <DetailRow label="Room" value={`Room ${viewTenant.roomNumber}`} />
                <DetailRow label="Bed" value={`Bed ${viewTenant.bed}`} />
                <DetailRow label="Deposit" value={formatCurrency(viewTenant.deposit || 0)} />
                <DetailRow label="Join Date" value={formatDate(viewTenant.joinDate)} />
                <DetailRow label="Left Date" value={formatDate(viewTenant.leftDate)} />
                <DetailRow label="Occupation" value={viewTenant.occupation || '-'} />
                <DetailRow label="Blood Group" value={viewTenant.bloodGroup || '-'} />
                <DetailRow label="Emergency" value={viewTenant.emergency || '-'} />
                <DetailRow label="Address" value={viewTenant.address || '-'} />
                {viewTenant.notes && <DetailRow label="Notes" value={viewTenant.notes} />}
              </div>
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-center">
                <span className="text-sm font-medium text-red-600">Status: Left PG on {formatDate(viewTenant.leftDate)}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span className="text-sm font-medium text-gray-900 dark:text-white text-right max-w-[60%]">{value}</span>
    </div>
  );
}
