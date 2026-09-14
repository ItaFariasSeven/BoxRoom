from django.shortcuts import render
from rest_framework import viewsets
from .models import Item
from .serializers import ItemSerializer
from rest_framework.permissions import IsAuthenticated
import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth import (authenticate, login, logout, get_user_model)



# Create your views here.
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({
        "message": "CSRF configurado"
    })

@require_POST
def login_view(request):
    try:
        dados = json.loads(request.body)
        email = dados.get("email")
        password = dados.get("password")

        # Nenhum e-mail ou senha informado 
        if not email or not password:
            return JsonResponse(
                {"erro": "E-mail e senha são obrigatórios"},
                status=400
            )

        User = get_user_model()

        usuario_encontrado =User.objects.filter(
            email__iexact=email
        ).first()

        #E-mail não encontrado
        if usuario_encontrado is None:
            return JsonResponse(
                {"erro": "E-mail ou senha incorretos"},
                status=401
            )

        usuario = authenticate(
            request,
            username=usuario_encontrado.username,
            password=password
        )

        # campo_login = User.USERNAME_FIELD

        # valor_login = getattr(
        #     usuario_encontrado,
        #     campo_login
        # )

        # usuario = authenticate(
        #     request,
        #     **{
        #         campo_login: valor_login,
        #         "password": password
        #     }
        # )

        if usuario is None:
            return JsonResponse(
                {"erro": "E-mail ou senha incorretos"},
                status=401
            )

        login(request, usuario)

        return JsonResponse({
            "message": "Login realizado com sucesso",
            # "user":{
            #     "id": usuario.id,
            #     "email": usuario.email,
            #     "username":getattr(
            #         usuario,
            #         "username",
            #         None
            #     )
            # }
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )


def me(request):
    if not request.user.is_authenticated:
        return JsonResponse(
            {"erro": "Usuário não atenticado"},
            status=401
        )
    return JsonResponse({
        "id": request.user.id,
        "email": request.user.email,
        "username": request.user.username,
    })

@require_POST
def logout_view(request):
    logout(request)

    return JsonResponse({
        "message": "Logout Realizado com sucesso"
    })

# Cadastro
@require_POST
def cadastro_view(request):
    try:
        dados = json.loads(request.body)

        nome = dados.get("nome")
        email = dados.get("email")
        password = dados.get("password")
        confirm_password = dados.get("confirmPassword")

        # Campos obrigatórios para usuário preencher
        if not nome or not email or not password or not confirm_password:
            return JsonResponse(
                {"erro": "Todos os campos são obrigatórios"},
                status=400
            )

        # Confirmação de senha
        if password != confirm_password:
            return JsonResponse(
                {"erro": "As senhas não coincidem"},
                status=400
            )

        User = get_user_model()

        # E-mail já cadastrado
        if User.objects.filter(email__iexact=email).exists():
            return JsonResponse(
                {"erro": "Este e-mail já está cadastrado"},
                status=400
            )

        usuario = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=nome
        )

        # Já deixa o usuário autenticado
        login(request, usuario)

        return JsonResponse(
            {
                "message": "Cadastro realizado com sucesso",
                "user": {
                    "id": usuario.id,
                    "email": usuario.email,
                    "nome": usuario.first_name,
                }
            },
            status=201
        )

    except json.JSONDecodeError:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )