// Produtos.jsx
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { buscarDashboard } from '../../services/api';
import ValueStock from '../../components/InfoItens/ValueStock';
import LowItens from '../../components/InfoItens/LowItens';
import MaryPoppinsIA from '../../components/InfoItens/MaryPoppinsIA'; // Ajuste o caminho se necessário
import './ProdutosModule.css';

export default function Produtos() {
    // Busca os dados da API exatamente como no Dashboard
    const {
        data: dashboard,
        isLoading,
        error
    } = useQuery({
        queryKey: ["dashboard"],
        queryFn: buscarDashboard
    });

    if (isLoading) {
        return <h2 style={{ color: '#1e40af', padding: '20px' }}>Carregando dados...</h2>;
    }

    if (error) {
        return <h2 style={{ color: '#ef4444', padding: '20px' }}>Erro ao carregar informações.</h2>;
    }

    return (
        <div className="produtos-layout">
            
            {/* Coluna Esquerda: Reutilizando os componentes antigos */}
            <div className="produtos-col-esquerda">
                <div className="produtos-valuestock-wrapper">
                    <ValueStock dashboard={dashboard} />
                </div>
                
                <div className="produtos-lowitens-wrapper">
                    <LowItens dashboard={dashboard} />
                </div>
            </div>

            {/* Coluna Direita: Novo componente IA */}
            <div className="produtos-col-direita">
                <MaryPoppinsIA />
            </div>

        </div>
    );
}