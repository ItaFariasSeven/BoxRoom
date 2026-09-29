import './ItensListModule.css'
import SetaImage from '../../assets/InfoBar/seta-para-baixo.png'

export default function ItensList() {
    return(
        <div className="container-list">
            <img className='seta-image-list-esquerda'
              src={SetaImage}
              alt="Imagem de Seta"
            />
            <h1 className="title-list">Ítens no Estoque</h1>
            <img className='seta-image-list-direita'
              src={SetaImage}
              alt="Imagem de Seta"
            />
        </div>
    )
}