import './LowItensModule.css';

export default function LowItens({dashboard}) {
  const itens = dashboard?.baixo_estoque || [];

    
  return (
    <div className='container-low-itens'>
        <div className='cabecalho'>
          <div className='number-low'>{dashboard?.baixo_estoque_total ?? 0}</div>
          <div className='title-low'>Itens em baixo estoque</div>
        </div>

        <div>
          <ol>
            
            {itens.map((item) =>(
              <li key={item.id}>
                <div className='container-list-low-itens'>
                  <p>{item.nome}</p>

                  <p>{item.duracao_restante}{" "}dias</p>
                </div>
              </li>
            ))}
            
          </ol>

        </div>

    </div>

  );
}