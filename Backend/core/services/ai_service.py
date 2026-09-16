from collections import defaultdict


class AIServiceError(Exception):
    """Raised when the financial coach cannot process a question."""
    pass


def generate_financial_response(question, transactions):
    """
    Rule-based financial coach.
    Supports five predefined financial questions.
    """

    if not question:
        raise AIServiceError("Please select a financial question.")

    question = question.strip().lower()

    # ---------------------------------------------------------
    # QUESTION 1
    # ---------------------------------------------------------
    if question == "how can i reduce my spending?":
        return (
            "To reduce your spending, start by reviewing your expense categories "
            "and identifying non-essential purchases. Set monthly limits for "
            "discretionary expenses and prioritize needs over wants. "
            "Regularly tracking your expenses can help you stay within your budget."
        )

    # ---------------------------------------------------------
    # QUESTION 2
    # ---------------------------------------------------------
    if question == "how can i save more money?":
        return (
            "To save more money, set aside a fixed portion of your income before "
            "spending on non-essential items. Track your expenses, reduce "
            "unnecessary purchases, and set a realistic monthly savings goal. "
            "Consistency is more important than saving a large amount at once."
        )

    # ---------------------------------------------------------
    # QUESTION 3
    # ---------------------------------------------------------
    if question == "am i spending too much?":
        total_income = 0
        total_expense = 0

        for transaction in transactions:
            amount = float(transaction.amount)

            if transaction.transaction_type == "income":
                total_income += amount
            elif transaction.transaction_type == "expense":
                total_expense += amount

        if total_income == 0:
            return (
                "There is not enough income data to determine whether your "
                "spending is too high. Add your income transactions first."
            )

        if total_expense > total_income:
            return (
                f"Your recorded expenses are ₹{total_expense:.2f}, while your "
                f"recorded income is ₹{total_income:.2f}. Your expenses are "
                "currently higher than your income. Consider reducing "
                "non-essential spending and reviewing your budget."
            )

        spending_percentage = (total_expense / total_income) * 100

        return (
            f"Your recorded expenses are ₹{total_expense:.2f} against income "
            f"of ₹{total_income:.2f}. You are using approximately "
            f"{spending_percentage:.1f}% of your recorded income on expenses. "
            "Review your spending categories regularly and keep enough room "
            "for savings and unexpected expenses."
        )

    # ---------------------------------------------------------
    # QUESTION 4
    # ---------------------------------------------------------
    if question == "how should i create a budget?":
        return (
            "Start by recording your monthly income and essential expenses. "
            "Then allocate part of the remaining amount toward savings and "
            "discretionary spending. Set limits for major expense categories "
            "and compare your actual spending with your planned budget regularly."
        )

    # ---------------------------------------------------------
    # QUESTION 5
    # ---------------------------------------------------------
    if question == "where am i spending the most?":
        category_totals = defaultdict(float)

        for transaction in transactions:
            if transaction.transaction_type == "expense":
                category = transaction.category or "Other"
                category_totals[category] += float(transaction.amount)

        if not category_totals:
            return (
                "There are no expense transactions available yet. "
                "Add some expenses to see your highest spending category."
            )

        highest_category, highest_amount = max(
            category_totals.items(),
            key=lambda item: item[1]
        )

        return (
            f"Your highest recorded spending category is "
            f"{highest_category}, with ₹{highest_amount:.2f} spent. "
            "Review this category and check whether any expenses can be reduced."
        )

    # ---------------------------------------------------------
    # ANY OTHER QUESTION
    # ---------------------------------------------------------
    return (
        "Please select one of the five available financial questions: "
        "How can I reduce my spending? "
        "How can I save more money? "
        "Am I spending too much? "
        "How should I create a budget? "
        "Where am I spending the most?"
    )