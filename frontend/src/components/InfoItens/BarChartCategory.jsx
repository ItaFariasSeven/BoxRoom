// BarChartCategory.jsx
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import './BarChartCategoryModule.css';

export default function BarChartCategory({ dashboard }) {
    const chartRef = useRef(null);

    
useEffect(() => {
    if (!chartRef.current) return;

    const container = chartRef.current.closest('.barchart-container');
    const canvas = chartRef.current;

    const categorias = dashboard?.categorias || [];
    const labels = categorias.map(c => c.categoria__nome || 'Categoria');
    const valores = categorias.map(c => c.quantidade || 0);

    const cores = [
        '#a855f7', '#c084fc', '#22d3ee', '#38bdf8',
        '#818cf8', '#34d399', '#4ade80', '#a3e635',
        '#facc15', '#fbbf24', '#fb923c', '#f87171',
        '#fb7185', '#f472b6', '#e879f9', '#d946ef',
        '#8b5cf6', '#60a5fa', '#0ea5e9', '#2dd4bf'
    ];

    let chart = null;
    let ultimaCorTexto = null;

    const desenharGrafico = () => {

        // Recupera a variável CSS do tema atual
        const estilos = getComputedStyle(container);

        const corTexto =
            estilos.getPropertyValue('--textGlobal').trim()
            || estilos.color
            || '#000000';

        console.log('Cor da variável --textGlobal:', corTexto);

        // Só recria o gráfico quando a cor realmente mudar
        if (chart && corTexto === ultimaCorTexto) return;

        ultimaCorTexto = corTexto;

        // Destrói a instância anterior
        if (chart) {
            chart.destroy();
        }

        // Cria o gráfico com a cor atual
        chart = new Chart(canvas, {
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
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            color: 'rgba(128, 128, 128, 0.15)'
                        },
                        ticks: {
                            color: corTexto
                        },
                        title: {
                            display: true,
                            text: 'Quantidade',
                            color: corTexto
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        },
                        ticks: {
                            color: corTexto
                        },
                        title: {
                            display: true,
                            text: 'Categoria',
                            color: corTexto
                        }
                    }
                }
            }
        });
    };

    // Desenha inicialmente
    desenharGrafico();

    // Observa alterações nas classes e estilos do documento
    const observador = new MutationObserver(() => {
        desenharGrafico();
    });

    observador.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style', 'data-theme'],
        subtree: true
    });

    return () => {
        observador.disconnect();

        if (chart) {
            chart.destroy();
        }
    };

}, [dashboard]);


    return (
        <div className="barchart-container">
            <div className="barchart-header">
                <span className="barchart-title">Ítens por categoria</span>
                {/* <div className="barchart-dropdown">
                    <span>Estoque</span>
                    <span className="arrow-down">▼</span>
                </div> */}
            </div>
            
            <div className="canvas-wrapper">
                <canvas ref={chartRef} />
            </div>
        </div>
    );
}