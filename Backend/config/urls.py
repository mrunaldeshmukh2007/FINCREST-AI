from django.contrib import admin
from django.urls import path

rom app.routers.expense import coach_view, predict_expense_view



urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/expenses/predict/", predict_expense_view, name="predict-expense"),
    path("api/coach/", coach_view, name="ai-coach"),
]