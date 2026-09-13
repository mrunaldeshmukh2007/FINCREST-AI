import json
from pathlib import Path
from decimal import Decimal, InvalidOperation

import joblib
import pandas as pd
from django.db.models import Sum
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from .models import Transaction, Budget, SavingsGoal, Receipt, ReceiptItem, Notification, Insight, ChatMessage
from .services.ai_service import AIServiceError, generate_financial_response
from .services.digital_twin_service import build_digital_twin_data


SAVINGS_MODEL_PATH = (
    Path(__file__).resolve().parents[2]
    / 'ML_Models'
    / 'models'
    / 'simple_savings_model.joblib'
)


def test_api(request):
    return JsonResponse({
        'message': 'FinCrest AI backend is working!'
    })


@csrf_exempt
def signup(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST requests are allowed.'
        }, status=405)

    try:
        print("DIGITAL TWIN USER:", request.user)
        print("DIGITAL TWIN USER ID:", request.user.id)
        data = json.loads(request.body)

        full_name = data.get('full_name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not full_name or not email or not password:
            return JsonResponse({
                'error': 'Full name, email and password are required.'
            }, status=400)

        if User.objects.filter(username=email).exists():
            return JsonResponse({
                'error': 'An account with this email already exists.'
            }, status=400)

        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=full_name
        )

        return JsonResponse({
            'message': 'Account created successfully!',
            'user_id': user.id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON.'
        }, status=400)


@csrf_exempt
def login(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST requests are allowed.'
        }, status=405)

    try:
        data = json.loads(request.body)

        email = data.get('username', data.get('email', '')).strip()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse({
                'error': 'Email and password are required.'
            }, status=400)

        user_record = User.objects.filter(email__iexact=email).first()
        user = authenticate(
            username=user_record.username if user_record else email,
            password=password
        )

        if user is None:
            return JsonResponse({
                'detail': 'Invalid email or password.'
            }, status=401)

        refresh = RefreshToken.for_user(user)

        return JsonResponse({
            'message': 'Login successful!',
            'user_id': user.id,
            'access': str(refresh.access_token),
            'refresh': str(refresh)
        }, status=200)

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON.'
        }, status=400)


@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_transaction(request):
    if request.method != 'POST':
        return JsonResponse({
            'error': 'Only POST requests are allowed.'
        }, status=405)

    try:
        data = json.loads(request.body)
        
        amount = data.get('amount')

        try:
            amount = Decimal(str(amount))
        except (InvalidOperation, TypeError, ValueError):
            return JsonResponse({
                'error': 'Amount must be a valid number.'
            }, status=400)


        transaction_type = data.get('transaction_type', '').strip()
        category = data.get('category', '').strip()
        description = data.get('description', '').strip()
        date = data.get('date')

        if not amount or not transaction_type or not category or not date:
            return JsonResponse({
                'error': 'Amount, transaction type, category and date are required.'
            }, status=400)

        if transaction_type not in ['income', 'expense']:
            return JsonResponse({
                'error': 'Transaction type must be income or expense.'
            }, status=400)

        transaction = Transaction.objects.create(
            user=request.user,
            amount=amount,
            transaction_type=transaction_type,
            category=category,
            description=description,
            date=date
        )

        return JsonResponse({
            'message': 'Transaction added successfully!',
            'transaction_id': transaction.id
        }, status=201)

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON.'
        }, status=400)
    
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):

    transactions = Transaction.objects.filter(
        user=request.user
    ).order_by('-date')
   
    transaction_list = [] 

    for transaction in transactions:
        transaction_list.append({
            'id': transaction.id,
            'amount': str(transaction.amount),
            'transaction_type': transaction.transaction_type,
            'category': transaction.category,
            'description': transaction.description,
            'date': str(transaction.date)
        })

    return JsonResponse({
        'transactions': transaction_list
    }, status=200)

@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_transaction(request, transaction_id):
    if request.method != 'DELETE':
        return JsonResponse({
            'error': 'Only DELETE requests are allowed.'
        }, status=405)

    try:
        transaction = Transaction.objects.get(
            id=transaction_id,
            user=request.user
        )

        transaction.delete()

        return JsonResponse({
            'message': 'Transaction deleted successfully!'
        }, status=200)

    except Transaction.DoesNotExist:
        return JsonResponse({
            'error': 'Transaction not found.'
        }, status=404)
    
