// PG Structure Configuration
export const PG_STRUCTURE = {
  1: { rooms: 1, label: '1st Floor', roomNumbers: ['101'] },
  2: { rooms: 4, label: '2nd Floor', roomNumbers: ['201', '202', '203', '204'] },
  3: { rooms: 4, label: '3rd Floor', roomNumbers: ['301', '302', '303', '304'] },
};

export const ALL_ROOMS = [
  { floor: 1, room: 1, number: '101', beds: 2 },
  { floor: 2, room: 1, number: '201', beds: 2 },
  { floor: 2, room: 2, number: '202', beds: 2 },
  { floor: 2, room: 3, number: '203', beds: 2 },
  { floor: 2, room: 4, number: '204', beds: 2 },
  { floor: 3, room: 1, number: '301', beds: 2 },
  { floor: 3, room: 2, number: '302', beds: 2 },
  { floor: 3, room: 3, number: '303', beds: 2 },
  { floor: 3, room: 4, number: '304', beds: 2 },
];

export const RENT_PER_PERSON = 3500;
export const DEPOSIT_PER_BED = 3500;
export const TOTAL_ROOMS = 9;
export const TOTAL_BEDS = 18;

// LocalStorage helpers
const KEYS = {
  TENANTS: 'kalpdev_tenants',
  RENT: 'kalpdev_rent',
  ELECTRICITY: 'kalpdev_electricity',
  EXPENSES: 'kalpdev_expenses',
  VISITORS: 'kalpdev_visitors',
  NOTICES: 'kalpdev_notices',
  SETTINGS: 'kalpdev_settings',
  DARK_MODE: 'kalpdev_dark_mode',
  ADMIN_CREDS: 'kalpdev_admin_creds',
  ADMIN_SESSION: 'kalpdev_admin_session',
  STUDENT_SESSION: 'kalpdev_student_session',
  LANDING_SERVICES: 'kalpdev_landing_services',
  LANDING_TESTIMONIALS: 'kalpdev_landing_testimonials',
  LANDING_HERO: 'kalpdev_landing_hero',
};

function getItem(key, fallback = []) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Tenants
export function getTenants() {
  return getItem(KEYS.TENANTS);
}

export function saveTenants(tenants) {
  setItem(KEYS.TENANTS, tenants);
}

export function addTenant(tenant) {
  const tenants = getTenants();
  tenants.push({ ...tenant, id: generateId(), createdAt: new Date().toISOString() });
  saveTenants(tenants);
  return tenants;
}

export function updateTenant(id, data) {
  const tenants = getTenants();
  const idx = tenants.findIndex(t => t.id === id);
  if (idx !== -1) {
    tenants[idx] = { ...tenants[idx], ...data };
    saveTenants(tenants);
  }
  return tenants;
}

export function deleteTenant(id) {
  const tenants = getTenants().filter(t => t.id !== id);
  saveTenants(tenants);
  return tenants;
}

// Rent Records
export function getRentRecords() {
  return getItem(KEYS.RENT);
}

export function saveRentRecords(records) {
  setItem(KEYS.RENT, records);
}

export function markRentPaid(tenantId, month, amount) {
  const records = getRentRecords();
  records.push({
    id: generateId(),
    tenantId,
    month,
    amount,
    paid: true,
    paidDate: new Date().toISOString().split('T')[0],
  });
  saveRentRecords(records);
  return records;
}

export function markRentUnpaid(tenantId, month) {
  const records = getRentRecords().filter(
    r => !(r.tenantId === tenantId && r.month === month)
  );
  saveRentRecords(records);
  return records;
}

// Electricity
export function getElectricityRecords() {
  return getItem(KEYS.ELECTRICITY);
}

export function saveElectricityRecords(records) {
  setItem(KEYS.ELECTRICITY, records);
}

export function addElectricityBill(bill) {
  const records = getElectricityRecords();
  records.push({ ...bill, id: generateId(), createdAt: new Date().toISOString() });
  saveElectricityRecords(records);
  return records;
}

// Expenses
export function getExpenses() {
  return getItem(KEYS.EXPENSES);
}

