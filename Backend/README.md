## AI Coach API

`POST /api/coach/` accepts a financial question plus the user's transactions,
budgets, and monthly income. It uses the built-in supervised TF-IDF intent
model and transaction signals to return a grounded coaching response.

```json
{
  "message": "Where am I overspending?",
  "monthly_income": 275000,
  "transactions": [],
  "budgets": []
}
```

Install the dependencies and run the Django server:

```bash
pip install -r requirements.txt
python manage.py runserver
```

Set `VITE_API_BASE_URL` in the frontend when the API runs on another host or port.