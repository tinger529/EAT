from django.urls import path
from . import views

# URL configuration
urlpatterns = [
    path('hello/', views.hello),
    # user APIs
    path('account/', views.create_get_user),
    path('account/sessions/email/', views.create_session),
    path('account/sessions/<str:sessionId>/',views.delete_session),
    path('account/<str:userId>/',views.get_user),
]