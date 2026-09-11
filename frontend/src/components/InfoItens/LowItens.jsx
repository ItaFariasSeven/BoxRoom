import './LowItensModule.css';
import  Chart  from 'chart.js/auto';
import { useEffect, useRef } from 'react';

export default function LowItens() {


  return (
    <div className='container-low-itens'>
        <div className='cabecalho'>
          <div className='number-low'>5</div>
          <div className='title-low'>Itens em baixo estoque</div>
        </div>

        <div>Informações</div>

    </div>

  );
}