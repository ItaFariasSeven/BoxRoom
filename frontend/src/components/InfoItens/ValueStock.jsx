import './ValueStockModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function ValueStock() {


  return (
    <div className='container-value-itens'>
        <div className='container-valor-estoque'>
          <h2 className='text-value-stock text-value-stock-height'>Valor do estoque</h2>
        </div>

        <div className='container-valor-repor'>
          <h2 className='text-value-stock text-value-stock-height'>Valor para repor</h2>
        </div>

        <div>
          <h3 className='text-value-stock text-value-stock-height-rs'>R$</h3>
          <h2 className='text-value-repor'>15,00</h2>
        </div>

        <div>
          <h3 className='text-value-stock text-value-stock-height-rs'>R$</h3>
          <h2 className='text-value-repor'>15,00</h2>
        </div>

    </div>

  );
}