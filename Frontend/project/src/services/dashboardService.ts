export interface DashboardTrend {
  value: number;
  positive: boolean;
}

export interface DashboardSummary {
  currentBalance: number | null;
  monthlyIncome: number | null;
  monthlyExpense: number | null;
  totalSavings: number | null;
  investments: number | null;
  aiHealthScore: number | null;
  currentBalanceTrend: DashboardTrend | null;
  monthlyIncomeTrend: DashboardTrend | null;
  monthlyExpenseTrend: DashboardTrend | null;
  totalSavingsTrend: DashboardTrend | null;
  investmentsTrend: DashboardTrend | null;
}

export async function fetchDashboardSummary(): Promise<DashboardSummary | null> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL;

  if (!baseUrl) {
    return null;
  }

  // Do not invent a backend route. The real transaction/summary endpoint should be
  // added by the backend team and then wired here.
  return null;
}
