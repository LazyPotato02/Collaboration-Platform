from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ModelSerializer
from .models import CustomUser as User

class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'password','first_name', 'last_name')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
