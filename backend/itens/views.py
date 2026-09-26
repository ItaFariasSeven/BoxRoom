from django.shortcuts import render
from rest_framework import viewsets, status
from .models import Item, Categoria, Perfil
from .serializers import ItemSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
import json
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST
from django.contrib.auth import (authenticate, login, logout, get_user_model)
from django.db import transaction
from django.shortcuts import get_object_or_404
from django.db.models.deletion import ProtectedError
from .serializers import ItemSerializer, CategoriaSerializer
from django.db.models import (F,Sum,Value,Case,When,IntegerField,DecimalField,ExpressionWrapper,)
from django.db.models.functions import Coalesce
from rest_framework.views import APIView
from decimal import Decimal
from django.views.decorators.http import (require_http_methods)
from django.utils import timezone
from datetime import timedelta
from django.middleware.csrf import get_token

# Create your views here.
# Endpoint que gera e retorna o token CSRF para o frontend usar em requisições POST
@ensure_csrf_cookie
def csrf(request):
    return JsonResponse({
        "csrfToken": get_token(request)
    })

# Endpoint de login: recebe email/senha via JSON e autentica o usuário
@require_POST
def login_view(request):
    try:
        dados = json.loads(request.body)
        email = dados.get("email")
        password = dados.get("password")

        # Valida se os campos obrigatórios foram enviados
        if not email or not password:
            return JsonResponse(
                {"erro": "E-mail e senha são obrigatórios"},
                status=400
            )

        User = get_user_model()

        # Busca usuário pelo e-mail (case-insensitive)
        usuario_encontrado =User.objects.filter(
            email__iexact=email
        ).first()

        #E-mail não encontrado
        if usuario_encontrado is None:
            return JsonResponse(
                {"erro": "E-mail ou senha incorretos"},
                status=401
            )

        # Tenta autenticar usando o username interno (que é o próprio e-mail)
        usuario = authenticate(
            request,
            username=usuario_encontrado.username,
            password=password
        )

        # Senha incorreta
        if usuario is None:
            return JsonResponse(
                {"erro": "E-mail ou senha incorretos"},
                status=401
            )

        # Cria a sessão do usuário autenticado
        login(request, usuario)

        return JsonResponse({
            "message": "Login realizado com sucesso",
        })

    except json.JSONDecodeError:
        return JsonResponse(
            {"erro": "JSON inválido"},
            status=400
        )


# Endpoint simples que retorna dados básicos do usuário logado (verificação de sessão)
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


# Endpoint de perfil: suporta GET (ver dados), PATCH (editar nome) e DELETE (excluir conta)
@require_http_methods([
    "GET",
    "PATCH",
    "DELETE"
])

def perfil_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "erro":
            "Usuário não autenticado"
        },
        status=401
    )
    if request.method == "GET":
        # Busca ou cria o Perfil vinculado ao usuário (relação 1:1)
        perfil, criado = Perfil.objects.get_or_create(
            usuario=request.user
        )

        foto_url = None

        if perfil.foto:
            # Monta URL completa (com domínio) da foto de perfil
            foto_url = request.build_absolute_uri(
                perfil.foto.url
        )
        return JsonResponse({
            "id":
            request.user.id,
            "nome":
            request.user.first_name,
            "email":
            request.user.email,
            "foto":
            foto_url,
        })

    # Para PATCH e DELETE, faz o parse do corpo JSON
    try:
        dados = json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return JsonResponse({
                "erro":
                "JSON inválido"
            },
            status=400
        )
    if request.method == "PATCH":
        # Atualiza apenas o nome (first_name) do usuário
        nome = (dados.get("nome", "").strip())
        if not nome:
            return JsonResponse({
                "erro":
                "O nome é obrigatório"
            },
            status=400
        )
        request.user.first_name = nome
        request.user.save(update_fields=["first_name"])

        return JsonResponse({
            "message":
                "Perfil atualizado com sucesso",
            "user":{
                "id":
                request.user.id,
                "nome":
                request.user.first_name,
                "email":
                request.user.email,
            }
        })

    if request.method == "DELETE":
        # Exclusão de conta exige confirmação de senha por segurança
        password = dados.get("password")
        if not password:
            return JsonResponse({
                "erro":
                "Digite sua senha para excluir conta"
            },
            status=400
        )
        if not request.user.check_password(password):
            return JsonResponse({
                "erro":
                "Senha incorreta"
            },
            status=401
        )
        usuario = request.user
        try:
            # transaction.atomic garante que tudo seja excluído junto, ou nada é excluído (rollback em caso de erro)
            with transaction.atomic():
                Item.objects.filter(usuario=usuario).delete()
                Categoria.objects.filter(usuario=usuario).delete()
                usuario.delete()
            logout(request) # encerra a sessão após excluir
            return JsonResponse({
                "message":
                "Conta excluída com sucesso"
            })

        except ProtectedError:
            # Caso existam registros protegidos (FK com on_delete=PROTECT) impedindo a exclusão
            return JsonResponse(
                {
                    "erro":
                        "Não foi possível excluir a conta porque existem dados protegidos vinculados a ela."
                },
                status=409
            )
    
        except Exception as erro:
            print(
                "Erro ao excluir conta:",
                erro
            )

            return JsonResponse(
                {
                    "erro":
                        "Não foi possível excluir a conta."
                },
                status=500
            )

