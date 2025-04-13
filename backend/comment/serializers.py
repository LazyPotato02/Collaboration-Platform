from rest_framework import serializers

from comment.models import Comment
from user.serializers import UserMiniSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserMiniSerializer(read_only=True) 
    class Meta:
        model = Comment
        fields = '__all__'
        read_only_fields = ('id', 'timestamp', 'is_deleted')
