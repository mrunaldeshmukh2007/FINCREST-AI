import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/context/ThemeContext';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import LandingPage from '@/pages/LandingPage';
import SignIn from '@/pages/SignIn';
import SignUp from '@/pages/SignUp';
import ForgotPassword from '@/pages/ForgotPassword';
import Onboarding from '@/pages/Onboarding';
import DashboardLayout from '@/pages/dashboard/DashboardLayout';
import DashboardHome from '@/pages/dashboard/DashboardHome';
import Transactions from '@/pages/dashboard/Transactions';
import Budgets from '@/pages/dashboard/Budgets';
import Goals from '@/pages/dashboard/Goals';
import DigitalTwin from '@/pages/dashboard/DigitalTwin';
import AICoach from '@/pages/dashboard/AICoach';
import ReceiptScanner from '@/pages/dashboard/ReceiptScanner';
import Insights from '@/pages/dashboard/Insights';
import Reports from '@/pages/dashboard/Reports';
import Notifications from '@/pages/dashboard/Notifications';
import Profile from '@/pages/dashboard/Profile';
import Settings from '@/pages/dashboard/Settings';

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedBackground />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/app" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="budgets" element={<Budgets />} />
            <Route path="goals" element={<Goals />} />
            <Route path="digital-twin" element={<DigitalTwin />} />
            <Route path="ai-coach" element={<AICoach />} />
            <Route path="receipt-scanner" element={<ReceiptScanner />} />
            <Route path="insights" element={<Insights />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
