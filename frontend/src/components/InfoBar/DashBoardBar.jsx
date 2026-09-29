import './DashBoardBarModule.css'
import SetaImage from '../../assets/InfoBar/seta-para-baixo.png'

export default function DashBoardBar() {
    return(
        <div className="container-dashboard">
            <img className='seta-image-dashboard-esquerda'
              src={SetaImage}
              alt="Imagem de Seta"
            />
            <h1 className="title-dashboard">Dashboard de Estoque</h1>
            <img className='seta-image-dashboard-direita'
              src={SetaImage}
              alt="Imagem de Seta"
            />
        </div>
    )
}