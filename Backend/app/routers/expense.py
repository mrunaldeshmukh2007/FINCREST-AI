from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json

from app.services.ml_service import predict_expense
from app.services.coach_service import coach


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


@csrf_exempt
def coach_view(request):
    if request.method != "POST":
        return JsonResponse({"error": "Only POST method is allowed"}, status=405)
    try:
        body = json.loads(request.body or "{}")
        if not isinstance(body, dict):
            return JsonResponse({"error": "Request body must be an object"}, status=400)
        if not str(body.get("message", "")).strip():
            return JsonResponse({"error": "Message is required"}, status=400)
        return JsonResponse(coach(body))
    except (TypeError, ValueError) as error:
        return JsonResponse({"error": str(error)}, status=400)