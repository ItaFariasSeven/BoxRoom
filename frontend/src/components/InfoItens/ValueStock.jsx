import './ValueStockModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function ValueStock() {


  return (
    <div className='container-low-itens'>
        <div>Valor do estoque</div>
        <div>Valor para repor</div>
        <div>R$</div>

    </div>

  );
}