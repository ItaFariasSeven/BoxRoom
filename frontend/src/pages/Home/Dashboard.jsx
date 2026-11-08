import React from 'react';
import TotalItens from '../../components/InfoItens/TotalItens';
import ValueStock from '../../components/InfoItens/ValueStock';
import LowItens from '../../components/InfoItens/LowItens';
import BarChartProduct from '../../components/InfoItens/BarChartProduct';
import './DashboardModule.css';

import { useQuery } from "@tanstack/react-query";
import { buscarDashboard, listarItens } from "../../services/api";

export default function Dashboard() {

    const {
        data: dashboard,
        isLoading: loadingDash,
        error: errorDash
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: buscarDashboard
    });

    const {
        data: itens = [], 
        isLoading: loadingItens,
        error: errorItens
    } = useQuery({
        queryKey: ["itens_grafico"],
        queryFn: listarItens
    });

    if (loadingDash || loadingItens) {
        return <h2 style={{ color: '#1e40af', padding: '20px' }}>Carregando dados do Dashboard...</h2>;
    }

    // Tela de erro caso o Django falhe
    if (errorDash || errorItens) {
        return <h2 style={{ color: '#ef4444', padding: '20px' }}>Erro ao carregar informações.</h2>;
    }

    const listaDeItens = itens.results || itens;

    return (
        <div className="dashboard-layout">
            
            {/* Linha superior (Top) */}
            <div className="dash-top-left">
                <TotalItens dashboard={dashboard} />
            </div>
            
            <div className="dash-top-mid">
                <ValueStock dashboard={dashboard} />
            </div>
            
            {/* Coluna Lateral Direita (Ocupa 2 linhas) */}
            <div className="dash-right">
                <LowItens dashboard={dashboard} />
            </div>

            {/* Linha inferior (Gráfico) Ocupa espaço das duas colunas da esquerda */}
            <div className="dash-bottom">
                <BarChartProduct itens={listaDeItens} />
            </div>

        </div>
    );
}