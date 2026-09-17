from collections import defaultdict


class AIServiceError(Exception):
    """Raised when the financial coach cannot process a question."""
    pass


def generate_financial_response(question, transactions):
    api_key = os.getenv("AI_API_KEY")
    if not api_key:
        raise AIServiceError("AI service is not configured. Set AI_API_KEY on the backend.")

    api_url = os.getenv(
        "AI_API_URL",
        "https://api.openai.com/v1/chat/completions",
    )
    model = os.getenv("AI_MODEL", "gpt-4o-mini")

    transaction_context = _build_transaction_context(transactions)
    payload = {
        "model": model,
        "temperature": 0.2,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are FinCrest AI, a careful personal finance coach. "
                    "Answer the user's question using only the authenticated user's transaction data "
                    "provided below. Never invent amounts, merchants, dates, balances, investments, "
                    "or goals. If the data is insufficient, say so clearly and explain what the user "
                    "should add. Give practical, non-guaranteed financial guidance and do not present "
                    "investment advice as a certainty. Keep the response concise and readable.\n\n"
                    f"Authenticated user's transaction data:\n{transaction_context}"
                ),
            },
            {"role": "user", "content": question},
        ],
    }

    request = Request(
        api_url,
        data=json.dumps(payload).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urlopen(request, timeout=30) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        raise AIServiceError(f"AI provider request failed with status {error.code}.") from error
    except (URLError, TimeoutError, json.JSONDecodeError) as error:
        raise AIServiceError("AI provider could not be reached.") from error

    try:
        answer = response_data["choices"][0]["message"]["content"].strip()
    except (KeyError, IndexError, AttributeError) as error:
        raise AIServiceError("AI provider returned an invalid response.") from error

    if not answer:
        raise AIServiceError("AI provider returned an empty response.")

    return answer


def _build_transaction_context(transactions):
    if not transactions:
        return "No transactions have been recorded yet."

    totals = defaultdict(float)
    category_totals = defaultdict(float)

    for transaction in transactions:
        amount = float(transaction.amount)

        if transaction.transaction_type == "income":
            total_income += amount

        elif transaction.transaction_type == "expense":
            total_expense += amount

            category = transaction.category or "Other"
            category_totals[category] += amount

    savings = total_income - total_expense

    # ---------------------------------------------------------
    # QUESTION 1
    # How can I reduce my spending?
    # ---------------------------------------------------------
    if question == "how can i reduce my spending?":

        if total_expense == 0:
            return (
                "You have no recorded expenses yet. "
                "Add some expense transactions to receive spending insights."
            )

        if not category_totals:
            return (
                "Start recording expenses by category. "
                "This will help identify where you can reduce spending."
            )

        highest_category = max(
            category_totals,
            key=category_totals.get
        )

        highest_amount = category_totals[highest_category]

        return (
            f"Your highest spending category is {highest_category}, "
            f"with ₹{highest_amount:,.2f} spent. "
            f"Review your expenses in this category and try to reduce "
            f"non-essential spending."
        )

    # ---------------------------------------------------------
    # QUESTION 2
    # Where am I spending the most?
    # ---------------------------------------------------------
    elif question == "where am i spending the most?":

        if not category_totals:
            return "You have no recorded expenses yet."

        highest_category = max(
            category_totals,
            key=category_totals.get
        )

        highest_amount = category_totals[highest_category]

        return (
            f"You are spending the most on {highest_category}: "
            f"₹{highest_amount:,.2f}."
        )

    # ---------------------------------------------------------
    # QUESTION 3
    # How much have I saved?
    # ---------------------------------------------------------
    elif question == "how much have i saved?":

        if total_income == 0:
            return (
                "No income has been recorded yet, "
                "so your savings cannot be calculated."
            )

        if savings > 0:
            return (
                f"Your current recorded savings are "
                f"₹{savings:,.2f} "
                f"(income ₹{total_income:,.2f} minus expenses "
                f"₹{total_expense:,.2f})."
            )

        elif savings == 0:
            return (
                "Your recorded income and expenses are equal. "
                "Your current savings are ₹0.00."
            )

        else:
            return (
                f"Your expenses exceed your recorded income by "
                f"₹{abs(savings):,.2f}."
            )

    # ---------------------------------------------------------
    # QUESTION 4
    # What is my biggest expense category?
    # ---------------------------------------------------------
    elif question == "what is my biggest expense category?":

        if not category_totals:
            return "You have no recorded expenses yet."

        highest_category = max(
            category_totals,
            key=category_totals.get
        )

        highest_amount = category_totals[highest_category]

        return (
            f"Your biggest expense category is "
            f"{highest_category}, totaling "
            f"₹{highest_amount:,.2f}."
        )

    # ---------------------------------------------------------
    # QUESTION 5
    # What should I improve in my spending?
    # ---------------------------------------------------------
    elif question == "what should i improve in my spending?":

        if total_expense == 0:
            return (
                "There are no recorded expenses yet. "
                "Start tracking your expenses to identify areas "
                "that can be improved."
            )

        if not category_totals:
            return (
                "Add categories to your expense transactions "
                "so your spending patterns can be analyzed."
            )

        highest_category = max(
            category_totals,
            key=category_totals.get
        )

        highest_amount = category_totals[highest_category]

        if total_income > 0:
            savings_rate = (savings / total_income) * 100
        else:
            savings_rate = 0

        if savings_rate < 0:
            return (
                f"Your expenses currently exceed your income. "
                f"Focus first on reducing your highest spending "
                f"category, {highest_category}, where you spent "
                f"₹{highest_amount:,.2f}."
            )

        elif savings_rate < 20:
            return (
                f"Your savings rate is approximately "
                f"{savings_rate:.1f}%. "
                f"Consider reducing spending in your highest "
                f"category, {highest_category}, and increasing "
                f"your monthly savings."
            )

        else:
            return (
                f"Your current savings rate is approximately "
                f"{savings_rate:.1f}%. "
                f"Your spending appears relatively controlled. "
                f"Continue monitoring your highest expense category, "
                f"{highest_category}."
            )

    # ---------------------------------------------------------
    # Anything other than the 5 questions
    # ---------------------------------------------------------
    else:
        raise AIServiceError(
            "Please select one of the five available financial questions."
        )