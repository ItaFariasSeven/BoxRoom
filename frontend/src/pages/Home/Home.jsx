import CardItem from "../../components/CardItem/CardItem"
import TotalItens from "../../components/InfoItens/TotalItens"
import LowItens from "../../components/InfoItens/LowItens"
import ValueStock from "../../components/InfoItens/ValueStock"
import './HomeModule.css'

export default function Home() {
    return (
        <main>
            <div className="detail-itens">
                <TotalItens />
                <LowItens />
                <ValueStock />
            </div>
            <div className="cards-itens">
                <div>
                    <CardItem />
                </div>
                <div>
                    <CardItem />
                </div>
            </div>
        </main>
    )
}