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

export async function apiFetch(endpoint, options ={}) {
    const method =options.method?.toUpperCase() || "GET";
    const alterarDados = ![
        "GET",
        "HEAD",
        "OPTIONS"
    ].includes(method);

    if(alterarDados){
        await prepararCsrf();
    }

    const headers = new Headers(options.headers || {});

    if(options.body && !(options.body instanceof FormData))
        {
            headers.set(
                "Content-Type",
                "application/json"
            );
        }

    if(alterarDados){
        const csrfToken = getCookie("csrftoken");
        headers.set("X-CSRFToken", csrfToken);
    }

    const response = await fetch(
        `${API_URL} ${endpoint}`,
        {
            ...options,
            method,
            headers,
            credentials: "include"
        }
    );

    const contentType = response.headers.get("content-type") || "";
    let dados = null;

    if(
        contentType.includes(
            "application/json"
        )
    ){
        dados = await response.json()
    }else{
        const texto = await response.text();
        dados = {
            erro: 
                texto ||
                "Resposta inválida do servidor."
        };
    }

    if(!response.ok){
        throw new Error(
            dados?.erro ||
            "Erro na comunicação com o servidor."
        );
    }
    return dados;
}

// Itens
export function listarItens() {

    return apiFetch(
        "/api/itens/"
    );
}


export function criarItem(item) {

    return apiFetch(
        "/api/itens/",
        {
            method: "POST",

            body: JSON.stringify(item)
        }
    );
}


export function atualizarItem( id, item ) {

    return apiFetch(
        `/api/itens/${id}/`,
        {
            method: "PATCH",

            body: JSON.stringify(item)
        }
    );
}


export function excluirItem(id) {

    return apiFetch(
        `/api/itens/${id}/`,
        {
            method: "DELETE"
        }
    );
}


export function incrementarItem(id) {

    return apiFetch(
        `/api/itens/${id}/incrementar/`,
        {
            method: "POST"
        }
    );
}


export function decrementarItem(id) {

    return apiFetch(
        `/api/itens/${id}/decrementar/`,
        {
            method: "POST"
        }
    );
}


// CATEGORIAS
export function listarCategorias() {

    return apiFetch(
        "/api/categorias/"
    );
}

export function buscarDashBoard() {
    
    return apiFetch(
        "/api/dashboard/"
    );
}


export function criarCategoria(categoria) {

    return apiFetch(
        "/api/categorias/",
        {
            method: "POST",

            body: JSON.stringify(
                categoria
            )
        }
    );
}


export function atualizarCategoria(
    id,
    categoria
) {

    return apiFetch(
        `/api/categorias/${id}/`,
        {
            method: "PATCH",

            body: JSON.stringify(
                categoria
            )
        }
    );
}


export function excluirCategoria(id) {

    return apiFetch(
        `/api/categorias/${id}/`,
        {
            method: "DELETE"
        }
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