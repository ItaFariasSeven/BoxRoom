const API_URL = "http://localhost:8000";

function getCookie(name) {
    const cookies = document.cookie.split(";");

    for(let cookie of cookies){
        cookie = cookie.trim();

        if (cookie.startsWith(name + "=")){
            return decodeURIComponent(
                cookie.substring(name.length + 1)
            );
        }
    }
    return null;
}

export async function prepararCsrf() {
    await fetch(
        `${API_URL}/api/auth/csrf/`,
        {credentials: "include"}
    );
}

export async function realizarLogin(email, password) {
    await prepararCsrf();
    const csrftoken = getCookie("csrftoken");

    const response = await fetch(
        `${API_URL}/api/auth/login/`,
        {
            method: "POST",
            credentials: "include",
            headers:{
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({email, password})
        }
    );
    const dados = await response.json();
    if(!response.ok){
        throw new Error(
            dados.erro || "Erro ao realizar login"
        );
    }
    return dados;
}

export async function buscarUsuario() {
    const response = await fetch(
        `${API_URL}/api/auth/me/`,
        {credentials: "include"}
    );

    if (!response.ok){
        return null;
    }
    return await response.json();
}

export async function realizarCadastro( nome, email, password, confirmPassword) {

    await prepararCsrf();

    const csrftoken = getCookie("csrftoken");

    const response = await fetch(
        `${API_URL}/api/auth/cadastro/`,
        {
            method: "POST",

            credentials: "include",

            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrftoken,
            },

            body: JSON.stringify({
                nome,
                email,
                password,
                confirmPassword
            })
        }
    );

    const dados = await response.json();

    if (!response.ok) {
        throw new Error(
            dados.erro || "Erro ao realizar cadastro"
        );
    }

    return dados;
}