import React from 'react';
import NavBar from './components/NavBar/NavBar';
import CardItem from './components/CardItem/CardItem';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return(
    <BrowserRouter>

      <NavBar />
      
      <CardItem/>
      

    {/* Rotas das páginas 'Aqui ficam todas as rotas do sistema'
        como se fosse um painel de controle */}
    {/* <Routes>
          <Route path="/" element={<CardItem />} />
          <Route path="/cadastrar" element={<CadastroProduto />} />
        </Routes> */}

    {/* <Link to="/cadastrar">Cadastrar Novo Produto</Link> */}

    </BrowserRouter>
  )
}

export default App;