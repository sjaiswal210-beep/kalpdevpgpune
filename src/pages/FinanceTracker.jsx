import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Wallet, TrendingUp, TrendingDown, Plus, X, ArrowUpRight, ArrowDownRight,
  Calendar, Filter, IndianRupee, PiggyBank
} from 'lucide-react';
import { formatCurrency, formatDate, getMonthKey, RENT_PER_PERSON, getRentForRoom } from '../data/store';
import { useData } from '../data/DataContext';

export default function FinanceTracker() {
  const { tenants, rentRecords, expenses, electricityRecords } = useData();
  const [filterMonth, setFilterMonth] = useState('all');

  // Build all transactions from rent records and expenses
  const allTransactions = [];

  // Income: Rent payments
  rentRecords.forEach(r => {
    if (r.paid) {
      const tenant = tenants.find(t => t.id === r.tenantId);
      allTransactions.push({
        id: r.id,
        type: 'income',
        category: 'Rent',
        description: `Rent from ${tenant?.name || 'Unknown'} - ${r.month}`,
        amount: r.amount || getRentForRoom(tenant?.roomNumber),
        date: r.paidDate || r.createdAt,
        month: r.month,
      });
    }
  });

  // Expenses
  expenses.forEach(e => {
    allTransactions.push({
      id: e.id,
      type: 'expense',
      category: e.category || 'General',
      description: e.description || e.title || 'Expense',
      amount: Number(e.amount),
      date: e.date || e.createdAt,
      month: e.date ? e.date.substring(0, 7) : (e.createdAt ? e.createdAt.substring(0, 7) : ''),
    });
  });

  // Sort by date (newest first)
  allTransactions.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // Filter by month
  const filteredTransactions = filterMonth === 'all'
    ? allTransactions
    : allTransactions.filter(t => t.month === filterMonth);

  // Calculate totals
  const totalIncome = allTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = allTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Current month totals
  const currentMonth = getMonthKey();
  const monthIncome = allTransactions.filter(t => t.type === 'income' && t.month === currentMonth).reduce((sum, t) => sum + t.amount, 0);
  const monthExpenses = allTransactions.filter(t => t.type === 'expense' && t.month === currentMonth).reduce((sum, t) => sum + t.amount, 0);
  const monthBalance = monthIncome - monthExpenses;

  // Get unique months for filter
  const months = [...new Set(allTransactions.map(t => t.month).filter(Boolean))].sort().reverse();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Finance Tracker</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Complete income, expense, and balance overview</p>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-solid p-5 border-l-4 border-purple-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <Wallet className="w-5 h-5 text-purple-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Balance</span>
          </div>
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(balance)}
          </div>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="glass-card-solid p-5 border-l-4 border-green-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Income</span>
          </div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card-solid p-5 border-l-4 border-red-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">Total Expenses</span>
          </div>
          <div className="text-2xl font-bold text-red-600">{formatCurrency(totalExpenses)}</div>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card-solid p-5 border-l-4 border-blue-500"
        >
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5 text-blue-600" />
            <span className="text-xs text-gray-500 dark:text-gray-400">This Month</span>
          </div>
          <div className={`text-2xl font-bold ${monthBalance >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
            {formatCurrency(monthBalance)}
          </div>
          <p className="text-xs text-gray-400 mt-1">
            ↑ {formatCurrency(monthIncome)} &nbsp; ↓ {formatCurrency(monthExpenses)}
          </p>
        </motion.div>
      </div>

      {/* Income vs Expense Summary Bar */}
      <div className="glass-card-solid p-5">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-3">Income vs Expenses</h3>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-green-600 font-medium">Income</span>
              <span className="text-gray-500">{formatCurrency(totalIncome)}</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all"
                style={{ width: `${totalIncome > 0 ? 100 : 0}%` }}
              ></div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-red-600 font-medium">Expenses</span>
              <span className="text-gray-500">{formatCurrency(totalExpenses)}</span>
            </div>
            <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-red-400 to-red-600 rounded-full transition-all"
                style={{ width: `${totalIncome > 0 ? Math.min((totalExpenses / totalIncome) * 100, 100) : 0}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filterMonth}
          onChange={e => setFilterMonth(e.target.value)}
          className="input-field max-w-xs text-sm"
        >
          <option value="all">All Time</option>
          {months.map(m => (
            <option key={m} value={m}>
              {new Date(m + '-01').toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
            </option>
          ))}
        </select>
        <span className="text-xs text-gray-500">{filteredTransactions.length} transactions</span>
      </div>

      {/* Transactions List */}
      <div className="glass-card-solid overflow-hidden">
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
            Transaction History
          </h3>
        </div>
        {filteredTransactions.length === 0 ? (
          <div className="p-12 text-center">
            <Wallet className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-gray-500">No transactions found.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700 max-h-[500px] overflow-y-auto">
            {filteredTransactions.map((t) => (
              <div key={t.id} className="p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/30 transition">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    t.type === 'income'
                      ? 'bg-green-100 dark:bg-green-900/30'
                      : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {t.type === 'income'
                      ? <ArrowUpRight className="w-5 h-5 text-green-600" />
                      : <ArrowDownRight className="w-5 h-5 text-red-600" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white text-sm">{t.description}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        t.type === 'income'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {t.category}
                      </span>
                      <span className="text-xs text-gray-400">{formatDate(t.date)}</span>
                    </div>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  t.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
