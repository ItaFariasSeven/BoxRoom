import './TotalItensModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function TotalItens() {

    const chartRef = useRef(null);

    useEffect(() => {
        const ItemPorCategoria = new Chart(chartRef.current, {
            type: 'doughnut',
      data: {
    //   labels: [
    //     'Red',
    //     'Blue',
    //     'Yellow'
    //   ],
      datasets: [{
        label: 'My First Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)'
        ],
        hoverOffset: 4
      }]
    }
});
    return () => {
        ItemPorCategoria.destroy();
    };
}, []);

  return (
    <div className='container-total-itens'>
        <div className='text-total-itens'>
            <h2>Total de Ítens:</h2>
        </div>

        <div className='grafic-category'>
            <canvas 
            ref={chartRef}>

            </canvas>
        </div>

    </div>

  );
}