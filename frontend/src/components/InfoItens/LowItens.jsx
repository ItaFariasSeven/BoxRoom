import './LowItensModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function LowItens() {


  return (
    <div className='container-low-itens'>
        <div className='cabecalho'>
          <div className='number-low'>3</div>
          <div className='title-low'>Itens em baixo estoque</div>
        </div>

        <div>
          <ol>
            
            <li>
              <div className='container-list-low-itens'>
                <p>Nome</p>
                <p>Duração Restante</p>
              </div>
            </li>
            
            <li>
              <div className='container-list-low-itens'>
                <p>Nome</p>
                <p>Duração Restante</p>
              </div>
            </li>
            
            <li>
              <div className='container-list-low-itens'>
                <p>Nome</p>
                <p>Duração Restante</p>
              </div>
            </li>
            
          </ol>

        </div>

    </div>

  );
}