from django.db import models
from decimal import Decimal
from django.conf import settings
from django.core.validators import MinValueValidator

# Create your models here.

class Categoria(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="categorias", null=True, blank=True)
    nome = models.CharField(max_length=50)
    descricao = models.TextField(max_length=500, blank=True)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em =models.DateTimeField(auto_now=True)

# Evita que um usuário crie duas categorias iguais
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["usuario", "nome"],
                name="categoria_nome_unico_por_usuario"
            )
        ]
    ordering = ["nome"]

    def __str__(self):
        return self.nome



class Item(models.Model):
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="itens", null=True, blank=True)
    categoria = models.ForeignKey(Categoria, on_delete=models.PROTECT, related_name="itens", null=True, blank=True)
    nome = models.CharField(max_length=100)
    link_compra = models.TextField(max_length=500, blank=True)
    foto = models.ImageField(upload_to='itens/', blank=True, null=True)
    quantidade_total = models.PositiveIntegerField(default=0)
    quantidade_minima = models.PositiveIntegerField(default=0)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal("0.00"))])
    tempo_duracao_unidade = models.PositiveIntegerField(default=0)
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["nome"]

    def __str__(self):
        return f"{self.nome}, {self.quantidade_total} unidade"

    