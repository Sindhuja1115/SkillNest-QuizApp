from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db.models import Avg, Max
from .models import Category, Quiz, Question, Option, Attempt
from .serializers import (
    CategorySerializer,
    QuizSerializer,
    QuestionSerializer,
    AttemptSerializer,
    OptionWithCorrectSerializer,
)

# Category list (public)
class CategoryListView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [AllowAny]

# Quiz list (auth required, optional filter by category)
class QuizListView(generics.ListAPIView):
    serializer_class = QuizSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Quiz.objects.all()
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        return queryset

# Quiz detail (auth required)
class QuizDetailView(generics.RetrieveAPIView):
    serializer_class = QuizSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    queryset = Quiz.objects.all()

# Quiz questions list (auth required)
class QuizQuestionsListView(generics.ListAPIView):
    serializer_class = QuestionSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        quiz_id = self.kwargs.get('quiz_id')
        return Question.objects.filter(quiz_id=quiz_id).order_by('id')

# Submit quiz
@api_view(['POST'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def submit_quiz(request, quiz_id):
    quiz = get_object_or_404(Quiz, id=quiz_id)
    user_answers = request.data.get('answers', {})

    questions = Question.objects.filter(quiz=quiz)
    total_questions = questions.count()
    score = 0
    breakdown = []

    for question in questions:
        options = question.options.all()
        correct_option = options.filter(is_correct=True).first()
        selected_option_id = user_answers.get(str(question.id)) or user_answers.get(question.id)
        is_correct = False
        if selected_option_id is not None:
            try:
                selected_option_id = int(selected_option_id)
                if correct_option and selected_option_id == correct_option.id:
                    score += 1
                    is_correct = True
            except ValueError:
                pass

        breakdown.append({
            "question_id": question.id,
            "question_text": question.text,
            "explanation": question.explanation,
            "options": [
                {"id": opt.id, "text": opt.text, "is_correct": opt.is_correct}
                for opt in options
            ],
            "selected_option_id": selected_option_id,
            "correct_option_id": correct_option.id if correct_option else None,
            "is_correct": is_correct,
        })

    attempt = Attempt.objects.create(
        user=request.user,
        quiz=quiz,
        score=score,
        total_questions=total_questions,
    )

    return Response(
        {
            "attempt_id": attempt.id,
            "score": score,
            "total_questions": total_questions,
            "percentage": (score / total_questions * 100) if total_questions > 0 else 0,
            "breakdown": breakdown,
            "created_at": attempt.created_at,
        },
        status=status.HTTP_201_CREATED,
    )

# User attempt history
class UserAttemptHistoryView(generics.ListAPIView):
    serializer_class = AttemptSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Attempt.objects.filter(user=self.request.user).order_by('-created_at')

# Register
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    email = request.data.get('email', '')

    if not username or not password:
        return Response(
            {"message": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"message": "Username already exists."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = User.objects.create_user(username=username, password=password, email=email)
    refresh = RefreshToken.for_user(user)
    return Response(
        {
            "message": "User registered successfully.",
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "username": user.username,
        },
        status=status.HTTP_201_CREATED,
    )

# Login
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {"message": "Username and password are required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(username=username, password=password)
    if user is not None:
        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "username": user.username,
            },
            status=status.HTTP_200_OK,
        )
    return Response(
        {"message": "Invalid username or password."},
        status=status.HTTP_401_UNAUTHORIZED,
    )

# User stats
@api_view(['GET'])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def user_stats(request):
    attempts = Attempt.objects.filter(user=request.user)
    total_attempts = attempts.count()
    if total_attempts == 0:
        return Response(
            {
                "total_attempts": 0,
                "average_score": 0,
                "highest_score": 0,
                "average_accuracy": 0,
            }
        )
    average_score = attempts.aggregate(Avg('score'))['score__avg'] or 0
    highest_score = attempts.aggregate(Max('score'))['score__max'] or 0
    total_correct = sum(a.score for a in attempts)
    total_ques = sum(a.total_questions for a in attempts)
    average_accuracy = (total_correct / total_ques * 100) if total_ques > 0 else 0
    return Response(
        {
            "total_attempts": total_attempts,
            "average_score": round(average_score, 1),
            "highest_score": highest_score,
            "average_accuracy": round(average_accuracy, 1),
        }
    )
