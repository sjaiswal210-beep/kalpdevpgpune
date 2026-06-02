import React from 'react';
import { motion } from 'framer-motion';
import { Users, Phone, Droplets, User, BedDouble, Crown } from 'lucide-react';
import { useData } from '../data/DataContext';
import { getLoggedInStudent, ALL_ROOMS, PG_STRUCTURE, getRoomOccupancy } from '../data/store';

export default function PGMembers() {
  const { tenants } = useData();
  const currentTenant = getLoggedInStudent();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Users className="w-6 h-6 text-purple-600" />
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">PG Friends</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">{tenants.length} members • {ALL_ROOMS.length} rooms</p>
        </div>
      </div>

      {/* Room Occupancy Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {ALL_ROOMS.map((room, i) => {
          const occupants = getRoomOccupancy(tenants, room.number);
          const isPremium = room.type === 'premium';
          const maxBeds = isPremium ? 1 : 2;
          const count = occupants.length;

          let statusColor = 'border-red-200 bg-red-50 dark:bg-red-900/10';
          let statusText = 'Vacant';
          if (count >= maxBeds) {
            statusColor = 'border-green-200 bg-green-50 dark:bg-green-900/10';
            statusText = 'Full';
          } else if (count > 0) {
            statusColor = 'border-amber-200 bg-amber-50 dark:bg-amber-900/10';
            statusText = 'Partial';
          }

          return (
            <motion.div
              key={room.number}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`p-3 rounded-xl border-2 ${statusColor}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-gray-900 dark:text-white text-xs flex items-center gap-1">
                  {isPremium && <Crown className="w-3.5 h-3.5 text-amber-500" />}
                  {isPremium ? '⭐ 101' : `Room ${room.number}`}
                </span>
                <span className="text-[10px] text-gray-500">{PG_STRUCTURE[room.floor].label}</span>
              </div>
              <div className="space-y-1.5">
                {isPremium ? (
                  <BedSlot tenant={occupants.find(t => t.bed === 'A')} label="Double Bed" currentTenantId={currentTenant?.id} />
                ) : (
                  <>
                    <BedSlot tenant={occupants.find(t => t.bed === 'A')} label="Bed A" currentTenantId={currentTenant?.id} />
                    <BedSlot tenant={occupants.find(t => t.bed === 'B')} label="Bed B" currentTenantId={currentTenant?.id} />
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Members Detail Cards */}
      {tenants.length > 0 && (
        <div>
          <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">All Members</h4>
          <div className="space-y-3">
            {tenants.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-card border-l-4 ${
                  currentTenant && currentTenant.id === t.id
                    ? 'border-purple-500'
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-purple-600 dark:text-purple-400">{t.name?.[0]}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{t.name}</h4>
                      {currentTenant && currentTenant.id === t.id && (
                        <span className="px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded text-[10px] font-bold">YOU</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Room {t.roomNumber} • Bed {t.bed}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    {t.phone && (
                      <a href={`tel:${t.phone}`} className="text-xs text-blue-600 hover:underline flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {t.phone}
                      </a>
                    )}
                    {t.bloodGroup && (
                      <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 mt-1 justify-end">
                        <Droplets className="w-3 h-3" /> {t.bloodGroup}
                      </span>
                    )}
                  </div>
                </div>
                {(t.occupation || t.emergency) && (
                  <div className="mt-2 pt-2 border-t border-gray-50 dark:border-gray-700 flex flex-wrap gap-3 text-[11px] text-gray-500">
                    {t.occupation && <span>🎓 {t.occupation}</span>}
                    {t.emergency && <span>📞 Emergency: {t.emergency}</span>}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BedSlot({ tenant, label, currentTenantId }) {
  const isYou = tenant && currentTenantId && tenant.id === currentTenantId;
  return (
    <div className={`flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs ${
      tenant
        ? isYou
          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
          : 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300'
        : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
    }`}>
      <BedDouble className="w-3 h-3 flex-shrink-0" />
      <span className="truncate">{tenant ? (isYou ? `${tenant.name} (You)` : tenant.name) : `${label} - Empty`}</span>
    </div>
  );
}
