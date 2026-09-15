import CardItem from "../../components/CardItem/CardItem"
import TotalItens from "../../components/InfoItens/TotalItens"
import LowItens from "../../components/InfoItens/LowItens"
import ValueStock from "../../components/InfoItens/ValueStock"
import './HomeModule.css'

import { useQuery } from "@tanstack/react-query";

import { listarItens, buscarDashboard } from "../../services/api";

export default function Home() {

    // Buscar produtos
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

    return (
        <main>
            <div className="detail-itens">
                <TotalItens dashboard={dashboard}/>
                <LowItens dashboard={dashboard}/>
                <ValueStock dashboard={dashboard}/>
            </div>
            <div className="cards-itens">
                {itens.map((item) =>(
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