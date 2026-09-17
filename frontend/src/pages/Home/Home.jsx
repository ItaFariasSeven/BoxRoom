import CardItem from "../../components/CardItem/CardItem"
import TotalItens from "../../components/InfoItens/TotalItens"
import LowItens from "../../components/InfoItens/LowItens"
import ValueStock from "../../components/InfoItens/ValueStock"
import './HomeModule.css'

import { useQuery } from "@tanstack/react-query";

import { listarItens, buscarDashboard } from "../../services/api";

import { useSearchParams } from "react-router-dom";

export default function Home() {
    const [searchParams] = useSearchParams();

    // Buscar produtos para carregar na tela
    const {
        data: itens = [],
        isLoading: carregandoItens,
        error: erroItens
    } = useQuery({
        queryKey: ["itens"],
        queryFn: listarItens
    });

    //  Buscar informações do dashboard
    const {
        data: dashboard,
        isLoading: carregandoDashboard,
        error: erroDashboard
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: buscarDashboard
    });

    if (
        carregandoItens ||carregandoDashboard
    ) {
        return <p>Carregando estoque...</p>;
    }

    if (
        erroItens || erroDashboard
    ) {
        return (
            <p>Não foi possível carregar o estoque.</p>
        );
    }
    
    // Pega o que a NavBar colocou na URL.
    const termoBusca = (
        searchParams.get("busca") ?? ""
    )
        .trim()
        .toLowerCase();
    // Cria outra lista. Não altera a lista original do React Query.
    const itensFiltrados = itens.filter(
        (item) => {
    
            // Pesquisar pelo nome.
            const nome =
                item.nome
                    ?.toLowerCase()
                    ?? "";
    
            // Pesquisar pela categoria.
            const categoria =
                item.categoria_nome
                    ?.toLowerCase()
                    ?? "";
    
            return (
                nome.includes(termoBusca)
                ||
                categoria.includes(termoBusca)
            );
        }
    );

    return (
        <main>
            <div className="detail-itens">
                <TotalItens dashboard={dashboard}/>
                <LowItens dashboard={dashboard}/>
                <ValueStock dashboard={dashboard}/>
            </div>
            <div className="cards-itens">
                {itensFiltrados.map((item) =>(
                <div key={item.id}>
                    <CardItem
                        item={item}
                    />
                </div>
                ))}
            </div>
        </main>
    )
}