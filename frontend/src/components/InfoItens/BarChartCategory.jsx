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
        const cores = ['#a855f7', '#c084fc', '#22d3ee', '#38bdf8', '#818cf8'];

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