from django.urls import path
from .views import csrf, login_view, logout_view, me, cadastro_view, perfil_view, foto_perfil_view
from . import views

urlpatterns = [
    path("csrf/", csrf),
    path("login/", login_view),
    path("cadastro/", cadastro_view),
    path("logout/", logout_view),
    path("me/", me),
    path("perfil/", perfil_view),
    path("perfil/foto/", foto_perfil_view),
    path('solicitar-codigo/', views.solicitar_codigo, name='solicitar_codigo'),
    path('redefinir-senha/', views.redefinir_senha, name='redefinir_senha'),
    path('google/', views.google_login_view, name='google_login'),
]