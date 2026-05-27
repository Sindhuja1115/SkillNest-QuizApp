from django.contrib import admin
from .models import Category, Quiz, Question, Option, Attempt


# =========================
# OPTION INLINE
# =========================
class OptionInline(admin.TabularInline):
    model = Option
    extra = 4


# =========================
# QUESTION ADMIN
# =========================
class QuestionAdmin(admin.ModelAdmin):
    inlines = [OptionInline]


# =========================
# REGISTER MODELS
# =========================
admin.site.register(Category)
admin.site.register(Quiz)
admin.site.register(Question, QuestionAdmin)
admin.site.register(Option)
admin.site.register(Attempt)

