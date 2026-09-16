import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { buscarUsuario } from "../services/api";

export default function PrivateRoute({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        async function verificarUsuario() {
            try{
                const usuarioLogado = await buscarUsuario();
                setUsuario(usuarioLogado);
            } catch (error){
                console.error(
                    "Erro ao verificar autenticação", error
                );
                setUsuario(null);
            } finally{
                setCarregando(false);
            }
        }

        verificarUsuario();

    }, []);


    if (carregando) {
        return <p>Carregando...</p>;
    }


    if (!usuario) {
        return <Navigate to="/login" replace />;
    }


    return children;
}