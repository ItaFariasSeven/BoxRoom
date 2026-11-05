// LowItens.jsx
import React from 'react';
import './LowItensModule.css';

export default function LowItens({ dashboard }) {
    const itens = dashboard?.baixo_estoque || [];
    const totalBaixoEstoque = dashboard?.baixo_estoque_total ?? 0;

    return (
        <div className="lowitens-container">
            <div className="lowitens-header">
                <div className="lowitens-badge">{totalBaixoEstoque}</div>
                <div className="lowitens-title">Ítens em baixo estoque</div>
            </div>

            <div className="lowitens-list">
                {itens.length === 0 ? (
                    <p className="lowitens-empty">Nenhum item em baixo estoque.</p>
                ) : (
                    itens.map((item, index) => (
                        <div className="lowitens-row" key={item.id || index}>
                            <span className="item-name">{index + 1}. {item.nome}</span>
                            <span className="item-duration">duração: {item.duracao_restante} dias</span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}