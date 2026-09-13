import json
import os
from collections import defaultdict
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


class AIServiceError(Exception):
    """Raised when the configured AI provider cannot return a response."""


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
    recent_transactions = []

    for transaction in transactions:
        amount = float(transaction.amount)
        totals[transaction.transaction_type] += amount
        if transaction.transaction_type == "expense":
            category_totals[transaction.category] += amount
        if len(recent_transactions) < 50:
            recent_transactions.append(
                {
                    "date": str(transaction.date),
                    "type": transaction.transaction_type,
                    "category": transaction.category,
                    "description": transaction.description,
                    "amount": amount,
                }
            )

    return json.dumps(
        {
            "transaction_count": len(transactions),
            "total_income": round(totals["income"], 2),
            "total_expense": round(totals["expense"], 2),
            "expense_by_category": {
                category: round(amount, 2)
                for category, amount in sorted(
                    category_totals.items(),
                    key=lambda item: item[1],
                    reverse=True,
                )
            },
            "recent_transactions": recent_transactions,
        },
        ensure_ascii=False,
    )
