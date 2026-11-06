// BarChartCategory.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './BarChartCategoryModule.css';

export default function BarChartCategory({ dashboard }) {
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const categorias = dashboard?.categorias || [];
        const labels = categorias.map(c => c.categoria__nome || 'Categoria');
        const valores = categorias.map(c => c.quantidade || 0);

        // Paleta de cores fiável ao Figma
        const cores = [
            '#a855f7', // 1. Roxo (Original)
            '#c084fc', // 2. Roxo Claro (Original)
            '#22d3ee', // 3. Ciano (Original)
            '#38bdf8', // 4. Azul Celeste (Original)
            '#818cf8', // 5. Índigo (Original)
            '#34d399', // 6. Esmeralda 400
            '#4ade80', // 7. Verde 400
            '#a3e635', // 8. Lima 400
            '#facc15', // 9. Amarelo 400
            '#fbbf24', // 10. Âmbar 400
            '#fb923c', // 11. Laranja 400
            '#f87171', // 12. Vermelho Suave 400
            '#fb7185', // 13. Rose 400
            '#f472b6', // 14. Pink 400
            '#e879f9', // 15. Fúcsia Claro 400
            '#d946ef', // 16. Fúcsia 500
            '#8b5cf6', // 17. Violeta 500
            '#60a5fa', // 18. Azul Clássico 400
            '#0ea5e9', // 19. Azul Céu Escuro 500
            '#2dd4bf'  // 20. Teal / Verde Água 400
        ];

        const chart = new Chart(chartRef.current, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Quantidade',
                    data: valores,
                    backgroundColor: cores,
                    borderRadius: 4,
                    barPercentage: 0.55,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255, 255, 255, 0.15)' },
                        ticks: { color: '#ffffff' },
                        title: { display: true, text: 'Quantidade', color: '#ffffff' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#ffffff' },
                        title: { display: true, text: 'Categoria', color: '#ffffff' }
                    }
                }
            }
        });

        return () => chart.destroy();
    }, [dashboard]);

    return (
        <div className="barchart-container">
            <div className="barchart-header">
                <span className="barchart-title">Ítens por categoria</span>
                <div className="barchart-dropdown">
                    <span>Estoque</span>
                    <span className="arrow-down">▼</span>
                </div>
            </div>
            
            <div className="canvas-wrapper">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
}