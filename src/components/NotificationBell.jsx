import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, CreditCard, UserCheck, Send, AlertCircle, Gift } from 'lucide-react';
import { markNotificationRead, markAllNotificationsRead } from '../data/store';
import { useData } from '../data/DataContext';

const ICON_MAP = {
  payment_received: CreditCard,
  reminder_sent: Send,
  profile_update: UserCheck,
  new_tenant: UserCheck,
  overdue: AlertCircle,
  reward: Gift,
};

const COLOR_MAP = {
  payment_received: 'text-green-600 bg-green-100 dark:bg-green-900/30',
  reminder_sent: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
  profile_update: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30',
  new_tenant: 'text-indigo-600 bg-indigo-100 dark:bg-indigo-900/30',
  overdue: 'text-red-600 bg-red-100 dark:bg-red-900/30',
  reward: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30',
};

export default function NotificationBell() {
  const { notifications } = useData();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const adminNotifications = notifications.filter(n => n.forAdmin).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unreadCount = adminNotifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleMarkRead = async (id) => {
    await markNotificationRead(id);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead(true);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-12 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={handleMarkAllRead} className="text-xs text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
                  <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto">
              {adminNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm text-gray-500">No notifications yet</p>
                </div>
              ) : (
                adminNotifications.slice(0, 20).map(n => {
                  const Icon = ICON_MAP[n.type] || Bell;
                  const colorClass = COLOR_MAP[n.type] || 'text-gray-600 bg-gray-100';
                  return (
                    <div
                      key={n.id}
                      className={`p-3 flex items-start gap-3 border-b border-gray-50 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition cursor-pointer ${!n.read ? 'bg-purple-50/50 dark:bg-purple-900/10' : ''}`}
                      onClick={() => !n.read && handleMarkRead(n.id)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!n.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                          {n.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{n.message}</p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {!n.read && <div className="w-2 h-2 rounded-full bg-purple-500 mt-2 flex-shrink-0"></div>}
                    </div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
