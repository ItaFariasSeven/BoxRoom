import './TotalItensModule.css';
import  Chart  from 'chart.js/auto'; // biblioteca de gráficos
import { useEffect, useRef } from 'react';

// Componente que exibe o total de itens em estoque e um gráfico de rosca (doughnut) por categoria
export default function TotalItens({dashboard}) {
    // Referência para o elemento <canvas> onde o Chart.js vai desenhar o gráfico
    const chartRef = useRef(null);

    useEffect(() => {
      // Se o canvas ainda não foi renderizado, não faz nada
      if(!chartRef.current){
        return;
      }
      // Dados de categorias vindos do dashboard (fallback para array vazio)
      const categorias = dashboard?.categorias || []

      // Extrai os nomes das categorias (labels do gráfico)
      const labels = categorias.map(categoria => categoria.categoria__nome);

      // Extrai as quantidades de cada categoria (valores do gráfico)
      const valores = categorias.map(categoria => categoria.quantidade);

      // Cor para categorias
      const cores = categorias.map((_, index) => `hsl(${(index * 67) % 360}, 70%, 60%)`);

      // Cria o gráfico do tipo "doughnut" (rosca)
      const chart = new Chart(
        chartRef.current,{
          type: "doughnut",
          data: {
            labels,
            datasets: [{
              label: "Itens por categoria",
              data: valores,
              backgroundColor: cores,
              hoverOffset: 4 // efeito de destaque ao passar o mouse sobre uma fatia
            }]
          }
        }
      );
      // Função de limpeza: destrói o gráfico anterior antes de recriar
      // (evita memory leak e gráficos duplicados ao atualizar o dashboard)
      return () => {
        chart.destroy();
      };
    },[dashboard]); // reexecuta sempre que os dados do dashboard mudarem

  return (
    <div className='container-total-itens'>
        <div className='text-total-itens'>
            <h2>Total de Ítens:</h2>
            <h2>
              {dashboard?.total_unidades ?? 0}
            </h2>
        </div>

        {/* Canvas onde o gráfico de categorias é desenhado */}
        <div className='grafic-category'>
            <canvas 
              ref={chartRef}
            />
        </div>

    </div>

  );
}