@csrf_exempt
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_transaction(request, transaction_id):
    if request.method != 'PUT':
        return JsonResponse({
            'error': 'Only PUT requests are allowed.'
        }, status=405)

    try:
        transaction = Transaction.objects.get(
            id=transaction_id,
            user=request.user
        )    

        data = json.loads(request.body)

        amount = data.get('amount')
        transaction_type = data.get('transaction_type')
        category = data.get('category')
        description = data.get('description')
        date = data.get('date')

        if amount is not None:
            transaction.amount = amount

        if transaction_type is not None:
            if transaction_type not in ['income', 'expense']:
                return JsonResponse({
                    'error': 'Transaction type must be income or expense.'
                }, status=400)
            transaction.transaction_type = transaction_type

        if category is not None:
            transaction.category = category

        if description is not None:
            transaction.description = description

        if date is not None:
            transaction.date = date

        transaction.save()

        return JsonResponse({
            'message': 'Transaction updated successfully!'
        }, status=200)

    except Transaction.DoesNotExist:
        return JsonResponse({
            'error': 'Transaction not found.'
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON.'
        }, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def transaction_summary(request):
    if request.method != 'GET':
        return JsonResponse({
            'error': 'Only GET requests are allowed.'
        }, status=405)

    total_income = Transaction.objects.filter(
        user=request.user,
        transaction_type='income'
    ).aggregate(total=Sum('amount'))['total'] or 0

    total_expense = Transaction.objects.filter(
        user=request.user,
        transaction_type='expense'
    ).aggregate(total=Sum('amount'))['total'] or 0

    balance = total_income - total_expense

    return JsonResponse({
        'total_income': str(total_income),
        'total_expense': str(total_expense),
        'balance': str(balance)
    }, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_savings(request):
    try:
        bundle = joblib.load(SAVINGS_MODEL_PATH)
        features = bundle['features']
        data = request.data

        missing_columns = sorted(set(features).difference(data.keys()))
        if missing_columns:
            return Response({
                'error': 'Missing required features.',
                'missing_features': missing_columns
            }, status=400)

        input_data = pd.DataFrame([
            {feature: data[feature] for feature in features}
        ])
        input_data = input_data.apply(pd.to_numeric, errors='coerce')

        if input_data.isna().any().any():
            return Response({
                'error': 'All feature values must be numeric.'
            }, status=400)

        input_data = input_data.fillna(pd.Series(bundle['medians']))
        prediction = bundle['model'].predict(input_data)[0]

        return Response({
            'predicted_actual_savings': round(float(prediction), 2)
        })

    except Exception as error:
        return Response({
            'error': f'Unable to generate savings prediction: {error}'
        }, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_budget(request):
    try:
        budget = Budget.objects.create(
            user=request.user,
            category=request.data.get('category'),
            amount_limit=request.data.get('amount_limit'),
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date')
        )

        return JsonResponse({
            'message': 'Budget added successfully!',
            'budget_id': budget.id
        }, status=201)

    except Exception as e:
        print("DIGITAL TWIN ERROR:", e)
        return Response(
            {"error": str(e)},
            status=400
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_budgets(request):
    budgets = Budget.objects.filter(
        user=request.user
    ).order_by('-created_at')

    budget_list = []

    for budget in budgets:
        # Calculate spending for this user in this budget category
        spent = Transaction.objects.filter(
            user=request.user,
            category=budget.category,
            transaction_type='expense',
            date__gte=budget.start_date,
            date__lte=budget.end_date
        ).aggregate(
            total=Sum('amount')
        )['total'] or 0

        budget_list.append({
            'id': budget.id,
            'category': budget.category,
            'amount_limit': str(budget.amount_limit),
            'spent': str(spent),
            'start_date': str(budget.start_date),
            'end_date': str(budget.end_date),
            'created_at': str(budget.created_at),
        })

    return JsonResponse({
        'budgets': budget_list
    }, status=200)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_budget(request, budget_id):
    try:
        budget = Budget.objects.get(
            id=budget_id,
            user=request.user
        )

        category = request.data.get('category')
        amount_limit = request.data.get('amount_limit')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        if category is not None:
            budget.category = category

        if amount_limit is not None:
            budget.amount_limit = amount_limit

        if start_date is not None:
            budget.start_date = start_date

        if end_date is not None:
            budget.end_date = end_date

        budget.save()

        return JsonResponse({
            'message': 'Budget updated successfully!'
        }, status=200)

    except Budget.DoesNotExist:
        return JsonResponse({
            'error': 'Budget not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_budget(request, budget_id):
    try:
        budget = Budget.objects.get(
            id=budget_id,
            user=request.user
        )

        budget.delete()

        return JsonResponse({
            'message': 'Budget deleted successfully!'
        }, status=200)

    except Budget.DoesNotExist:
        return JsonResponse({
            'error': 'Budget not found.'
        }, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_savings_goal(request):
    try:
        goal = SavingsGoal.objects.create(
            user=request.user,
            name=request.data.get('name'),
            target_amount=request.data.get('target_amount'),
            saved_amount=request.data.get('saved_amount'),
            monthly_contribution=request.data.get('monthly_contribution'),
            target_date=request.data.get('target_date')
        )

        return JsonResponse({
            'message': 'Savings goal added successfully!',
            'goal_id': goal.id
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_savings_goals(request):
    goals = SavingsGoal.objects.filter(
        user=request.user
    ).order_by('-created_at')

    goal_list = []

    for goal in goals:
        goal_list.append({
            'id': goal.id,
            'name': goal.name,
            'target_amount': str(goal.target_amount),
            'saved_amount': str(goal.saved_amount),
            'monthly_contribution': str(goal.monthly_contribution),
            'target_date': str(goal.target_date),
            'created_at': str(goal.created_at)
        })

    return JsonResponse({
        'savings_goals': goal_list
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_savings_goal(request, goal_id):
    try:
        goal = SavingsGoal.objects.get(
            id=goal_id,
            user=request.user
        )

        name = request.data.get('name')
        target_amount = request.data.get('target_amount')
        saved_amount = request.data.get('saved_amount')
        monthly_contribution = request.data.get('monthly_contribution')
        target_date = request.data.get('target_date')

        if name is not None:
            goal.name = name

        if target_amount is not None:
            goal.target_amount = target_amount

        if saved_amount is not None:
            goal.saved_amount = saved_amount

        if monthly_contribution is not None:
            goal.monthly_contribution = monthly_contribution

        if target_date is not None:
            goal.target_date = target_date

        goal.save()

        return JsonResponse({
            'message': 'Savings goal updated successfully!'
        }, status=200)

    except SavingsGoal.DoesNotExist:
        return JsonResponse({
            'error': 'Savings goal not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_savings_goal(request, goal_id):
    try:
        goal = SavingsGoal.objects.get(
            id=goal_id,
            user=request.user
        )

        goal.delete()

        return JsonResponse({
            'message': 'Savings goal deleted successfully!'
        }, status=200)

    except SavingsGoal.DoesNotExist:
        return JsonResponse({
            'error': 'Savings goal not found.'
        }, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_receipt(request):
    try:
        receipt = Receipt.objects.create(
            user=request.user,
            merchant=request.data.get('merchant'),
            receipt_date=request.data.get('receipt_date'),
            gst_amount=request.data.get('gst_amount'),
            total_amount=request.data.get('total_amount'),
            category=request.data.get('category'),
            confidence=request.data.get('confidence')
        )

        return JsonResponse({
            'message': 'Receipt added successfully!',
            'receipt_id': receipt.id
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_receipts(request):
    receipts = Receipt.objects.filter(
        user=request.user
    ).order_by('-created_at')

    receipt_list = []

    for receipt in receipts:
        receipt_list.append({
            'id': receipt.id,
            'merchant': receipt.merchant,
            'receipt_date': str(receipt.receipt_date),
            'gst_amount': str(receipt.gst_amount),
            'total_amount': str(receipt.total_amount),
            'category': receipt.category,
            'confidence': str(receipt.confidence),
            'created_at': str(receipt.created_at)
        })

    return JsonResponse({
        'receipts': receipt_list
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_receipt(request, receipt_id):
    try:
        receipt = Receipt.objects.get(
            id=receipt_id,
            user=request.user
        )

        if request.data.get('merchant') is not None:
            receipt.merchant = request.data.get('merchant')

        if request.data.get('receipt_date') is not None:
            receipt.receipt_date = request.data.get('receipt_date')

        if request.data.get('gst_amount') is not None:
            receipt.gst_amount = request.data.get('gst_amount')

        if request.data.get('total_amount') is not None:
            receipt.total_amount = request.data.get('total_amount')

        if request.data.get('category') is not None:
            receipt.category = request.data.get('category')

        if request.data.get('confidence') is not None:
            receipt.confidence = request.data.get('confidence')

        receipt.save()

        return JsonResponse({
            'message': 'Receipt updated successfully!'
        }, status=200)

    except Receipt.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_receipt(request, receipt_id):
    try:
        receipt = Receipt.objects.get(
            id=receipt_id,
            user=request.user
        )

        receipt.delete()

        return JsonResponse({
            'message': 'Receipt deleted successfully!'
        }, status=200)

    except Receipt.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt not found.'
        }, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_receipt_item(request):
    try:
        receipt = Receipt.objects.get(
            id=request.data.get('receipt_id'),
            user=request.user
        )

        item = ReceiptItem.objects.create(
            receipt=receipt,
            name=request.data.get('name'),
            quantity=request.data.get('quantity'),
            price=request.data.get('price')
        )

        return JsonResponse({
            'message': 'Receipt item added successfully!',
            'item_id': item.id
        }, status=201)

    except Receipt.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt not found.'
        }, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_receipt_items(request, receipt_id):
    try:
        receipt = Receipt.objects.get(
            id=receipt_id,
            user=request.user
        )

        items = ReceiptItem.objects.filter(
            receipt=receipt
        )

        item_list = []

        for item in items:
            item_list.append({
                'id': item.id,
                'name': item.name,
                'quantity': item.quantity,
                'price': str(item.price)
            })

        return JsonResponse({
            'receipt_items': item_list
        }, status=200)

    except Receipt.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt not found.'
        }, status=404)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_receipt_item(request, item_id):
    try:
        item = ReceiptItem.objects.get(
            id=item_id,
            receipt__user=request.user
        )

        if request.data.get('name') is not None:
            item.name = request.data.get('name')

        if request.data.get('quantity') is not None:
            item.quantity = request.data.get('quantity')

        if request.data.get('price') is not None:
            item.price = request.data.get('price')

        item.save()

        return JsonResponse({
            'message': 'Receipt item updated successfully!'
        }, status=200)

    except ReceiptItem.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt item not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_receipt_item(request, item_id):
    try:
        item = ReceiptItem.objects.get(
            id=item_id,
            receipt__user=request.user
        )

        item.delete()

        return JsonResponse({
            'message': 'Receipt item deleted successfully!'
        }, status=200)

    except ReceiptItem.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt item not found.'
        }, status=404)    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_notification(request):
    try:
        notification = Notification.objects.create(
            user=request.user,
            type=request.data.get('type'),
            title=request.data.get('title'),
            message=request.data.get('message'),
            read=request.data.get('read', False)
        )

        return JsonResponse({
            'message': 'Notification added successfully!',
            'notification_id': notification.id
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    notifications = Notification.objects.filter(
        user=request.user
    ).order_by('-created_at')

    notification_list = []

    for notification in notifications:
        notification_list.append({
            'id': notification.id,
            'type': notification.type,
            'title': notification.title,
            'message': notification.message,
            'read': notification.read,
            'created_at': str(notification.created_at)
        })

    return JsonResponse({
        'notifications': notification_list
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_notification(request, notification_id):
    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=request.user
        )

        if request.data.get('type') is not None:
            notification.type = request.data.get('type')

        if request.data.get('title') is not None:
            notification.title = request.data.get('title')

        if request.data.get('message') is not None:
            notification.message = request.data.get('message')

        if request.data.get('read') is not None:
            notification.read = request.data.get('read')

        notification.save()

        return JsonResponse({
            'message': 'Notification updated successfully!'
        }, status=200)

    except Notification.DoesNotExist:
        return JsonResponse({
            'error': 'Notification not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_notification(request, notification_id):
    try:
        notification = Notification.objects.get(
            id=notification_id,
            user=request.user
        )

        notification.delete()

        return JsonResponse({
            'message': 'Notification deleted successfully!'
        }, status=200)

    except Notification.DoesNotExist:
        return JsonResponse({
            'error': 'Notification not found.'
        }, status=404)  


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_insight(request):
    try:
        insight = Insight.objects.create(
            user=request.user,
            type=request.data.get('type'),
            title=request.data.get('title'),
            message=request.data.get('message'),
            is_read=request.data.get('is_read', False)
        )

        return JsonResponse({
            'message': 'Insight added successfully!',
            'insight_id': insight.id
        }, status=201)

    except Exception as e:
        return JsonResponse({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_insights(request):
    insights = Insight.objects.filter(
        user=request.user
    ).order_by('-created_at')

    insight_list = []

    for insight in insights:
        insight_list.append({
            'id': insight.id,
            'type': insight.type,
            'title': insight.title,
            'message': insight.message,
            'is_read': insight.is_read,
            'created_at': str(insight.created_at)
        })

    return JsonResponse({
        'insights': insight_list
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_insight(request, insight_id):
    try:
        insight = Insight.objects.get(
            id=insight_id,
            user=request.user
        )

        if request.data.get('type') is not None:
            insight.type = request.data.get('type')

        if request.data.get('title') is not None:
            insight.title = request.data.get('title')

        if request.data.get('message') is not None:
            insight.message = request.data.get('message')

        if request.data.get('is_read') is not None:
            insight.is_read = request.data.get('is_read')

        insight.save()

        return JsonResponse({
            'message': 'Insight updated successfully!'
        }, status=200)

    except Insight.DoesNotExist:
        return JsonResponse({
            'error': 'Insight not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_insight(request, insight_id):
    try:
        insight = Insight.objects.get(
            id=insight_id,
            user=request.user
        )

        insight.delete()

        return JsonResponse({
            'message': 'Insight deleted successfully!'
        }, status=200)

    except Insight.DoesNotExist:
        return JsonResponse({
            'error': 'Insight not found.'
        }, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_chat_message(request):
    try:
        if request.data.get('role') != 'user':
            return Response({
                'error': 'Only user messages can be submitted to the AI coach.'
            }, status=400)

        text = str(request.data.get('text', '')).strip()
        if not text:
            return Response({
                'error': 'Message text is required.'
            }, status=400)

        chat_message = ChatMessage.objects.create(
            user=request.user,
            role='user',
            text=text
        )

        transactions = Transaction.objects.filter(
            user=request.user
        ).order_by('-date', '-created_at')

        try:
            ai_text = generate_financial_response(text, transactions)
        except AIServiceError as error:
            return Response({
                'error': str(error),
                'user_message_id': chat_message.id,
            }, status=503)

        ai_message = ChatMessage.objects.create(
            user=request.user,
            role='ai',
            text=ai_text
        )

        return Response({
            'message': 'Chat message added successfully!',
            'chat_message_id': chat_message.id,
            'user_message': {
                'id': chat_message.id,
                'role': chat_message.role,
                'text': chat_message.text,
                'created_at': str(chat_message.created_at),
            },
            'ai_message': {
                'id': ai_message.id,
                'role': ai_message.role,
                'text': ai_message.text,
                'created_at': str(ai_message.created_at),
            },
        }, status=201)

    except Exception as e:
        return Response({
            'error': str(e)
        }, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_chat_messages(request):
    messages = ChatMessage.objects.filter(
        user=request.user
    ).order_by('created_at')

    message_list = []

    for message in messages:
        message_list.append({
            'id': message.id,
            'role': message.role,
            'text': message.text,
            'created_at': str(message.created_at)
        })

    return JsonResponse({
        'chat_messages': message_list
    }, status=200)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_chat_message(request, chat_message_id):
    try:
        message = ChatMessage.objects.get(
            id=chat_message_id,
            user=request.user
        )

        if request.data.get('role') is not None:
            message.role = request.data.get('role')

        if request.data.get('text') is not None:
            message.text = request.data.get('text')

        message.save()

        return JsonResponse({
            'message': 'Chat message updated successfully!'
        }, status=200)

    except ChatMessage.DoesNotExist:
        return JsonResponse({
            'error': 'Chat message not found.'
        }, status=404)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_chat_message(request, chat_message_id):
    try:
        message = ChatMessage.objects.get(
            id=chat_message_id,
            user=request.user
        )

        message.delete()

        return JsonResponse({
            'message': 'Chat message deleted successfully!'
        }, status=200)

    except ChatMessage.DoesNotExist:
        return JsonResponse({
            'error': 'Chat message not found.'
        }, status=404)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def digital_twin_simulate(request):
    try:
        from django.utils import timezone
        from datetime import timedelta

        user = request.user

        # Get all transactions of the logged-in user
        transactions = Transaction.objects.filter(user=user)

        # Calculate actual income and expenses
        monthly_income = sum(
            float(t.amount)
            for t in transactions
            if t.transaction_type == 'income'
        )

        monthly_expense = sum(
            float(t.amount)
            for t in transactions
            if t.transaction_type == 'expense'
        )

        # Scenario change sent by frontend
        spending_change = float(
            request.data.get('spending_change', 0)
        )

        # Current financial position
        current_savings = monthly_income - monthly_expense

        # Apply scenario
        new_expense = monthly_expense + spending_change
        new_savings = monthly_income - new_expense

        savings_improvement = new_savings - current_savings

        return Response({
            "monthly_income": round(monthly_income, 2),
            "monthly_expense_total": round(monthly_expense, 2),
            "current_savings": round(current_savings, 2),
            "new_savings": round(new_savings, 2),
            "savings_improvement": round(savings_improvement, 2),
            "yearly_improvement": round(
                savings_improvement * 12, 2
            )
        })

    except Exception as e:
        print("DIGITAL TWIN ERROR:", e)

        return Response(
            {"error": str(e)},
            status=400
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def digital_twin_data(request):
    return Response(build_digital_twin_data(request.user), status=200)