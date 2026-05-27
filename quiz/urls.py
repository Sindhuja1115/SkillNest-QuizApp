from django.urls import path
from .views import (
    register,
    login,
    CategoryListView,
    QuizListView,
    QuizDetailView,
    QuizQuestionsListView,
    submit_quiz,
    UserAttemptHistoryView,
    user_stats
)

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('categories/', CategoryListView.as_view(), name='categories'),
    path('quizzes/', QuizListView.as_view(), name='quizzes'),
    path('quizzes/<int:pk>/', QuizDetailView.as_view(), name='quiz-detail'),
    path('quizzes/<int:quiz_id>/questions/', QuizQuestionsListView.as_view(), name='quiz-questions'),
    path('quizzes/<int:quiz_id>/submit/', submit_quiz, name='submit-quiz'),
    path('attempts/', UserAttemptHistoryView.as_view(), name='attempts'),
    path('user-stats/', user_stats, name='user-stats'),
]
