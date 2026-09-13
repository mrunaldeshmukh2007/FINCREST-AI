from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import test_api, signup, login, add_transaction, get_transactions, delete_transaction, update_transaction, transaction_summary, predict_savings, add_budget, get_budgets, update_budget, delete_budget, add_savings_goal, get_savings_goals, update_savings_goal, delete_savings_goal, add_receipt, get_receipts, update_receipt, delete_receipt, add_receipt_item, get_receipt_items, update_receipt_item, delete_receipt_item, add_notification, get_notifications, update_notification, delete_notification, add_insight, get_insights, update_insight, delete_insight, add_chat_message, get_chat_messages, update_chat_message, delete_chat_message, digital_twin_simulate, digital_twin_data
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
    path('ml/predict-savings/', predict_savings),

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

    path('notifications/add/', add_notification),
    path('notifications/', get_notifications),
    path('notifications/<int:notification_id>/update/', update_notification),
    path('notifications/<int:notification_id>/delete/', delete_notification),

    path('insights/add/', add_insight),
    path('insights/', get_insights),
    path('insights/<int:insight_id>/update/', update_insight),
    path('insights/<int:insight_id>/delete/', delete_insight),

    path('chat-messages/add/', add_chat_message),
    path('chat-messages/', get_chat_messages),
    path('chat-messages/<int:chat_message_id>/update/', update_chat_message),
    path('chat-messages/<int:chat_message_id>/delete/', delete_chat_message),
    path('digital-twin/', digital_twin_data),
    path('digital-twin/simulate/', digital_twin_simulate),
]