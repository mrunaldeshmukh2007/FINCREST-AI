from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import test_api, signup, login, add_transaction, get_transactions, delete_transaction, update_transaction, transaction_summary

urlpatterns = [
    path('signup/', signup),
    path('login/' , login),

    path('token/', TokenObtainPairView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    
    path('transactions/add/', add_transaction),
    path('transactions/', get_transactions),
    path('transactions/<int:transaction_id>/delete/', delete_transaction),
    path('transactions/<int:transaction_id>/update/', update_transaction),
    path('transactions/summary/', transaction_summary),
]