export function saveExpenses(expenses) {
  setItem(KEYS.EXPENSES, expenses);
}

export function addExpense(expense) {
  const expenses = getExpenses();
  expenses.push({ ...expense, id: generateId(), createdAt: new Date().toISOString() });
  saveExpenses(expenses);
  return expenses;
}

// Visitors
export function getVisitors() {
  return getItem(KEYS.VISITORS);
}

export function addVisitor(visitor) {
  const visitors = getVisitors();
  visitors.push({ ...visitor, id: generateId(), createdAt: new Date().toISOString() });
  setItem(KEYS.VISITORS, visitors);
  return visitors;
}

// Notices
export function getNotices() {
  return getItem(KEYS.NOTICES);
}

export function addNotice(notice) {
  const notices = getNotices();
  notices.push({ ...notice, id: generateId(), createdAt: new Date().toISOString() });
  setItem(KEYS.NOTICES, notices);
  return notices;
}

// Dark Mode
export function getDarkMode() {
  return localStorage.getItem(KEYS.DARK_MODE) === 'true';
}

export function setDarkMode(value) {
  localStorage.setItem(KEYS.DARK_MODE, value.toString());
}

// Utility
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
}

export function getMonthKey(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function formatCurrency(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Computed helpers
export function getRoomOccupancy(roomNumber) {
  const tenants = getTenants();
  return tenants.filter(t => t.roomNumber === roomNumber);
}

export function getOccupancyStats() {
  const tenants = getTenants();
  const occupied = tenants.length;
  const vacant = TOTAL_BEDS - occupied;
  const percentage = Math.round((occupied / TOTAL_BEDS) * 100);
  return { occupied, vacant, percentage, total: TOTAL_BEDS };
}

export function getMonthlyCollection(month) {
  const records = getRentRecords().filter(r => r.month === month && r.paid);
  return records.reduce((sum, r) => sum + (r.amount || RENT_PER_PERSON), 0);
}

export function getPendingRent(month) {
  const tenants = getTenants();
  const records = getRentRecords().filter(r => r.month === month && r.paid);
  const paidIds = records.map(r => r.tenantId);
  const unpaid = tenants.filter(t => !paidIds.includes(t.id));
  return unpaid.length * RENT_PER_PERSON;
}

// ===== AUTH =====
const DEFAULT_ADMIN = { username: 'admin', password: 'admin123', name: 'KalpDev Admin' };

export function getAdminCreds() {
  return getItem(KEYS.ADMIN_CREDS, DEFAULT_ADMIN);
}

export function saveAdminCreds(creds) {
  setItem(KEYS.ADMIN_CREDS, creds);
}

export function adminLogin(username, password) {
  const creds = getAdminCreds();
  if (username === creds.username && password === creds.password) {
    sessionStorage.setItem(KEYS.ADMIN_SESSION, 'true');
    return { success: true };
  }
  return { success: false, error: 'Invalid username or password' };
}

export function isAdminLoggedIn() {
  return sessionStorage.getItem(KEYS.ADMIN_SESSION) === 'true';
}

export function adminLogout() {
  sessionStorage.removeItem(KEYS.ADMIN_SESSION);
}

export function studentLogin(phone) {
  const tenants = getTenants();
  const tenant = tenants.find(t => t.phone === phone);
  if (tenant) {
    sessionStorage.setItem(KEYS.STUDENT_SESSION, tenant.id);
    return { success: true, tenant };
  }
  return { success: false, error: 'No tenant found with this phone number' };
}

export function isStudentLoggedIn() {
  return !!sessionStorage.getItem(KEYS.STUDENT_SESSION);
}

export function getLoggedInStudent() {
  const id = sessionStorage.getItem(KEYS.STUDENT_SESSION);
  if (!id) return null;
  const tenants = getTenants();
  return tenants.find(t => t.id === id) || null;
}

export function studentLogout() {
  sessionStorage.removeItem(KEYS.STUDENT_SESSION);
}

// Get rent history for a specific tenant
export function getTenantRentHistory(tenantId) {
  return getRentRecords().filter(r => r.tenantId === tenantId);
}

// Get electricity charges for a tenant's room
export function getTenantElectricity(tenantId) {
  const tenant = getTenants().find(t => t.id === tenantId);
  if (!tenant) return [];
  const records = getElectricityRecords();
  return records.filter(r => r.roomNumber === tenant.roomNumber);
}

// ===== LANDING PAGE CMS =====
const DEFAULT_SERVICES = [
  { id: '1', title: 'Gated Society', desc: 'Secure gated community with restricted access for residents only.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&h=400&fit=crop' },
  { id: '2', title: 'CCTV Surveillance', desc: '24/7 CCTV monitoring across all floors and common areas.', img: 'https://images.unsplash.com/photo-1580795479225-c50ab8c3348d?w=600&h=400&fit=crop' },
  { id: '3', title: 'Security Guard', desc: 'Trained security personnel on duty round the clock.', img: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&h=400&fit=crop' },
  { id: '4', title: 'Mineral Drinking Water', desc: 'Pure RO mineral water available 24/7 for all residents.', img: 'https://images.unsplash.com/photo-1559839914-17aae19cec71?w=600&h=400&fit=crop' },
  { id: '5', title: 'Free High-Speed WiFi', desc: 'Unlimited high-speed internet for work and entertainment.', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&h=400&fit=crop' },
  { id: '6', title: 'Personal Cupboard', desc: 'Dedicated lockable cupboard for each resident.', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600&h=400&fit=crop' },
  { id: '7', title: 'Bed with Mattress', desc: 'Comfortable beds with quality mattresses for restful sleep.', img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop' },
  { id: '8', title: 'Fully Furnished PG', desc: 'Move-in ready rooms with all essential furniture provided.', img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop' },
  { id: '9', title: 'No Electricity Restrictions', desc: 'Use AC, heater, or any appliance — no extra charges.', img: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=600&h=400&fit=crop' },
  { id: '10', title: 'Sports & Recreation', desc: 'Badminton, carrom, and chess available for leisure time.', img: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=600&h=400&fit=crop' },
  { id: '11', title: 'Project & Technical Guidance', desc: 'Expert mentorship for academic projects and technical skills.', img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&h=400&fit=crop' },
  { id: '12', title: 'Interview Prep & Job Referrals', desc: 'Mock interviews, resume help, and direct referrals in top companies.', img: 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop' },
];

const DEFAULT_TESTIMONIALS = [
  { id: '1', name: 'Rahul Sharma', room: 'Room 201', text: 'Best PG experience! Clean rooms, great food, and amazing community.', rating: 5 },
  { id: '2', name: 'Priya Patel', room: 'Room 302', text: 'Feels like home away from home. The management is very responsive.', rating: 5 },
  { id: '3', name: 'Amit Kumar', room: 'Room 203', text: 'Affordable, comfortable, and well-maintained. Highly recommended!', rating: 4 },
];

const DEFAULT_HERO = {
  tagline: 'Premium PG Living',
  title: 'KalpDev PG',
  subtitle: 'Comfort • Safety • Better Living',
  description: 'More than just a PG — we provide career guidance, sports facilities, and a supportive community to help you grow personally and professionally.',
  heroImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=500&fit=crop',
};

export function getLandingServices() {
  return getItem(KEYS.LANDING_SERVICES, DEFAULT_SERVICES);
}

export function saveLandingServices(services) {
  setItem(KEYS.LANDING_SERVICES, services);
}

export function getLandingTestimonials() {
  return getItem(KEYS.LANDING_TESTIMONIALS, DEFAULT_TESTIMONIALS);
}

export function saveLandingTestimonials(testimonials) {
  setItem(KEYS.LANDING_TESTIMONIALS, testimonials);
}

export function getLandingHero() {
  const data = localStorage.getItem(KEYS.LANDING_HERO);
  if (data) {
    try { return JSON.parse(data); } catch { return DEFAULT_HERO; }
  }
  return DEFAULT_HERO;
}

export function saveLandingHero(hero) {
  setItem(KEYS.LANDING_HERO, hero);
}
