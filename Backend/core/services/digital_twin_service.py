from collections import defaultdict

from ..models import Budget, Transaction


DEFAULT_ANNUAL_RETURN_RATE = 8.0
PROJECTION_MONTHS = 12


def build_digital_twin_data(user):
    transactions = list(
        Transaction.objects.filter(user=user).order_by('date', 'created_at')
    )
    budgets = list(Budget.objects.filter(user=user))

    monthly_income, monthly_expense = _average_monthly_totals(transactions)
    total_income = sum(
        float(transaction.amount)
        for transaction in transactions
        if transaction.transaction_type == 'income'
    )
    total_expense = sum(
        float(transaction.amount)
        for transaction in transactions
        if transaction.transaction_type == 'expense'
    )
    current_savings = total_income - total_expense
    monthly_savings = monthly_income - monthly_expense

    current_investment = 0.0
    investment_growth = 0.0
    future_investment_value = current_investment
    current_net_worth = current_savings + current_investment
    projected_savings = current_savings + (monthly_savings * PROJECTION_MONTHS)
    future_net_worth = current_net_worth + (monthly_savings * PROJECTION_MONTHS) + investment_growth

    recommended_emergency_fund = monthly_expense * 6
    current_emergency_fund = max(current_savings, 0)
    emergency_fund_coverage = _percentage(
        current_emergency_fund,
        recommended_emergency_fund,
    )
    budget_usage = _budget_usage(user, budgets)
    risk_score = 0 if not transactions else _risk_score(
        monthly_income=monthly_income,
        monthly_expense=monthly_expense,
        monthly_savings=monthly_savings,
        budget_usage=budget_usage,
        emergency_fund_coverage=emergency_fund_coverage,
    )

    timeline = []
    for month_number in range(1, PROJECTION_MONTHS + 1):
        cumulative_savings = monthly_savings * month_number
        projected_investment_value = _compound_value(
            current_investment,
            DEFAULT_ANNUAL_RETURN_RATE,
            month_number / 12,
        )
        monthly_investment_growth = projected_investment_value - current_investment
        timeline.append({
            'month': f'Month {month_number}',
            'projectedSavings': round(current_savings + cumulative_savings, 2),
            'projectedNetWorth': round(current_net_worth + cumulative_savings + monthly_investment_growth, 2),
            'projectedInvestmentValue': round(projected_investment_value, 2),
        })

    return {
        'monthlyIncome': round(monthly_income, 2),
        'monthlyExpense': round(monthly_expense, 2),
        'monthlySavings': round(monthly_savings, 2),
        'currentSavings': round(current_savings, 2),
        'currentNetWorth': round(current_net_worth, 2),
        'projectedSavings': round(projected_savings, 2),
        'futureNetWorth': round(future_net_worth, 2),
        'riskScore': risk_score,
        'healthScore': 100 - risk_score,
        'riskLevel': _risk_level(risk_score),
        'currentInvestment': round(current_investment, 2),
        'investmentGrowth': round(investment_growth, 2),
        'futureInvestmentValue': round(future_investment_value, 2),
        'currentEmergencyFund': round(current_emergency_fund, 2),
        'recommendedEmergencyFund': round(recommended_emergency_fund, 2),
        'emergencyFundCoverage': round(emergency_fund_coverage, 2),
        'hasFinancialData': bool(transactions),
        'timeline': timeline,
    }


def _average_monthly_totals(transactions):
    if not transactions:
        return 0.0, 0.0

    monthly_totals = defaultdict(lambda: {'income': 0.0, 'expense': 0.0})
    for transaction in transactions:
        month_key = (transaction.date.year, transaction.date.month)
        monthly_totals[month_key][transaction.transaction_type] += float(transaction.amount)

    first_date = min(transaction.date for transaction in transactions)
    last_date = max(transaction.date for transaction in transactions)
    month_count = ((last_date.year - first_date.year) * 12) + last_date.month - first_date.month + 1

    return (
        sum(month['income'] for month in monthly_totals.values()) / month_count,
        sum(month['expense'] for month in monthly_totals.values()) / month_count,
    )


def _budget_usage(user, budgets):
    if not budgets:
        return 0.0

    total_limit = sum(float(budget.amount_limit) for budget in budgets)
    if total_limit <= 0:
        return 0.0

    total_spent = 0.0
    for budget in budgets:
        total_spent += sum(
            float(amount)
            for amount in Transaction.objects.filter(
                user=user,
                transaction_type='expense',
                category=budget.category,
                date__gte=budget.start_date,
                date__lte=budget.end_date,
            ).values_list('amount', flat=True)
        )

    return total_spent / total_limit


def _risk_score(monthly_income, monthly_expense, monthly_savings, budget_usage, emergency_fund_coverage):
    if monthly_income <= 0:
        expense_risk = 40 if monthly_expense > 0 else 0
        savings_risk = 30
    else:
        expense_ratio = monthly_expense / monthly_income
        expense_risk = 40 if expense_ratio >= 1 else 30 if expense_ratio >= 0.8 else 20 if expense_ratio >= 0.6 else 10
        savings_rate = monthly_savings / monthly_income
        savings_risk = 30 if savings_rate <= 0 else 20 if savings_rate < 0.1 else 10 if savings_rate < 0.2 else 0

    budget_risk = 20 if budget_usage >= 1 else 10 if budget_usage >= 0.8 else 0
    emergency_risk = 10 if emergency_fund_coverage < 25 else 5 if emergency_fund_coverage < 100 else 0
    return max(0, min(100, round(expense_risk + savings_risk + budget_risk + emergency_risk)))


def _risk_level(risk_score):
    if risk_score <= 33:
        return 'Low Risk'
    if risk_score <= 66:
        return 'Medium Risk'
    return 'High Risk'


def _compound_value(principal, annual_return_rate, years):
    return principal * ((1 + annual_return_rate / 100) ** years)


def _percentage(value, total):
    if total <= 0:
        return 0.0
    return (value / total) * 100
