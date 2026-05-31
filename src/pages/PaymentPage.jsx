import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Building2, CreditCard, CheckCircle2, AlertCircle, Clock, Copy, Check } from 'lucide-react';
import { getPaymentLinkByLinkId, markPaymentLinkPaid, formatCurrency } from '../data/store';

export default function PaymentPage() {
  const { linkId } = useParams();
  const [link, setLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const load = async () => {
      const data = await getPaymentLinkByLinkId(linkId);
      setLink(data);
      setLoading(false);
    };
    load();
  }, [linkId]);

  const handlePay = async () => {
    setProcessing(true);
    await markPaymentLinkPaid(linkId);
    setLink(prev => ({ ...prev, status: 'awaiting_approval', paidAt: new Date().toISOString() }));
    setProcessing(false);
  };

  const copyUPI = () => {
    navigator.clipboard.writeText('kalpdevpg@upi');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!link) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-indigo-50 p-4">
        <div className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full">
          <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Invalid Payment Link</h1>
          <p className="text-gray-500">This payment link is invalid or has expired.</p>
        </div>
      </div>
    );
  }

  if (link.status === 'awaiting_approval') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-yellow-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <Clock className="w-10 h-10 text-amber-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Waiting for Admin Approval</h1>
          <p className="text-gray-500 mb-4">Your payment confirmation has been submitted. Admin will verify and approve it shortly.</p>
          <div className="bg-amber-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{link.tenantName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-amber-600">{formatCurrency(link.amount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Month</span><span className="font-medium">{link.month}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Submitted</span><span className="font-medium">{new Date(link.paidAt).toLocaleDateString('en-IN')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Status</span><span className="font-medium text-amber-600">⏳ Pending Approval</span></div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (link.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-xl text-center max-w-sm w-full"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-gray-500 mb-4">Your rent has been marked as paid.</p>
          <div className="bg-green-50 rounded-xl p-4 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Name</span><span className="font-medium">{link.tenantName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Amount</span><span className="font-medium text-green-600">{formatCurrency(link.amount)}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Month</span><span className="font-medium">{link.month}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Paid On</span><span className="font-medium">{new Date(link.paidAt).toLocaleDateString('en-IN')}</span></div>
          </div>
        </motion.div>
      </div>
    );
  }

  const monthLabel = link.month ? new Date(link.month + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }) : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 p-4 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white text-center">
          <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-7 h-7" />
          </div>
          <h1 className="text-lg font-bold">KalpDev PG</h1>
          <p className="text-white/70 text-sm">Rent Payment</p>
        </div>

        {/* Payment Details */}
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tenant</span>
              <span className="font-medium text-gray-900">{link.tenantName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Month</span>
              <span className="font-medium text-gray-900">{monthLabel}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Status</span>
              <span className="flex items-center gap-1 text-amber-600 font-medium">
                <Clock className="w-3.5 h-3.5" /> Pending
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-semibold text-gray-700">Amount Due</span>
              <span className="text-xl font-bold text-purple-600">{formatCurrency(link.amount)}</span>
            </div>
          </div>

          {/* UPI Section */}
          <div className="bg-purple-50 rounded-xl p-4">
            <p className="text-sm font-medium text-purple-800 mb-2">Pay via UPI</p>
            <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-purple-200">
              <span className="flex-1 text-sm font-mono text-gray-700">kalpdevpg@upi</span>
              <button onClick={copyUPI} className="p-1.5 rounded-lg bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-purple-600 mt-2">Copy UPI ID and pay using any UPI app (GPay, PhonePe, Paytm)</p>
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
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                I Have Paid — Confirm Payment
              </>
            )}
          </button>

          <p className="text-xs text-center text-gray-400">
            After paying via UPI, click the button above to confirm. Admin will verify the payment.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
