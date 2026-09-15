from django.urls import path
from rest_framework.routers import DefaultRouter

from .views import ( ItemViewSet, CategoriaViewSet, DashboardView)

router = DefaultRouter()
router.register(
    "itens",
    ItemViewSet,
    basename="item"
)
router.register(
    "categorias",
    CategoriaViewSet,
    basename="categoria"
)

urlpatterns = [
    path(
        "dashboard/",
        DashboardView.as_view(),
        name="dashboard"
    ),
]

urlpatterns += router.urls