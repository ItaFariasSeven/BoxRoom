import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro'
import NavBar from './components/NavBar/NavBar';
import Dashboard from './pages/Home/Dashboard';
import Produtos from './pages/Home/Produtos';
import RecuperarSenha from './pages/Cadastro/RecuperarSenha';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute/PrivateRoute';
import { ViewModeProvider } from './contexts/ViewModeContext'; 

function App() {

  const location = useLocation();
  const mostrarNavBar = 
    location.pathname !== "/login" &&
    location.pathname !== "/cadastro" &&
    location.pathname !== "/recuperarsenha" ;

  return(
    <>
      <ViewModeProvider>
        {mostrarNavBar && <NavBar />}
          <Routes>
            <Route path="/login" element={
              // <PrivateRoute>
              <Login />
              // {/* </PrivateRoute> */}
            }/>

            <Route path="/cadastro" element={
              // <PrivateRoute>
              <Cadastro />
              // </PrivateRoute>
            }/>

            <Route path="/recuperarsenha" element={
              // <PrivateRoute>
              <RecuperarSenha />
              // </PrivateRoute>
            }/>

            <Route path="/" element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }/>

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }/>

            <Route path="/produtos" element={
              <PrivateRoute>
                <Produtos />
              </PrivateRoute>
            }/>
          </Routes>
      </ViewModeProvider>
    </>
  )
}

export default App;