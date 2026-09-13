import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro'
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';

function App() {

  const location = useLocation();
  const mostrarNavBar = 
    location.pathname !== "/login" &&
    location.pathname !== "/cadastro" ;

  return(
    <>
    {mostrarNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<Home />}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/cadastro" element={<Cadastro />}/>
      </Routes>
    </>
  )
}

export default App;