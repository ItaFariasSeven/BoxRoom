import './LowItensModule.css';

// Componente que exibe a lista de itens com estoque baixo (usado no dashboard)
export default function LowItens({dashboard}) {
  // Extrai a lista de itens em baixo estoque vinda do dashboard;
  // usa array vazio como fallback caso dashboard ainda não tenha carregado
  const itens = dashboard?.baixo_estoque || [];

    
  return (
    <div className='container-low-itens'>
        {/* Cabeçalho com o total de itens em baixo estoque */}
        <div className='cabecalho'>
          <div className='number-low'>{dashboard?.baixo_estoque_total ?? 0}</div>
          <div className='title-low'>Itens em baixo estoque</div>
        </div>

        {/* Lista ordenada com cada item em baixo estoque */}
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