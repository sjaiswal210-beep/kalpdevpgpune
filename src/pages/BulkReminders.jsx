import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle, CheckCircle2, Clock, AlertTriangle, ChevronRight, Send, X, RefreshCw
} from 'lucide-react';
import {
  getPaymentStatus, getMonthKey, formatCurrency, sendRentReminderWithLink,
  RENT_PER_PERSON, getRentForRoom, addPaymentReminder, addNotification
} from '../data/store';
import { useData } from '../data/DataContext';

export default function BulkReminders() {
  const { tenants, rentRecords, paymentLinks, paymentReminders } = useData();
  const [sending, setSending] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [sentCount, setSentCount] = useState(0);
  const [queue, setQueue] = useState([]);
  const [done, setDone] = useState(false);

  const currentMonth = getMonthKey();
  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const paymentStatus = getPaymentStatus(tenants, rentRecords, currentMonth);

  // Unpaid tenants who haven't even submitted payment
  const unpaidTenants = paymentStatus.filter(t => !t.isPaid);

  // Tenants who submitted but awaiting approval
  const awaitingTenants = paymentLinks.filter(
    l => l.month === currentMonth && l.status === 'awaiting_approval'
  );

  // Tenants who had reminders sent this month
  const remindedTenantIds = paymentReminders
    .filter(r => r.month === currentMonth)
    .map(r => r.tenantId);

  // How many times each tenant was reminded
  const reminderCounts = {};
  paymentReminders.filter(r => r.month === currentMonth).forEach(r => {
    reminderCounts[r.tenantId] = (reminderCounts[r.tenantId] || 0) + 1;
  });

  const startSending = () => {
    const q = [];

    // Add unpaid tenants
    unpaidTenants.forEach(t => {
      q.push({
        ...t,
        type: 'unpaid',
        reminderCount: reminderCounts[t.id] || 0,
      });
    });

    if (q.length === 0) {
      setDone(true);
      return;
    }

    setQueue(q);
    setCurrentIndex(0);
    setSending(true);
  };

  const sendCurrentAndNext = async () => {
    if (currentIndex >= queue.length) {
      setDone(true);
      setSending(false);
      return;
    }

    const tenant = queue[currentIndex];
    const baseUrl = window.location.origin;
    await sendRentReminderWithLink(tenant, currentMonth, baseUrl);
    setSentCount(prev => prev + 1);

    const nextIndex = currentIndex + 1;
    if (nextIndex >= queue.length) {
      setDone(true);
      setSending(false);
    } else {
      setCurrentIndex(nextIndex);
    }
  };

  const sendFollowUp = async (tenant) => {
    const rentAmount = getRentForRoom(tenant.roomNumber);
    const message = encodeURIComponent(
      `Hi ${tenant.tenantName} 👋\n\nYour payment of ₹${rentAmount} for ${monthLabel} is *pending admin approval*.\n\nIf you haven't paid yet, please pay now via UPI: *9834573544@ybl*\n\nThank you! 🙏`
    );
    window.open(`https://wa.me/91${tenant.phone}?text=${message}`, '_blank');
    await addPaymentReminder({
      tenantId: tenant.tenantId,
      tenantName: tenant.tenantName,
      month: currentMonth,
      amount: rentAmount,
      type: 'follow_up',
    });
  };

  const reset = () => {
    setQueue([]);
    setCurrentIndex(-1);
    setSentCount(0);
    setDone(false);
    setSending(false);
  };

  const dayOfMonth = new Date().getDate();
  const isReminderDay = dayOfMonth >= 2;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bulk Reminders</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Send WhatsApp reminders to all unpaid tenants in one go
        </p>
      </div>

      {/* Status Banner */}
      {!isReminderDay && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Reminders are typically sent from the 2nd of the month. Today is the {dayOfMonth}{dayOfMonth === 1 ? 'st' : 'th'}.
          </p>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="glass-card-solid p-4 text-center">
          <div className="text-2xl font-bold text-red-600">{unpaidTenants.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Unpaid this month</div>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <div className="text-2xl font-bold text-amber-600">{awaitingTenants.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Awaiting approval</div>
        </div>
        <div className="glass-card-solid p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{formatCurrency(unpaidTenants.reduce((s, t) => s + getRentForRoom(t.roomNumber), 0))}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Pending amount</div>
        </div>
      </div>

      {/* Main Action */}
      {!sending && !done && (
        <div className="glass-card-solid p-6">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Unpaid Tenants ({unpaidTenants.length})</h3>
          {unpaidTenants.length === 0 ? (
            <div className="text-center py-6">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-2 text-green-500" />
              <p className="text-gray-500">All tenants have paid for {monthLabel}! 🎉</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-5">
                {unpaidTenants.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/10 rounded-xl">
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</span>
                      <span className="text-xs text-gray-500 ml-2">Room {t.roomNumber}</span>
                      {reminderCounts[t.id] > 0 && (
                        <span className="ml-2 text-xs text-orange-500">({reminderCounts[t.id]} reminder{reminderCounts[t.id] > 1 ? 's' : ''} sent)</span>
                      )}
                    </div>
                    <span className="text-sm font-semibold text-red-600">{formatCurrency(getRentForRoom(t.roomNumber))}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startSending}
                className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Start Sending Reminders ({unpaidTenants.length})
              </button>
            </>
          )}
        </div>
      )}

      {/* Sending Flow */}
      {sending && currentIndex < queue.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-solid p-6 text-center"
        >
          <div className="mb-4">
            <div className="text-sm text-gray-500 mb-2">{currentIndex + 1} of {queue.length}</div>
            <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all"
                style={{ width: `${((currentIndex) / queue.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 mb-5">
            <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
            <h3 className="font-bold text-gray-900 dark:text-white text-lg">{queue[currentIndex]?.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Room {queue[currentIndex]?.roomNumber} • {formatCurrency(getRentForRoom(queue[currentIndex]?.roomNumber))}</p>
            <p className="text-xs text-gray-400 mt-1">
              {reminderCounts[queue[currentIndex]?.id] > 0
                ? `Previously reminded ${reminderCounts[queue[currentIndex]?.id]} time(s)`
                : 'First reminder'}
            </p>
          </div>

          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            WhatsApp will open with a pre-filled message and payment link. Send it, then come back and tap Next.
          </p>

          <button
            onClick={sendCurrentAndNext}
            className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transition flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            Open WhatsApp & Send → Next
          </button>
          <button onClick={reset} className="mt-2 text-sm text-gray-400 hover:text-gray-600">Stop</button>
        </motion.div>
      )}

      {/* Done */}
      {done && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-solid p-6 text-center"
        >
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1">All Done!</h3>
          <p className="text-sm text-gray-500 mb-4">{sentCount} reminder(s) sent for {monthLabel}</p>
          <button onClick={reset} className="px-6 py-2.5 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2 mx-auto">
            <RefreshCw className="w-4 h-4" /> Send Again
          </button>
        </motion.div>
      )}

      {/* Awaiting Approval Follow-ups */}
      {awaitingTenants.length > 0 && (
        <div className="glass-card-solid overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              Awaiting Approval — Send Follow-up ({awaitingTenants.length})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">These tenants submitted payment but you haven't approved yet</p>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {awaitingTenants.map(l => (
              <div key={l.id} className="p-4 flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900 dark:text-white text-sm">{l.tenantName}</div>
                  <div className="text-xs text-gray-500">{formatCurrency(l.amount)} • Submitted {new Date(l.paidAt).toLocaleDateString('en-IN')}</div>
                </div>
                <button
                  onClick={() => sendFollowUp(l)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 rounded-xl text-xs font-medium hover:bg-amber-100 transition"
                >
                  <MessageCircle className="w-3.5 h-3.5" /> Follow-up
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
