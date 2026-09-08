from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from app.services.ml_service import predict_expense


@csrf_exempt
def predict_expense_view(request):

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed"},
            status=405
        )

    try:
        body = json.loads(request.body)
        description = body.get("description", "").strip()

        if not description:
            return JsonResponse(
                {"error": "Description is required"},
                status=400
            )

        result = predict_expense(description)

        return JsonResponse(result)

    except Exception as e:
        return JsonResponse(
            {"error": str(e)},
            status=500
        )
