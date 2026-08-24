export interface Transaction {
  id: string;
  merchant: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  status: 'completed' | 'pending' | 'failed';
  paymentMode: 'UPI' | 'Card' | 'Bank Transfer' | 'Cash' | 'Wallet';
  date: string;
  aiRecommendation?: string;
}

export interface Budget {
  category: string;
  spent: number;
  limit: number;
  color: string;
  icon: string;
  aiSuggestion: string;
}

export interface Goal {
  id: string;
  name: string;
  target: number;
  saved: number;
  monthlyContribution: number;
  predictedDate: string;
  icon: string;
  color: string;
  aiSuggestion: string;
}

export const transactions: Transaction[] = [
  { id: 't1', merchant: 'Swiggy', category: 'Food', amount: 540, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-28', aiRecommendation: 'You\'ve ordered 6x this week. Try meal prep to save ₹2,000/mo.' },
  { id: 't2', merchant: 'Salary - TechCorp', category: 'Salary', amount: 185000, type: 'income', status: 'completed', paymentMode: 'Bank Transfer', date: '2026-07-01' },
  { id: 't3', merchant: 'Amazon', category: 'Shopping', amount: 3299, type: 'expense', status: 'completed', paymentMode: 'Card', date: '2026-07-27', aiRecommendation: 'Similar items available 18% cheaper on Flipkart.' },
  { id: 't4', merchant: 'Zomato', category: 'Food', amount: 720, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-27' },
  { id: 't5', merchant: 'Uber', category: 'Travel', amount: 285, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-26', aiRecommendation: 'Metro route available for ₹60. Potential savings ₹225.' },
  { id: 't6', merchant: 'Netflix', category: 'Entertainment', amount: 649, type: 'expense', status: 'completed', paymentMode: 'Card', date: '2026-07-25' },
  { id: 't7', merchant: 'Freelance Project', category: 'Freelancing', amount: 45000, type: 'income', status: 'completed', paymentMode: 'Bank Transfer', date: '2026-07-20' },
  { id: 't8', merchant: 'BSES Electricity', category: 'Bills', amount: 3200, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-18' },
  { id: 't9', merchant: 'BigBasket', category: 'Food', amount: 2100, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-17' },
  { id: 't10', merchant: 'BookMyShow', category: 'Entertainment', amount: 1200, type: 'expense', status: 'pending', paymentMode: 'Card', date: '2026-07-16' },
  { id: 't11', merchant: 'Apollo Pharmacy', category: 'Healthcare', amount: 850, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-15' },
  { id: 't12', merchant: 'SIP - Axis MF', category: 'Investments', amount: 10000, type: 'expense', status: 'completed', paymentMode: 'Bank Transfer', date: '2026-07-05', aiRecommendation: 'On track. Increasing SIP by 10% could add ₹4.2L in 10yrs.' },
  { id: 't13', merchant: 'Myntra', category: 'Shopping', amount: 1899, type: 'expense', status: 'completed', paymentMode: 'Card', date: '2026-07-12' },
  { id: 't14', merchant: 'Jio Recharge', category: 'Bills', amount: 399, type: 'expense', status: 'completed', paymentMode: 'UPI', date: '2026-07-10' },
  { id: 't15', merchant: 'Starbucks', category: 'Food', amount: 480, type: 'expense', status: 'failed', paymentMode: 'Card', date: '2026-07-09' },
];

export const budgets: Budget[] = [
  { category: 'Food', spent: 8420, limit: 12000, color: '#2563EB', icon: '🍽️', aiSuggestion: 'At 70% utilization. Consider setting a ₹500/order cap.' },
  { category: 'Shopping', spent: 5198, limit: 8000, color: '#7C3AED', icon: '🛍️', aiSuggestion: 'On track. 35% budget remaining for 4 days.' },
  { category: 'Travel', spent: 2850, limit: 5000, color: '#38BDF8', icon: '🚕', aiSuggestion: 'Using 57%. Metro days could save ₹1,200/mo.' },
  { category: 'Entertainment', spent: 1849, limit: 3000, color: '#F59E0B', icon: '🎬', aiSuggestion: 'Consider a family plan to split Netflix cost.' },
  { category: 'Bills', spent: 3599, limit: 6000, color: '#10B981', icon: '💡', aiSuggestion: 'Within range. Solar credit could reduce by ₹400.' },
  { category: 'Healthcare', spent: 850, limit: 4000, color: '#EF4444', icon: '⚕️', aiSuggestion: 'Low usage. Keep emergency buffer for monsoon season.' },
  { category: 'Education', spent: 2400, limit: 5000, color: '#8B5CF6', icon: '📚', aiSuggestion: 'Coursera subscription active. Great ROI.' },
  { category: 'Investments', spent: 10000, limit: 15000, color: '#22C55E', icon: '📈', aiSuggestion: 'Increase SIP by ₹5,000 to hit retirement goal 2yrs earlier.' },
];

export const goals: Goal[] = [
  { id: 'g1', name: 'Emergency Fund', target: 300000, saved: 185000, monthlyContribution: 15000, predictedDate: '2026-12-15', icon: '🛡️', color: '#10B981', aiSuggestion: 'On track. 62% complete. Auto-debit ensures consistency.' },
  { id: 'g2', name: 'MacBook Pro M4', target: 250000, saved: 142000, monthlyContribution: 20000, predictedDate: '2026-10-02', icon: '💻', color: '#2563EB', aiSuggestion: '57% saved. Consider HDFC card EMI as alternative.' },
  { id: 'g3', name: 'Trip to Goa', target: 60000, saved: 48000, monthlyContribution: 8000, predictedDate: '2026-09-20', icon: '🏖️', color: '#38BDF8', aiSuggestion: '80% complete! Book flights 45 days early to save 22%.' },
  { id: 'g4', name: 'Europe Tour', target: 500000, saved: 95000, monthlyContribution: 25000, predictedDate: '2027-08-10', icon: '✈️', color: '#7C3AED', aiSuggestion: '19% saved. Schengen visa fund separate. Increase by ₹5K/mo.' },
  { id: 'g5', name: 'New Car', target: 800000, saved: 210000, monthlyContribution: 30000, predictedDate: '2027-06-01', icon: '🚗', color: '#F59E0B', aiSuggestion: '26% saved. EV tax credit could save ₹1.2L on purchase.' },
  { id: 'g6', name: 'Dream House', target: 5000000, saved: 620000, monthlyContribution: 50000, predictedDate: '2029-03-15', icon: '🏠', color: '#EF4444', aiSuggestion: '12% saved. Home loan pre-approval recommended at 30%.' },
];

export const monthlyIncome = [
  { month: 'Jan', income: 210000, expense: 145000 },
  { month: 'Feb', income: 215000, expense: 138000 },
  { month: 'Mar', income: 230000, expense: 162000 },
  { month: 'Apr', income: 218000, expense: 151000 },
  { month: 'May', income: 245000, expense: 175000 },
  { month: 'Jun', income: 240000, expense: 158000 },
  { month: 'Jul', income: 230000, expense: 142000 },
  { month: 'Aug', income: 250000, expense: 168000 },
  { month: 'Sep', income: 248000, expense: 155000 },
  { month: 'Oct', income: 262000, expense: 178000 },
  { month: 'Nov', income: 258000, expense: 149000 },
  { month: 'Dec', income: 275000, expense: 185000 },
];

export const cashFlow = [
  { day: 'W1', inflow: 58000, outflow: 32000 },
  { day: 'W2', inflow: 12000, outflow: 28000 },
  { day: 'W3', inflow: 45000, outflow: 38000 },
  { day: 'W4', inflow: 185000, outflow: 44000 },
];

export const categoryDistribution = [
  { name: 'Food', value: 8420, color: '#2563EB' },
  { name: 'Shopping', value: 5198, color: '#7C3AED' },
  { name: 'Bills', value: 3599, color: '#10B981' },
  { name: 'Travel', value: 2850, color: '#38BDF8' },
  { name: 'Entertainment', value: 1849, color: '#F59E0B' },
  { name: 'Healthcare', value: 850, color: '#EF4444' },
];

export const savingsGrowth = [
  { month: 'Jan', savings: 65000, invested: 30000 },
  { month: 'Feb', savings: 72000, invested: 35000 },
  { month: 'Mar', savings: 68000, invested: 42000 },
  { month: 'Apr', savings: 67000, invested: 48000 },
  { month: 'May', savings: 70000, invested: 52000 },
  { month: 'Jun', savings: 82000, invested: 58000 },
  { month: 'Jul', savings: 88000, invested: 65000 },
];

export const healthTrend = [
  { month: 'Feb', score: 62 },
  { month: 'Mar', score: 68 },
  { month: 'Apr', score: 71 },
  { month: 'May', score: 75 },
  { month: 'Jun', score: 79 },
  { month: 'Jul', score: 84 },
];

export const spendingHeatmap = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => {
    const isWeekend = day >= 5;
    const isPeak = hour >= 11 && hour <= 22;
    let intensity = 0.1;
    if (isPeak) intensity = isWeekend ? 0.7 + Math.random() * 0.3 : 0.4 + Math.random() * 0.4;
    else if (hour >= 7) intensity = 0.2 + Math.random() * 0.3;
    return Math.round(intensity * 100);
  })
);

export const insights = [
  { type: 'warning', title: 'Food spending up 26%', message: 'You spent ₹2,180 more on food vs last month. Swiggy & Zomato dominate.', icon: '🍽️' },
  { type: 'success', title: 'Shopping expenses decreased', message: 'Great job! Shopping spend dropped 31% — saved ₹2,340 this month.', icon: '🛍️' },
  { type: 'info', title: 'Weekend spending increased', message: 'Weekend spend rose 18%. Mostly dining out & entertainment.', icon: '📅' },
  { type: 'success', title: 'Potential savings ₹4,800/mo', message: 'AI found 3 recurring subscriptions you barely use.', icon: '💡' },
  { type: 'warning', title: 'Investment opportunity', message: '₹15,000 idle in savings. Move to liquid fund for 6.5% returns.', icon: '📈' },
  { type: 'info', title: 'Bill due in 3 days', message: 'BSES Electricity ₹3,200 due July 31. Auto-pay not set.', icon: '⚡' },
];

export const notifications = [
  { id: 'n1', type: 'warning', title: 'Food budget at 70%', message: 'You\'ve used ₹8,420 of ₹12,000 food budget this month.', time: '2h ago', read: false },
  { id: 'n2', type: 'success', title: 'Goa trip 80% funded!', message: 'Just ₹12,000 more to reach your Goa trip goal.', time: '5h ago', read: false },
  { id: 'n3', type: 'info', title: 'AI Recommendation', message: 'Move ₹15,000 idle cash to a liquid fund for 6.5% returns.', time: '1d ago', read: false },
  { id: 'n4', type: 'warning', title: 'Upcoming bill', message: 'BSES Electricity ₹3,200 due in 3 days. Set up auto-pay?', time: '1d ago', read: true },
  { id: 'n5', type: 'success', title: 'SIP invested', message: '₹10,000 SIP in Axis MF executed successfully.', time: '2d ago', read: true },
  { id: 'n6', type: 'danger', title: 'Fraud alert', message: 'Unusual ₹4,500 transaction detected on your card. Verify now.', time: '3d ago', read: true },
  { id: 'n7', type: 'info', title: 'Investment reminder', message: 'Markets are 8% down. Good time to add to your index fund.', time: '4d ago', read: true },
];

export const achievements = [
  { name: 'First SIP', icon: '🎯', earned: true, date: '2026-01-05' },
  { name: '7-Day Saving Streak', icon: '🔥', earned: true, date: '2026-03-12' },
  { name: 'Budget Master', icon: '👑', earned: true, date: '2026-05-20' },
  { name: '₹1L Saved', icon: '💎', earned: true, date: '2026-06-08' },
  { name: 'Investment Pro', icon: '📈', earned: true, date: '2026-07-01' },
  { name: '₹5L Net Worth', icon: '🏆', earned: false, date: null },
  { name: '365-Day Streak', icon: '⚡', earned: false, date: null },
  { name: 'Debt Free', icon: '🦅', earned: false, date: null },
];

export const chatSuggestions = [
  'Reduce my expenses',
  'Where am I overspending?',
  'Create a monthly budget',
  'Can I invest right now?',
  'Should I buy a laptop?',
  'How do I save ₹2 lakh?',
];

export const chatHistory = [
  { role: 'user', text: 'Where am I overspending?' },
  { role: 'ai', text: 'Looking at your last 30 days, food delivery (Swiggy + Zomato) is your biggest leak — ₹8,420 spent, which is 26% above your 6-month average. I also spotted 3 subscriptions you haven\'t used in 45+ days (₹847/mo). Cutting these alone saves ₹4,800/month. Want me to draft a trimmed budget?' },
];

export const receiptData = {
  merchant: 'BigBasket',
  date: '2026-07-17',
  gst: 382,
  total: 2100,
  items: [
    { name: 'Fresh Vegetables', qty: 1, price: 450 },
    { name: 'Aashirvaad Atta 5kg', qty: 1, price: 320 },
    { name: 'Amul Gold Milk 1L', qty: 4, price: 280 },
    { name: 'Basmati Rice 5kg', qty: 1, price: 540 },
    { name: 'Toor Dal 1kg', qty: 1, price: 180 },
    { name: 'Fortune Sunflower Oil', qty: 1, price: 268 },
  ],
  category: 'Food',
  confidence: 98.7,
};
