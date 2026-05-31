import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Droplets, User } from 'lucide-react';
import { useData } from '../data/DataContext';
import { getLoggedInStudent } from '../data/store';

export default function PGMembers() {
  const { tenants } = useData();
  const currentTenant = getLoggedInStudent();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">PG Members</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenants.length} members living here</p>
        </div>
      </div>

      {tenants.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center shadow-card">
          <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">No members yet.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {tenants.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-card border-2 ${
                currentTenant && currentTenant.id === t.id
                  ? 'border-purple-300 dark:border-purple-600'
                  : 'border-transparent'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Profile Image */}
                {t.profileImage ? (
                  <img
                    src={t.profileImage}
                    alt={t.name}
                    className="w-14 h-14 rounded-xl object-cover border border-gray-200 dark:border-gray-600"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{t.name?.[0] || '?'}</span>
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.name}</h4>
                    {currentTenant && currentTenant.id === t.id && (
                      <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded text-[10px] font-bold">YOU</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Room {t.roomNumber} • Bed {t.bed}
                  </p>

                  {/* Bio / Occupation */}
                  {t.occupation && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 flex items-center gap-1">
                      <User className="w-3 h-3" /> {t.occupation}
                    </p>
                  )}

                  {/* Contact & Blood Group */}
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    {t.phone && (
                      <a
                        href={`tel:${t.phone}`}
                        className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> {t.phone}
                      </a>
                    )}
                    {t.bloodGroup && (
                      <span className="flex items-center gap-1 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                        <Droplets className="w-3 h-3" /> {t.bloodGroup}
                      </span>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  {t.emergency && (
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5">
                      Emergency: {t.emergency}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