# Endpoint de logout: encerra a sessão do usuário
@require_POST
def logout_view(request):
    logout(request)

    return JsonResponse({
        "message": "Logout Realizado com sucesso"
    })

# Endpoint de cadastro de novo usuário
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

        # Impede cadastro duplicado com o mesmo e-mail
        if User.objects.filter(email__iexact=email).exists():
            return JsonResponse(
                {"erro": "Este e-mail já está cadastrado"},
                status=400
            )

        # Cria o usuário usando o e-mail como username também
        usuario = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=nome
        )

        # Já deixa o usuário autenticado após cadastro
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


# CRUD
class CategoriaViewSet(viewsets.ModelViewSet):
    #ViewSet que gera automaticamente as rotas de list, create, retrieve,
    #update e destroy para o model Categoria.
    serializer_class = CategoriaSerializer

    #somente usuários autenticados podem acessar categorias
    permission_classes = [IsAuthenticated]

    #segurança para usuáro só acessar as categorias que pertencem a ele
    def get_queryset(self):
        return Categoria.objects.filter(
            usuario=self.request.user
        )

    #o usuário proprietário vem do Backend, não do Frontend
    def perform_create(self, serializer):
        serializer.save(
            usuario=self.request.user
        )

    # Sobrescreve o delete para tratar erro quando a categoria tem itens vinculados
    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response({
                "erro": "Não é possível excluir uma categoria que possui produtos."
            },
            status=status.HTTP_409_CONFLICT
        )


