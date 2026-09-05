import json

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

from .models import Transaction, Budget, SavingsGoal, Receipt, ReceiptItem


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

        email = data.get('email', '').strip()
        password = data.get('password', '')

        if not email or not password:
            return JsonResponse({
                'error': 'Email and password are required.'
            }, status=400)

        user = authenticate(
            username=email,
            password=password
        )

        if user is None:
            return JsonResponse({
                'error': 'Invalid email or password.'
            }, status=401)

        return JsonResponse({
            'message': 'Login successful!',
            'user_id': user.id
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

        user_id = data.get('user_id')
        amount = data.get('amount')
        transaction_type = data.get('transaction_type', '').strip()
        category = data.get('category', '').strip()
        description = data.get('description', '').strip()
        date = data.get('date')

        if not user_id or not amount or not transaction_type or not category or not date:
            return JsonResponse({
                'error': 'User ID, amount, transaction type, category and date are required.'
            }, status=400)

        if transaction_type not in ['income', 'expense']:
            return JsonResponse({
                'error': 'Transaction type must be income or expense.'
            }, status=400)

        user = User.objects.get(id=user_id)

        transaction = Transaction.objects.create(
            user=user,
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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)

    except json.JSONDecodeError:
        return JsonResponse({
            'error': 'Invalid JSON.'
        }, status=400)
@csrf_exempt
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_transactions(request):
    if request.method != 'GET':
        return JsonResponse({
            'error': 'Only GET requests are allowed.'
        }, status=405)

    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({
            'error': 'User ID is required.'
        }, status=400)

    try:
        user = User.objects.get(id=user_id)

        transactions = Transaction.objects.filter(user=user).order_by('-date')

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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)
@csrf_exempt
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_transaction(request, transaction_id):
    if request.method != 'DELETE':
        return JsonResponse({
            'error': 'Only DELETE requests are allowed.'
        }, status=405)

    try:
        transaction = Transaction.objects.get(id=transaction_id)
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
        transaction = Transaction.objects.get(id=transaction_id)

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

    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({
            'error': 'User ID is required.'
        }, status=400)

    try:
        user = User.objects.get(id=user_id)

        total_income = Transaction.objects.filter(
            user=user,
            transaction_type='income'
        ).aggregate(total=Sum('amount'))['total'] or 0

        total_expense = Transaction.objects.filter(
            user=user,
            transaction_type='expense'
        ).aggregate(total=Sum('amount'))['total'] or 0

        balance = total_income - total_expense

        return JsonResponse({
            'total_income': str(total_income),
            'total_expense': str(total_expense),
            'balance': str(balance)
        }, status=200)

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_budget(request):
    try:
        user = User.objects.get(id=request.data.get('user_id'))

        budget = Budget.objects.create(
            user=user,
            category=request.data.get('category'),
            amount_limit=request.data.get('amount_limit'),
            start_date=request.data.get('start_date'),
            end_date=request.data.get('end_date')
        )

        return JsonResponse({
            'message': 'Budget added successfully!',
            'budget_id': budget.id
        }, status=201)

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_budgets(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({
            'error': 'User ID is required.'
        }, status=400)

    try:
        user = User.objects.get(id=user_id)

        budgets = Budget.objects.filter(user=user).order_by('-created_at')

        budget_list = []

        for budget in budgets:
            budget_list.append({
                'id': budget.id,
                'category': budget.category,
                'amount_limit': str(budget.amount_limit),
                'start_date': str(budget.start_date),
                'end_date': str(budget.end_date),
                'created_at': str(budget.created_at)
            })

        return JsonResponse({
            'budgets': budget_list
        }, status=200)

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_budget(request, budget_id):
    try:
        budget = Budget.objects.get(id=budget_id)

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
        budget = Budget.objects.get(id=budget_id)
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
        user = User.objects.get(id=request.data.get('user_id'))

        goal = SavingsGoal.objects.create(
            user=user,
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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404) 
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_savings_goals(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({
            'error': 'User ID is required.'
        }, status=400)

    try:
        user = User.objects.get(id=user_id)

        goals = SavingsGoal.objects.filter(user=user).order_by('-created_at')

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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404) 
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_savings_goal(request, goal_id):
    try:
        goal = SavingsGoal.objects.get(id=goal_id)

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
        goal = SavingsGoal.objects.get(id=goal_id)
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
        user = User.objects.get(id=request.data.get('user_id'))

        receipt = Receipt.objects.create(
            user=user,
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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)       

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_receipts(request):
    user_id = request.GET.get('user_id')

    if not user_id:
        return JsonResponse({
            'error': 'User ID is required.'
        }, status=400)

    try:
        user = User.objects.get(id=user_id)
        receipts = Receipt.objects.filter(user=user).order_by('-created_at')

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

    except User.DoesNotExist:
        return JsonResponse({
            'error': 'User not found.'
        }, status=404)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_receipt(request, receipt_id):
    try:
        receipt = Receipt.objects.get(id=receipt_id)

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
        receipt = Receipt.objects.get(id=receipt_id)
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
        receipt = Receipt.objects.get(id=request.data.get('receipt_id'))

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
        receipt = Receipt.objects.get(id=receipt_id)
        items = ReceiptItem.objects.filter(receipt=receipt)

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
        item = ReceiptItem.objects.get(id=item_id)

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
        item = ReceiptItem.objects.get(id=item_id)
        item.delete()

        return JsonResponse({
            'message': 'Receipt item deleted successfully!'
        }, status=200)

    except ReceiptItem.DoesNotExist:
        return JsonResponse({
            'error': 'Receipt item not found.'
        }, status=404)                 