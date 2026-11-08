// BarChartProduct.jsx
import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';
import './BarChartProductModule.css';

export default function BarChartProduct({ itens = [] }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

    // 1. Extrai as categorias únicas baseadas no campo "categoria_nome" do seu ItemSerializer
    const categoriasUnicas = [
        'Todas',
        ...new Set(itens.map(item => item.categoria_nome || 'Sem Categoria'))
    ];

    // 2. Filtra os itens com base na categoria selecionada
    const itensFiltrados = categoriaSelecionada === 'Todas'
        ? itens
        : itens.filter(item => (item.categoria_nome || 'Sem Categoria') === categoriaSelecionada);

    // 3. Puxa os dados reais do seu Model "Item" (nome e quantidade_total)
    const labels = itensFiltrados.map(item => item.nome || 'Produto');
    const valores = itensFiltrados.map(item => item.quantidade_total || 0);

    const cores = [
        '#a855f7', '#c084fc', '#22d3ee', '#38bdf8',
        '#818cf8', '#34d399', '#4ade80', '#a3e635',
        '#facc15', '#fbbf24', '#fb923c', '#f87171',
        '#fb7185', '#f472b6', '#e879f9', '#d946ef',
        '#8b5cf6', '#60a5fa', '#0ea5e9', '#2dd4bf'
    ];

    useEffect(() => {
        if (!chartRef.current) return;

        const container = chartRef.current.closest('.barchart-container');
        const canvas = chartRef.current;
        let ultimaCorTexto = null;

        // Função responsável por desenhar/redesenhar o gráfico capturando a cor do tema
        const desenharGrafico = () => {
            const estilos = getComputedStyle(container);
            const corTexto = estilos.getPropertyValue('--textGlobal').trim() || estilos.color || '#000000';

            // Evita recriar o gráfico se a cor e os dados não mudaram (otimização)
            if (chartInstance.current && corTexto === ultimaCorTexto) {
                // Apenas atualiza os dados se a cor for a mesma, mas o filtro mudou
                chartInstance.current.data.labels = labels;
                chartInstance.current.data.datasets[0].data = valores;
                chartInstance.current.update();
                return;
            }

            ultimaCorTexto = corTexto;

            if (chartInstance.current) {
                chartInstance.current.destroy();
            }

            chartInstance.current = new Chart(canvas, {
                type: 'bar',
                data: {
                    labels,
                    datasets: [{
                        label: 'Quantidade em Estoque',
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
                            grid: { color: 'rgba(128, 128, 128, 0.15)' },
                            ticks: { color: corTexto, stepSize: 1 },
                            title: { display: true, text: 'Quantidade', color: corTexto }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { color: corTexto },
                            title: { display: true, text: 'Produtos', color: corTexto }
                        }
                    }
                }
            });
        };

        // Desenha a primeira vez
        desenharGrafico();

        // Mantém a sua lógica do MutationObserver para o Tema Claro/Escuro
        const observador = new MutationObserver(() => {
            // Força a recriação forçando a variável ultimaCorTexto a null
            ultimaCorTexto = null; 
            desenharGrafico();
        });

        observador.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class', 'style', 'data-theme'],
            subtree: true
        });

        return () => {
            observador.disconnect();
            if (chartInstance.current) {
                chartInstance.current.destroy();
                chartInstance.current = null;
            }
        };
    }, [itensFiltrados.length, categoriaSelecionada]); // Recalcula se o filtro mudar

    // Largura dinâmica: garante o scroll horizontal se tiver muitos produtos
    const larguraDinamica = Math.max(labels.length * 60, 500);

    return (
        <div className="barchart-container">
            <div className="barchart-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span className="barchart-title">Itens por Produto</span>
                
                <select 
                    value={categoriaSelecionada} 
                    onChange={(e) => setCategoriaSelecionada(e.target.value)}
                    style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: 'transparent',
                        color: 'inherit', // Herda a cor do tema dinamicamente
                        border: '1px solid rgba(128,128,128,0.3)',
                        cursor: 'pointer'
                    }}
                >
                    {categoriasUnicas.map(cat => (
                        <option key={cat} value={cat} style={{ color: '#000' }}>
                            {cat}
                        </option>
                    ))}
                </select>
            </div>
            
            <div className="canvas-wrapper" style={{ overflowX: 'auto', overflowY: 'hidden', width: '100%', height: '300px' }}>
                <div style={{ width: `${larguraDinamica}px`, height: '100%', minWidth: '100%' }}>
                    <canvas ref={chartRef} />
                </div>
            </div>
        </div>
    );
}