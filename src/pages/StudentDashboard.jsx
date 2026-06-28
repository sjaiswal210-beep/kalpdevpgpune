import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, LogOut, User, Phone, Mail, MapPin, Calendar, CreditCard,
  Zap, BedDouble, FileText, Bell, Moon, Sun, MessageCircle, Gift, UserCog, Wifi, Copy, Check
} from 'lucide-react';
import {
  getLoggedInStudent, studentLogout, getTenantRentHistory, getTenantElectricity,
  formatCurrency, formatDate, getMonthKey,
  RENT_PER_PERSON, getDarkMode, setDarkMode as saveDarkMode, getRentForRoom,
  createPaymentLink, markPaymentLinkPaid, getPaymentLinkByLinkId
} from '../data/store';
import { useData } from '../data/DataContext';
import StudentRewards from './StudentRewards';
import StudentProfile from './StudentProfile';
import PGMembers from './PGMembers';
import WifiDetails from './WifiDetails';
import TenantVisitors from './TenantVisitors';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { rentRecords, electricityRecords, notices } = useData();
  const [tenant, setTenant] = useState(null);
  const [darkMode, setDarkMode] = useState(getDarkMode());
  const [activeTab, setActiveTab] = useState('rewards');
  const [showProfileModal, setShowProfileModal] = useState(false);

  useEffect(() => {
    const t = getLoggedInStudent();
    if (!t) {
      navigate('/student/login', { replace: true });
      return;
    }
    setTenant(t);
  }, [navigate]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    saveDarkMode(darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    studentLogout();
    navigate('/student/login');
  };

  if (!tenant) return null;

  const rentHistory = getTenantRentHistory(rentRecords, tenant.id);
  const tenantElectricity = getTenantElectricity(electricityRecords, tenant.roomNumber);
  const currentMonth = getMonthKey();
  const isCurrentMonthPaid = rentHistory.some(r => r.month === currentMonth && r.paid);

  const tabs = [
    { id: 'rewards', label: '🎁 Rewards', icon: Gift },
    { id: 'rent', label: 'Rent History', icon: CreditCard },
    { id: 'electricity', label: 'Electricity', icon: Zap },
    { id: 'members', label: 'PG Members', icon: UserCog },
    { id: 'visitors', label: 'Visitors', icon: UserCog },
    { id: 'wifi', label: 'WiFi', icon: Wifi },
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'profile', label: 'My Profile', icon: UserCog },
    { id: 'notices', label: 'Notices', icon: Bell },
  ];

  return (
    <div className="min-h-screen font-poppins bg-cream-50 dark:bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-white text-sm">KalpDev PG</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Tenant Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('notices')}
              className="relative p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              <Bell className="w-5 h-5" />
              {notices.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notices.length > 9 ? '9+' : notices.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/30 transition text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl p-8 mb-8 text-white relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center overflow-hidden">
                {tenant.profileImage ? (
                  <img src={tenant.profileImage} alt={tenant.name} className="w-full h-full object-cover" />
                ) : (
                  <User className="w-8 h-8" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">Welcome, {tenant.name}!</h2>
                <p className="text-white/70">Room {tenant.roomNumber} • Bed {tenant.bed}</p>
              </div>
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3 py-2 bg-white/20 rounded-xl text-sm font-medium hover:bg-white/30 transition flex items-center gap-1.5"
              >
                <UserCog className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Profile</span>
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-bold">{formatCurrency(getRentForRoom(tenant.roomNumber))}</div>
                <div className="text-xs text-white/70">Monthly Rent</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-bold">{tenant.roomNumber}</div>
                <div className="text-xs text-white/70">Room No.</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-bold">Bed {tenant.bed}</div>
                <div className="text-xs text-white/70">Bed Assigned</div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-center">
                <div className={`text-lg font-bold ${isCurrentMonthPaid ? 'text-green-300' : 'text-yellow-300'}`}>
                  {isCurrentMonthPaid ? 'Paid' : 'Pending'}
                </div>
                <div className="text-xs text-white/70">This Month</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Pay Rent Section - shows when rent is pending */}
        {!isCurrentMonthPaid && tenant && (
          <PayRentCard tenant={tenant} month={currentMonth} />
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-premium'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <div className="grid md:grid-cols-2 gap-6">
              {/* Personal Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Personal Information
                </h3>
                <div className="space-y-4">
                  <InfoRow icon={User} label="Full Name" value={tenant.name} />
                  <InfoRow icon={Phone} label="Phone" value={tenant.phone} />
                  <InfoRow icon={Mail} label="Email" value={tenant.email || 'Not provided'} />
                  <InfoRow icon={MapPin} label="Address" value={tenant.address || 'Not provided'} />
                  <InfoRow icon={FileText} label="Aadhaar" value={tenant.aadhaar || 'Not provided'} />
                  <InfoRow icon={Phone} label="Emergency" value={tenant.emergency || 'Not provided'} />
                  <InfoRow icon={User} label="Parent Name" value={tenant.parentName || 'Not provided'} />
                  <InfoRow icon={Phone} label="Parent Phone" value={tenant.parentPhone || 'Not provided'} />
                </div>
              </div>

              {/* Room Info */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-card">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BedDouble className="w-5 h-5 text-purple-600" />
                  Room Details
                </h3>
                <div className="space-y-4">
                  <InfoRow icon={Building2} label="Room Number" value={tenant.roomNumber} />
                  <InfoRow icon={BedDouble} label="Bed" value={`Bed ${tenant.bed}`} />
                  <InfoRow icon={CreditCard} label="Monthly Rent" value={formatCurrency(getRentForRoom(tenant.roomNumber))} />
                  <InfoRow icon={CreditCard} label="Deposit Paid" value={formatCurrency(tenant.deposit || 0)} />
                  <InfoRow icon={Calendar} label="Join Date" value={formatDate(tenant.joinDate)} />
                </div>
                {/* WhatsApp Contact */}
                <a
                  href="https://wa.me/917350785606"
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 flex items-center justify-center gap-2 w-full py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 transition font-medium text-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  Contact Owner on WhatsApp
                </a>
              </div>
            </div>
          )}

          {activeTab === 'rent' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-purple-600" />
                  Rent Payment History
                </h3>
              </div>
              {rentHistory.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No rent payment records yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Paid Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {rentHistory.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.month}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(r.amount || getRentForRoom(tenant.roomNumber))}</td>
                          <td className="px-6 py-4">
                            <span className="badge-green">Paid</span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatDate(r.paidDate)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'electricity' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Electricity Bill History
                </h3>
              </div>
              {tenantElectricity.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No electricity records for your room yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Month</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Room Bill</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Your Share</th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Occupants</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                      {tenantElectricity.map((r, i) => (
                        <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">{r.month}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(r.totalBill)}</td>
                          <td className="px-6 py-4 text-sm font-semibold text-purple-600 dark:text-purple-400">{formatCurrency(r.perPersonAmount)}</td>
                          <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300">{r.occupants}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'notices' && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-card overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notices & Announcements
                </h3>
              </div>
              {notices.length === 0 ? (
                <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No notices posted yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {notices.slice().reverse().map((notice, i) => (
                    <div key={i} className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">{notice.title}</h4>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatDate(notice.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{notice.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'rewards' && (
            <StudentRewards />
          )}

          {activeTab === 'profile' && (
            <StudentProfile />
          )}

          {activeTab === 'members' && (
            <PGMembers />
          )}

          {activeTab === 'visitors' && (
            <TenantVisitors />
          )}

          {activeTab === 'wifi' && (
            <WifiDetails />
          )}
        </motion.div>
      </div>

      {/* Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowProfileModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 z-10">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                <button onClick={() => setShowProfileModal(false)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                  <span className="text-gray-500 text-xl">✕</span>
                </button>
              </div>
              <div className="p-4">
                <StudentProfile onSaved={() => setShowProfileModal(false)} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-700 last:border-0">
      <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <Icon className="w-4 h-4" />
        <span className="text-sm">{label}</span>
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}

function PayRentCard({ tenant, month }) {
  const { paymentLinks } = useData();
  const [processing, setProcessing] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);

  const rentAmount = getRentForRoom(tenant.roomNumber);
  const monthLabel = new Date(month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  // Check if there's already a pending/awaiting link for this tenant this month
  const existingLink = paymentLinks.find(
    l => l.tenantId === tenant.id && l.month === month && (l.status === 'awaiting_approval' || l.status === 'pending')
  );

  const isAwaiting = existingLink?.status === 'awaiting_approval';

  const handlePay = async () => {
    setProcessing(true);
    // Create a payment link and immediately mark as awaiting approval
    const link = await createPaymentLink({
      tenantId: tenant.id,
      tenantName: tenant.name,
      phone: tenant.phone,
      amount: rentAmount,
      month,
      sentVia: 'tenant_dashboard',
    });
    await markPaymentLinkPaid(link.linkId);
    setSubmitted(true);
    setProcessing(false);
  };

  const copyUPI = () => {
    navigator.clipboard.writeText('9834573544@ybl');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isAwaiting || submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-5 mb-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-400">⏳ Waiting for Admin Approval</p>
            <p className="text-xs text-amber-600 dark:text-amber-500">Your payment of {formatCurrency(rentAmount)} for {monthLabel} is being verified.</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-red-200 dark:border-red-800 rounded-2xl p-5 mb-6 shadow-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <CreditCard className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">Rent Due — {monthLabel}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Pay before the 2nd to avoid overdue</p>
          </div>
        </div>
        <span className="text-xl font-bold text-red-600">{formatCurrency(rentAmount)}</span>
      </div>

      {/* UPI Section */}
      <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-4">
        <p className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">Pay via UPI</p>
        <div className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg p-3 border border-purple-200 dark:border-purple-700 mb-3">
          <span className="flex-1 text-sm font-mono text-gray-700 dark:text-gray-300">9834573544@ybl</span>
          <button onClick={copyUPI} className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-800 text-purple-600 dark:text-purple-300 hover:bg-purple-200 transition">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Select your UPI app to pay ₹{rentAmount.toLocaleString('en-IN')}:</p>
        <div className="grid grid-cols-2 gap-2">
          <a
            href={`gpay://upi/pay?pa=9834573544@ybl&pn=KalpDev%20PG&am=${rentAmount}&cu=INR&tn=Rent%20${monthLabel}`}
            className="py-3 bg-white dark:bg-gray-700 border-2 border-blue-200 dark:border-blue-800 rounded-xl text-sm font-semibold text-center text-blue-700 dark:text-blue-300 hover:bg-blue-50 transition flex items-center justify-center gap-2"
          >
            💙 GPay
          </a>
          <a
            href={`phonepe://pay?pa=9834573544@ybl&pn=KalpDev%20PG&am=${rentAmount}&cu=INR&tn=Rent%20${monthLabel}`}
            className="py-3 bg-white dark:bg-gray-700 border-2 border-purple-200 dark:border-purple-800 rounded-xl text-sm font-semibold text-center text-purple-700 dark:text-purple-300 hover:bg-purple-50 transition flex items-center justify-center gap-2"
          >
            💜 PhonePe
          </a>
          <a
            href={`paytmmp://pay?pa=9834573544@ybl&pn=KalpDev%20PG&am=${rentAmount}&cu=INR&tn=Rent%20${monthLabel}`}
            className="py-3 bg-white dark:bg-gray-700 border-2 border-sky-200 dark:border-sky-800 rounded-xl text-sm font-semibold text-center text-sky-700 dark:text-sky-300 hover:bg-sky-50 transition flex items-center justify-center gap-2"
          >
            💙 Paytm
          </a>
          <a
            href={`upi://pay?pa=9834573544@ybl&pn=KalpDev%20PG&am=${rentAmount}&cu=INR&tn=Rent%20${monthLabel}`}
            className="py-3 bg-white dark:bg-gray-700 border-2 border-green-200 dark:border-green-800 rounded-xl text-sm font-semibold text-center text-green-700 dark:text-green-300 hover:bg-green-50 transition flex items-center justify-center gap-2"
          >
            🔗 Other UPI
          </a>
        </div>
      </div>

      {/* Confirm Payment Button */}
      <button
        onClick={handlePay}
        disabled={processing}
        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {processing ? (
          <>
            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
            Submitting...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5" />
            I Have Paid — Confirm Payment
          </>
        )}
      </button>
      <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2">
        Admin will verify and approve your payment.
      </p>
    </motion.div>
  );
}