class ItemViewSet(viewsets.ModelViewSet):
    #ViewSet do model Item, com ações extras de incrementar/decrementar estoque
    #e recálculo automático de previsão de fim de estoque.
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]

    #Usuário nunca recebe ítens de outros usuários
    def get_queryset(self):
        return (
            Item.objects.filter(usuario=self.request.user).select_related("categoria")
        )

    #Define o usuário autenticado como proprietário
    def perform_create(self, serializer):
        item = serializer.save(
            usuario=self.request.user
        )
        dias_totais = (
            item.quantidade_total * item.tempo_duracao_unidade
        )
        item.previsao_fim_estoque = (
            timezone.now() + timedelta(
                days=dias_totais
            )
        )
        item.save(
            update_fields=[
                "previsao_fim_estoque"
            ]
        )

    # Ação customizada: POST /itens/{id}/incrementar/
    # Aumenta a quantidade em estoque em 1 unidade
    @action(
        detail=True,
        methods=["post"]
    )

    #Trava para não acontecerem duas requisições simultâneas e acrescenta a quantidade em estoque
    def incrementar(self, request, pk=None):
        with transaction.atomic():
            item = get_object_or_404(
                Item.objects.select_for_update().filter(
                    usuario=request.user
                ),
                pk=pk
            )
            item.quantidade_total += 1
            recalcular_duracao(item)
            
            item.save(
                update_fields=[
                    "quantidade_total",
                    "previsao_fim_estoque",
                    "atualizado_em"
                ]
            )
        return Response(
            self.get_serializer(item).data
        )
    
    @action(
        detail=True,
        methods=["post"]
    )

    #Diminui na quantidade em estoque e nunca permite estoque menor que 0
    def decrementar(self, request, pk=None):
        with transaction.atomic():
            item = get_object_or_404(
                Item.objects.select_for_update().filter(
                    usuario=request.user
                ),
                pk=pk
            )
            if item.quantidade_total <= 0:
                return Response({
                    "erro":
                    "A quantidade de produtos já está zerada, não é permitido diminuir mais"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
            item.quantidade_total -= 1
            recalcular_duracao(item)

            item.save(update_fields=[
                "quantidade_total",
                "previsao_fim_estoque",
                "atualizado_em"
            ])
        return Response(
            self.get_serializer(item).data
        )

    # Sobrescreve o update padrão do DRF para recalcular a previsão de estoque
    # sempre que a quantidade ou a duração da unidade mudarem
    def perform_update(self, serializer):
        item_antigo = self.get_object()
        quantidade_antiga = item_antigo.quantidade_total
        duracao_antiga = item_antigo.tempo_duracao_unidade

        item = serializer.save()

        if(
            quantidade_antiga
            != item.quantidade_total
            or
            duracao_antiga
            != item.tempo_duracao_unidade
        ):
            recalcular_duracao(item)
            item.save(
                update_fields=[
                    "previsao_fim_estoque",
                    "atualizado_em"
                ]
            )

class DashboardView(APIView):
    #Só usuário autenticado pode consultar o dashboard
    permission_classes = [IsAuthenticated]
    def get(self, request):
        itens = Item.objects.filter(usuario=request.user)

        #Calcular dados monetários
        money_field = DecimalField(max_digits=18, decimal_places=2)

        #Calcular vquantidade atual x valor unitário
        valor_estoque_item = ExpressionWrapper(F("quantidade_total") * F("valor_unitario"), output_field=money_field)

        #Calcula o valor que precisa repor no estoque
        quantidade_repor = Case(
            When(
                quantidade_total__lt=F("quantidade_minima"),
                then=(
                    F("quantidade_minima") -
                    F("quantidade_total")
                )
            ),
            default=Value(0),
            output_field=IntegerField()
        )

        # Anota cada item com a quantidade a repor e o valor necessário para reposição
        itens_calculados = (
            itens.annotate(
                quantidade_repor=quantidade_repor
                ).annotate(
                    valor_repor_item=ExpressionWrapper(
                        F("quantidade_repor") *
                        F("valor_unitario"),
                        output_field=money_field
                    )
            )
        )

        #Calcular Totais gerais
        totais = itens_calculados.aggregate(
            total_unidades=Coalesce(
                Sum("quantidade_total"),
                Value(0)
            ),
            valor_estoque=Coalesce(
                Sum(valor_estoque_item),
                Value(Decimal("0.00")),
                output_field=money_field
            ),
            valor_repor=Coalesce(
                Sum("valor_repor_item"),
                Value(Decimal("0.00")),
                output_field=money_field
            ),
        )

        #Calcular quantidade de itens por categoria
        categorias = list(
            itens.values(
                "categoria_id",
                "categoria__nome"
            ).annotate(
                quantidade=Coalesce(
                    Sum("quantidade_total"),
                    Value(0)
                )
            ).order_by("categoria__nome")
        )

        # Filtra itens cujo estoque está igual ou abaixo do mínimo definido
        baixo_estoque_queryset = itens.filter(
            quantidade_total__lte=F(
                "quantidade_minima",
            )
        )
        baixo_estoque_total = (
            baixo_estoque_queryset.count()
        )

        # Pega os 10 itens mais críticos (menor quantidade primeiro)
        baixo_estoque_queryset = (
            baixo_estoque_queryset.order_by(
                "quantidade_total",
                "nome"
            )[:10]
        )

        # Monta a lista simplificada para o frontend
        baixo_estoque = [
            {
                "id": item.id,
                "nome": item.nome,
                "quantidade_total": item.quantidade_total,
                "quantidade_minima": item.quantidade_minima,
                "duracao_restante": item.duracao_restante,
            }
            for item in baixo_estoque_queryset
        ]

        return Response({
            # Quantidade de produtos cadastrados.
            "total_produtos": itens.count(),

            # Quantidade física total.
            "total_unidades":
                totais["total_unidades"],

            "valor_estoque":
                str(totais["valor_estoque"]),

            "valor_repor":
                str(totais["valor_repor"]),

            "categorias": categorias,

            "baixo_estoque": baixo_estoque,

            "baixo_estoque_total": baixo_estoque_total
        })

# Endpoint para upload/atualização da foto de perfil do usuário
@require_POST
def foto_perfil_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({
            "erro":
            "Usuário não autenticado"
        },
        status=401
    )

    foto = request.FILES.get("foto")
    if not foto:
        return JsonResponse({
            "erro":
            "Nenhuma imagem foi enviada"
        },
        status=400
    )
    # Limite de tamanho: 5 MB
    tamanho_maximo = 5 * 1024 * 1024

    if foto.size > tamanho_maximo:
        return JsonResponse({
            "erro":
            "A imagem deve ter no máximo 5 MB"
        },
        status=400
    )
    # Só aceita esses formatos de imagem
    tipos_permitidos = [
         "image/jpeg",
         "image/png",
         "image/webp",
    ]

    if foto.content_type not in tipos_permitidos:
        return JsonResponse({
            "erro":
            "Formato não permitido. Use JPG, PNG ou WEBP"
        },
        status=400
    )

    perfil, criado = Perfil.objects.get_or_create(usuario=request.user)
    # Remove a foto antiga do storage antes de salvar a nova (evita lixo acumulado)
    if perfil.foto:
        perfil.foto.delete(save=False)

    perfil.foto = foto
    perfil.save(update_fields=[
        "foto",
        "atualizado_em"
    ])

    foto_url = request.build_absolute_uri(perfil.foto.url)
    return JsonResponse({
            "message":
            "Foto atualizada com sucesso",

            "foto":
            foto_url
        }
    )

# FUNÇÃO AUXILIAR
# Recalcula a data prevista de término do estoque (previsao_fim_estoque)
# com base na quantidade atual e no tempo de duração de cada unidade.
# Usada em incrementar, decrementar e perform_update.
def recalcular_duracao(item):

    if item.quantidade_total <= 0:
        # Estoque zerado: a previsão de fim é agora
        item.previsao_fim_estoque = (timezone.now())
    else:
        dias = (
            item.quantidade_total
            *
            item.tempo_duracao_unidade
        )
        item.previsao_fim_estoque = (
            timezone.now()
            +
            timedelta(days=dias)
        )