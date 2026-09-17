from .models import Item, Categoria
from rest_framework import serializers


class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = [
            "id",
            "nome",
            "descricao",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "criado_em",
            "atualizado_em",
        ]

class ItemSerializer(serializers.ModelSerializer):
    categoria_nome = serializers.CharField(
        source="categoria.nome",
        read_only=True
    )

    duracao_restante = serializers.SerializerMethodField()

    class Meta:
        model = Item
        fields = [
            "id",
            "nome",
            "categoria",
            "categoria_nome",
            "valor_unitario",
            "link_compra",
            "quantidade_total",
            "quantidade_minima",
            "tempo_duracao_unidade",
            "duracao_restante",
            "foto",
            "criado_em",
            "atualizado_em",
        ]
        read_only_fields = [
            "id",
            "categoria_nome",
            "duracao_restante",
            "criado_em",
            "atualizado_em",
        ]

    def get_duracao_restante(self, item):
        return item.duracao_restante

    def validate_categoria(self, categoria):
        request = self.context.get("request")
        if (
            request is None 
            or not request.user.is_authenticated
            or categoria.usuario_id != request.user.id
        ):
            raise serializers.ValidationError(
                "Categoria Inválida"
            )
        return categoria

