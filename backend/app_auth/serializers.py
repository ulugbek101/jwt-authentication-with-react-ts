from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token["first_name"] = user.first_name
        token["last_name"] = user.last_name
        token["full_name"] = f"{user.first_name} {user.last_name}"
        token["email"] = user.email

        # Get the absolute URL for the profile photo
        request = cls.context.get("request")
        if request and user.profile_photo:
            token["profile_photo"] = request.build_absolute_uri(user.profile_photo.url)
        else:
            token["profile_photo"] = None  # Handle case where photo doesn't exist

        return token


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer
