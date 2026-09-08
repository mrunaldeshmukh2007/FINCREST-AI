from django.contrib import admin
from django.urls import path

from app.routers.expense import predict_expense_view



urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/expenses/predict/", predict_expense_view, name="predict-expense"),
]