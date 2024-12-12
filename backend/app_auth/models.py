from django.contrib.auth.models import AbstractUser
from django.db import models

from .managers import UserManager


class User(AbstractUser):
    """
    Custom user model extending Django's AbstractUser.

    Fields:
        - username (CharField): Optional username field retained for compatibility. Not used for authentication.
        - email (EmailField): Primary field for authentication, must be unique.
        - first_name (CharField): User's first name.
        - last_name (CharField): User's last name.
        - profile_photo (ImageField): Optional profile photo for the user. Defaults to "media/users/user-default.png".

    Meta:
        - constraints: Ensures that the combination of first_name and last_name is unique.

    Additional Attributes:
        - USERNAME_FIELD (str): Specifies 'email' as the field used for authentication.
        - REQUIRED_FIELDS (list): Specifies fields required when creating a superuser (first_name, last_name).

    Methods:
        - __str__: Returns the user's full name if available, otherwise the email.
    """

    username = models.CharField(max_length=100, blank=True)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    profile_photo = models.ImageField(
        default="users/user-default.png", upload_to="users/", blank=True
    )

    objects = UserManager()
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["first_name", "last_name"]

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["first_name", "last_name"], name="unique_full_name"
            )
        ]

    def __str__(self) -> str:
        return (
            f"{self.first_name} {self.last_name}"
            if self.first_name and self.last_name
            else self.email
        )
