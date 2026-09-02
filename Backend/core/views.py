import json

from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.views.decorators.csrf import csrf_exempt
from django.db.models import Sum

from .models import Transaction


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