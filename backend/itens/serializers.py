from .models import Item, Categoria
from rest_framework import serializers

# Serializer responsável por converter o model Categoria em JSON e vice-versa
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
        # Campos que o cliente não pode enviar/alterar, apenas ler
        read_only_fields = [
            "id",
            "criado_em",
            "atualizado_em",
        ]

# Serializer responsável por converter o model Item em JSON e vice-versa
class ItemSerializer(serializers.ModelSerializer):
    # Campo extra (não existe direto no model): pega o nome da categoria relacionada
    categoria_nome = serializers.CharField(
        source="categoria.nome",
        read_only=True
    )
    # Campo calculado dinamicamente (chama um método abaixo)
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

    # Método usado pelo campo SerializerMethodField "duracao_restante"
    # Retorna a propriedade calculada no model Item
    def get_duracao_restante(self, item):
        return item.duracao_restante

    # Validação customizada do campo "categoria" ao criar/editar um Item
    # Garante que o usuário só pode vincular categorias que pertencem a ele mesmo
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

