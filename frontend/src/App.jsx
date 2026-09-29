import React from 'react';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Cadastro from './pages/Cadastro/Cadastro'
import NavBar from './components/NavBar/NavBar';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import PrivateRoute from './PrivateRoute/PrivateRoute';

function App() {

  const location = useLocation();
  const mostrarNavBar = 
    location.pathname !== "/login" &&
    location.pathname !== "/cadastro" ;

  return(
    <>
    {mostrarNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        }/>

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
      </Routes>
    </>
  )
}

export default App;