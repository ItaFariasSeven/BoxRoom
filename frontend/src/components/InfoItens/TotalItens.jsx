import './TotalItensModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function TotalItens({dashboard}) {

    const chartRef = useRef(null);

    useEffect(() => {
      if(!chartRef.current){
        return;
      }
      const categorias = dashboard?.categorias || []
      const labels = categorias.map(categoria => categoria.categoria__nome);
      const valores = categorias.map(categoria => categoria.quantidade);

      // Cor para categorias
      const cores = categorias.map((_, index) => `hsl(${(index * 67) % 360}, 70%, 60%)`);

      const chart = new Chart(
        chartRef.current,{
          type: "doughnut",
          data: {
            labels,
            datasets: [{
              label: "Itens por categoria",
              data: valores,
              backgroundColor: cores,
              hoverOffset: 4
            }]
          }
        }
      );
      return () => {
        chart.destroy();
      };
    },[dashboard]);

  return (
    <div className='container-total-itens'>
        <div className='text-total-itens'>
            <h2>Total de Ítens: {" "} {dashboard?.total_unidades ?? 0}</h2>
        </div>

        <div className='grafic-category'>
            <canvas 
              ref={chartRef}
            />
        </div>

    </div>

  );
}