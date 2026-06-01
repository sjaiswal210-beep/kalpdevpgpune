import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, AlertTriangle, CheckCircle2, Clock, Send, MessageCircle,
  ChevronLeft, ChevronRight, Bell, Link2, ExternalLink, Copy, Check, CalendarClock
} from 'lucide-react';
import {
  getPaymentStatus, getMonthKey, formatCurrency, formatDate,
  RENT_PER_PERSON, addPaymentReminder, sendRentReminderWithLink, approvePayment, rejectPayment, getRentForRoom
} from '../data/store';
import { useData } from '../data/DataContext';

export default function PaymentTracker() {
  const { tenants, rentRecords, paymentReminders, paymentLinks } = useData();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sending, setSending] = useState(null);
  const [copiedLink, setCopiedLink] = useState(null);
  const [showAutoReminder, setShowAutoReminder] = useState(false);
  const [autoReminderDismissed, setAutoReminderDismissed] = useState(false);

  const monthKey = getMonthKey(currentDate);
  const monthLabel = currentDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const paymentStatus = getPaymentStatus(tenants, rentRecords, monthKey);

  const paid = paymentStatus.filter(t => t.isPaid);
  const unpaid = paymentStatus.filter(t => !t.isPaid);
  const overdue = paymentStatus.filter(t => t.isOverdue);

  // Payment links for current month
  const monthLinks = paymentLinks.filter(l => l.month === monthKey);

  // Auto-reminder check: show prompt on/after 5th if reminders not sent this month
  useEffect(() => {
    const today = new Date();
    const dayOfMonth = today.getDate();
    const currentMk = getMonthKey(today);

    if (dayOfMonth >= 2 && !autoReminderDismissed) {
      // Check if bulk reminders were already sent this month
      const monthReminders = paymentReminders.filter(
        r => r.month === currentMk && r.type === 'whatsapp_with_link'
      );
      const unpaidThisMonth = paymentStatus.filter(t => !t.isPaid);

      // Show prompt if there are unpaid tenants and no reminders sent yet
      if (unpaidThisMonth.length > 0 && monthReminders.length === 0 && monthKey === currentMk) {
        setShowAutoReminder(true);
      } else {
        setShowAutoReminder(false);
      }
    }
  }, [paymentReminders, paymentStatus, monthKey, autoReminderDismissed]);

  const prevMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() - 1);
    setCurrentDate(d);
  };

  const nextMonth = () => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + 1);
    setCurrentDate(d);
  };

  const sendWhatsAppWithLink = async (tenant) => {
    setSending(tenant.id);
    const baseUrl = window.location.origin;
    await sendRentReminderWithLink(tenant, monthKey, baseUrl);
    setSending(null);
  };

  const sendBulkReminders = async () => {
    if (unpaid.length === 0) return;
    const baseUrl = window.location.origin;
    for (const tenant of unpaid) {
      await sendRentReminderWithLink(tenant, monthKey, baseUrl);
    }
    alert(`WhatsApp reminders with payment links sent to ${unpaid.length} tenants.`);
  };

  const copyPaymentLink = (linkId) => {
    const url = `${window.location.origin}/pay/${linkId}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(linkId);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Track payments, send WhatsApp reminders with payment links</p>
      </div>

      {/* Month Navigation */}
      <div className="flex items-center justify-between glass-card-solid p-4">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{monthLabel}</h2>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition">
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={CreditCard} label="Total Due" value={formatCurrency(paymentStatus.reduce((sum, t) => sum + getRentForRoom(t.roomNumber), 0))} color="bg-purple-50 dark:bg-purple-900/20 text-purple-600" />
        <StatCard icon={CheckCircle2} label="Paid" value={`${paid.length} tenants`} color="bg-green-50 dark:bg-green-900/20 text-green-600" />
        <StatCard icon={Clock} label="Pending" value={`${unpaid.length} tenants`} color="bg-amber-50 dark:bg-amber-900/20 text-amber-600" />
        <StatCard icon={Link2} label="Links Sent" value={`${monthLinks.length}`} color="bg-blue-50 dark:bg-blue-900/20 text-blue-600" />
      </div>

      {/* Auto-Reminder Prompt (shows on/after 5th if reminders not sent) */}
      {showAutoReminder && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <CalendarClock className="w-6 h-6 text-purple-600" />
            <div>
              <p className="font-semibold text-purple-700 dark:text-purple-400">It's the 2nd! Time to send rent reminders</p>
              <p className="text-sm text-purple-600 dark:text-purple-400">{unpaid.length} tenant(s) haven't paid yet for {monthLabel}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={sendBulkReminders} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm font-medium hover:bg-purple-700 transition flex items-center gap-2">
              <Send className="w-4 h-4" /> Send All Reminders
            </button>
            <button onClick={() => setAutoReminderDismissed(true)} className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-300 transition">
              Dismiss
            </button>
          </div>
        </motion.div>
      )}

      {/* Overdue Alert */}
      {overdue.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center justify-between flex-wrap gap-3"
        >
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500" />
            <div>
              <p className="font-semibold text-red-700 dark:text-red-400">{overdue.length} tenant(s) overdue!</p>
              <p className="text-sm text-red-600 dark:text-red-400">Rent was due on 2nd {monthLabel}</p>
            </div>
          </div>
          <button onClick={sendBulkReminders} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition flex items-center gap-2">
            <Send className="w-4 h-4" /> Send All Reminders
          </button>
        </motion.div>
      )}

      {/* Unpaid Tenants */}
      {unpaid.length > 0 && (
        <div className="glass-card-solid overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" /> Pending Payments ({unpaid.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {unpaid.map((t) => {
              const tenantLink = monthLinks.find(l => l.tenantId === t.id && l.status === 'pending');
              return (
                <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.isOverdue ? 'bg-red-100 dark:bg-red-900/30' : 'bg-amber-100 dark:bg-amber-900/30'}`}>
                      <span className={`text-sm font-bold ${t.isOverdue ? 'text-red-600' : 'text-amber-600'}`}>{t.name[0]}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Room {t.roomNumber} • Bed {t.bed}
                        {t.isOverdue && <span className="text-red-500 ml-2">• {t.daysOverdue} days overdue</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-white hidden sm:block">{formatCurrency(getRentForRoom(t.roomNumber))}</span>
                    {tenantLink && (
                      <button
                        onClick={() => copyPaymentLink(tenantLink.linkId)}
                        className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 hover:bg-blue-100 transition"
                        title="Copy Payment Link"
                      >
                        {copiedLink === tenantLink.linkId ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                    <button
                      onClick={() => sendWhatsAppWithLink(t)}
                      disabled={sending === t.id}
                      className="p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 hover:bg-green-100 transition disabled:opacity-50"
                      title="Send WhatsApp Reminder with Payment Link"
                    >
                      {sending === t.id ? (
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <MessageCircle className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Paid Tenants */}
      {paid.length > 0 && (
        <div className="glass-card-solid overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" /> Paid ({paid.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {paid.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Room {t.roomNumber} • Paid on {formatDate(t.paidDate)}</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-green-600">{formatCurrency(getRentForRoom(t.roomNumber))}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Links History */}
      {monthLinks.length > 0 && (
        <div className="glass-card-solid overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Link2 className="w-5 h-5 text-purple-500" /> Payment Links ({monthLinks.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-96 overflow-y-auto">
            {monthLinks.slice().reverse().map((l) => (
              <div key={l.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${l.status === 'paid' ? 'bg-green-500' : l.status === 'awaiting_approval' ? 'bg-amber-500 animate-pulse' : 'bg-gray-400'}`}></div>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white text-sm">{l.tenantName}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">• {formatCurrency(l.amount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                      l.status === 'paid' ? 'bg-green-100 text-green-700' :
                      l.status === 'awaiting_approval' ? 'bg-amber-100 text-amber-700' :
                      l.status === 'rejected' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {l.status === 'paid' ? 'Approved' : l.status === 'awaiting_approval' ? 'Awaiting Approval' : l.status === 'rejected' ? 'Rejected' : 'Pending'}
                    </span>
                    <button
                      onClick={() => copyPaymentLink(l.linkId)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                    >
                      {copiedLink === l.linkId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                    </button>
                  </div>
                </div>
                {/* Approve/Reject buttons for awaiting_approval */}
                {l.status === 'awaiting_approval' && (
                  <div className="mt-3 flex items-center gap-2 pl-5">
                    <button
                      onClick={async () => { await approvePayment(l.linkId); }}
                      className="px-4 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition"
                    >
                      ✓ Approve Payment
                    </button>
                    <button
                      onClick={async () => { await rejectPayment(l.linkId); }}
                      className="px-4 py-1.5 bg-red-100 text-red-600 rounded-lg text-xs font-medium hover:bg-red-200 transition"
                    >
                      ✗ Reject
                    </button>
                    <span className="text-xs text-gray-400 ml-2">Submitted {formatDate(l.paidAt)}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminder History */}
      {paymentReminders.length > 0 && (
        <div className="glass-card-solid overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-purple-500" /> Reminder History
            </h3>
          </div>
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-64 overflow-y-auto">
            {paymentReminders.slice().reverse().slice(0, 20).map((r) => (
              <div key={r.id} className="p-3 flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{r.tenantName}</span>
                  <span className="text-gray-500 dark:text-gray-400 ml-2">• {r.month} • {r.type}</span>
                </div>
                <span className="text-xs text-gray-400">{formatDate(r.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="glass-card-solid p-4">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="text-lg font-bold text-gray-900 dark:text-white">{value}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{label}</div>
    </div>
  );
}
