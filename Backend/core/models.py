from django.db import models
from django.contrib.auth.models import User


class Transaction(models.Model):

    TRANSACTION_TYPES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPES
    )

    category = models.CharField(
        max_length=100
    )

    description = models.CharField(
        max_length=255,
        blank=True
    )

    date = models.DateField()

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount}"