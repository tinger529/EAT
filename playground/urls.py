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
    # group APIs
    path('databases/groups/', views.create_group),
    path('databases/groups/<str:groupId>/', views.get_groupinfo),
    path('databases/users/<str:userId>/groups/', views.user_group_relation),
    # record APIs
    path('databases/groups/<str:groupId>/records/', views.get_create_record),
    path('databases/groups/<str:groupId>/records/<str:recordId>/', views.update_delete_record),
]