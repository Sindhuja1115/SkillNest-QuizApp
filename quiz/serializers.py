from rest_framework import serializers
from .models import Category, Quiz, Question, Option, Attempt
from django.contrib.auth.models import User


# =========================
# CATEGORY SERIALIZER
# =========================
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'


# =========================
# OPTION SERIALIZER
# =========================
class OptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'question', 'text']  # EXCLUDES is_correct to prevent client-side cheating


# =========================
# OPTION SERIALIZER (WITH CORRECT FIELD FOR SUBMISSION RESULTS)
# =========================
class OptionWithCorrectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Option
        fields = ['id', 'question', 'text', 'is_correct']


# =========================
# QUESTION SERIALIZER
# =========================
class QuestionSerializer(serializers.ModelSerializer):
    options = OptionSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'explanation', 'options']


# =========================
# QUIZ SERIALIZER
# =========================
class QuizSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True, allow_null=True)
    questions_count = serializers.IntegerField(source='questions.count', read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'category', 'category_name', 'title', 'description', 'time_limit', 'questions_count']


# =========================
# ATTEMPT SERIALIZER
# =========================
class AttemptSerializer(serializers.ModelSerializer):
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)
    category_name = serializers.CharField(source='quiz.category.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Attempt
        fields = ['id', 'user', 'username', 'quiz', 'quiz_title', 'category_name', 'score', 'total_questions', 'created_at']
        read_only_fields = ['user']
