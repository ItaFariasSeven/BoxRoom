// TotalItens.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './TotalItensModule.css';

export default function TotalItens({ dashboard }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const categorias = dashboard?.categorias || [];
        const labels = categorias.map(c => c.categoria__nome || 'Sem Categoria');
        const valores = categorias.map(c => c.quantidade || 0);

        // Paleta de cores dinâmica mantendo o padrão do seu código
        const cores = categorias.length > 0 
            ? categorias.map((_, index) => `hsl(${(index * 67) % 360}, 75%, 60%)`)
            : ['#ef4444', '#f97316', '#eab308', '#06b6d4'];

        const chart = new Chart(chartRef.current, {
            type: 'doughnut',
            data: {
                labels,
                datasets: [{
                    label: 'Itens por categoria',
                    data: valores,
                    backgroundColor: cores,
                    borderWidth: 0,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'right',
                        labels: {
                            color: '#ffffff',
                            font: { size: 11, family: 'Inter' },
                            boxWidth: 12
                        }
                    }
                },
                cutout: '65%'
            }
        });

        return () => chart.destroy();
    }, [dashboard]);

    return (
        <div className="container-total-itens">
            <div className="text-total-itens">
                <span>Total de Ítens:</span>
                <h2>{dashboard?.total_unidades ?? 0}</h2>
            </div>

            <div className="grafic-category">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
}