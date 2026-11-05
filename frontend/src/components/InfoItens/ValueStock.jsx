// ValueStock.jsx
import React from 'react';
import './ValueStockModule.css';

export default function ValueStock({ dashboard }) {
    const formatarValor = (valor) => {
        return new Intl.NumberFormat("pt-BR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(Number(valor || 0));
    };

    return (
        <div className="valuestock-container">
            <div className="valuestock-card">
                <div className="valuestock-header blue-header">
                    Valor em estoque
                </div>
                <div className="valuestock-body">
                    R$ {formatarValor(dashboard?.valor_estoque)}
                </div>
            </div>

            <div className="valuestock-card">
                <div className="valuestock-header red-header">
                    Valor para repor estoque
                </div>
                <div className="valuestock-body">
                    R$ {formatarValor(dashboard?.valor_repor)}
                </div>
            </div>
        </div>
    );
}