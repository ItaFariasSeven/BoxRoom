from django.db import models

# Create your models here.

class Item(models.Model):
    nome = models.CharField(max_length=50)
    link_compra = models.TextField(max_length=500)
    foto = models.ImageField(upload_to='images/')
    quantidade_total = models.IntegerField(default=0)
    quantidade_minima = models.IntegerField(default=0)
    valor_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    tempo_duracao_unidade = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.nome}, {self.quantidade} unidade"

class Categoria(models.Model):
    nome = models.CharField(max_length=50)
    descricao = models.TextField(max_length=500)
    