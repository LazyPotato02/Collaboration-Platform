from rest_framework import serializers
from task.models import Task
from project.models import ProjectMembership

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__'

    def validate(self, attrs):
        request = self.context.get('request')
        task = self.instance

        new_status = attrs.get('status')

        if new_status == 'finished':
            user = request.user

            is_admin = ProjectMembership.objects.filter(
                user=user,
                project=task.project,
                role='admin'
            ).exists()

            if not is_admin:
                raise serializers.ValidationError("Only project admins can mark tasks as finished.")

        return attrs
