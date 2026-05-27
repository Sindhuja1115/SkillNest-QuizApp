from django.db import models
from django.contrib.auth.models import User


# =========================
# CATEGORY MODEL
# =========================
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True)

    def __str__(self):
        return self.name


# =========================
# QUIZ MODEL (CATEGORY + TIMER)
# =========================
class Quiz(models.Model):
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name='quizzes',
        null=True,
        blank=True
    )
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    time_limit = models.IntegerField(default=600)  # in seconds (10 min)

    def __str__(self):
        return self.title


# =========================
# QUESTION MODEL
# =========================
class Question(models.Model):
    quiz = models.ForeignKey(
        Quiz,
        on_delete=models.CASCADE,
        related_name='questions'
    )
    text = models.CharField(max_length=500)
    explanation = models.TextField(blank=True, help_text="Explanation for the correct answer")

    class Meta:
        unique_together = ('quiz', 'text')

    def __str__(self):
        return self.text


# =========================
# OPTION MODEL (FORMERLY CHOICE)
# =========================
class Option(models.Model):
    question = models.ForeignKey(
        Question,
        on_delete=models.CASCADE,
        related_name='options'
    )
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


# =========================
# RESULT / ATTEMPT MODEL
# =========================
class Attempt(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='attempts'
    )
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.quiz.title} - {self.score}/{self.total_questions}"

