from django.urls import path
from . import views

# URL configuration
urlpatterns = [
    path('hello/', views.hello),
    path('account/', views.create_user),
    path('account/sessions/<str:email>/', views.create_session),
]