from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import test_api, signup, login, add_transaction, get_transactions, delete_transaction, update_transaction, transaction_summary, add_budget, get_budgets, update_budget, delete_budget, add_savings_goal, get_savings_goals, update_savings_goal, delete_savings_goal, add_receipt, get_receipts, update_receipt, delete_receipt, add_receipt_item, get_receipt_items, update_receipt_item, delete_receipt_item

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

    path('budgets/add/', add_budget),
    path('budgets/', get_budgets),
    path('budgets/<int:budget_id>/update/', update_budget),
    path('budgets/<int:budget_id>/delete/', delete_budget),

    path('savings-goals/add/', add_savings_goal),
    path('savings-goals/', get_savings_goals),
    path('savings-goals/<int:goal_id>/update/', update_savings_goal),
    path('savings-goals/<int:goal_id>/delete/', delete_savings_goal),

    path('receipts/add/', add_receipt),
    path('receipts/', get_receipts),
    path('receipts/<int:receipt_id>/update/', update_receipt),
    path('receipts/<int:receipt_id>/delete/', delete_receipt),

    path('receipt-item/add/', add_receipt_item),
    path('receipt-item/<int:receipt_id>/', get_receipt_items),
    path('receipt-item/<int:item_id>/update/', update_receipt_item),
    path('receipt-item/<int:item_id>/delete/', delete_receipt_item),
]
