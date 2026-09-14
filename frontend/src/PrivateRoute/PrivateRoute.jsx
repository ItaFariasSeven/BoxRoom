import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

import { buscarUsuario } from "../services/api";

export default function PrivateRoute({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {

        async function verificarUsuario() {

            const usuarioLogado = await buscarUsuario();

            setUsuario(usuarioLogado);
            setCarregando(false);
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