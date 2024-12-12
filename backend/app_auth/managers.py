from django.contrib.auth.models import BaseUserManager
from django.utils.translation import gettext_lazy as _


class UserManager(BaseUserManager):
    """
    Custom user manager for handling email-based authentication.

    Methods:
        - create_user (method): Creates and saves a regular user with the given email and password.
            - Parameters:
                - email (str): The user's email address (required).
                - password (str): The user's password (optional).
                - **extra_fields: Additional fields for the user model.
            - Raises:
                - ValueError: If the email is not provided.

        - create_superuser (method): Creates and saves a superuser with elevated permissions.
            - Parameters:
                - email (str): The superuser's email address (required).
                - password (str): The superuser's password (optional).
                - **extra_fields: Additional fields for the user model.
            - Sets:
                - is_staff: True
                - is_superuser: True
            - Raises:
                - ValueError: If is_staff or is_superuser are not set to True.
    """

    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError(_("The Email field must be set"))
        email = self.normalize_email(email)
        username = email.split("@")[0]
        first_name = extra_fields.pop("first_name").capitalize()
        last_name = extra_fields.pop("last_name").capitalize()
        user = self.model(
            email=email,
            username=username,
            first_name=first_name,
            last_name=last_name,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if not extra_fields.get("is_staff"):
            raise ValueError(_("Superuser must have is_staff=True."))
        if not extra_fields.get("is_superuser"):
            raise ValueError(_("Superuser must have is_superuser=True."))

        return self.create_user(email, password, **extra_fields)
