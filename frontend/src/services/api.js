const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
let csrfToken = null;

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
    
    const response = await fetch(
        `${API_URL}/api/auth/csrf/`,
        {credentials: "include"}
    );
    if(!response.ok) {
        throw new Error("Não foi possível preparar a proteção CSRF");
    }
    const dados = await response.json();
    csrfToken = dados.csrfToken;
    return csrfToken;
}

export async function apiFetch(endpoint, options ={}) {
    const method =options.method?.toUpperCase() || "GET";
    const alteraDados = ![
        "GET",
        "HEAD",
        "OPTIONS"
    ].includes(method);

    if(alteraDados){
        let csrfToken = getCookie("csrftoken");
        
        if(!csrfToken){
            await prepararCsrf();
            csrfToken = getCookie("csrftoken");
        }
        if(!csrfToken){
            throw new Error("Token CSRF não disponível");       
        }
    }

    const headers = new Headers(options.headers || {});

    if(options.body && !(options.body instanceof FormData))
        {
            headers.set(
                "Content-Type",
                "application/json"
            );
        }

    if(alteraDados){
        headers.set("X-CSRFToken", getCookie("csrftoken"));
    }

    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            method,
            headers,
            credentials: "include"
        }
    );
    if(response.status === 204){
        return null;
    }

    const contentType = response.headers.get("content-type") || "";
    let dados;

    if(
        contentType.includes(
            "application/json"
        )
    ){
        dados = await response.json()
    }else{
        const texto = await response.text();
        console.error("Resposta não-JSON do servidor");
        dados = {
            erro: 
                `Erro ${response.status} no servidor.`
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

            body: 
                item instanceof FormData
                    ? item
                    : JSON.stringify(item)
        }
    );
}


export function atualizarItem( id, item ) {

    return apiFetch(
        `/api/itens/${id}/`,
        {
            method: "PATCH",

            body:
                item instanceof FormData
                    ? item 
                    : JSON.stringify(item)
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

export function buscarDashboard() {
    
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

export function buscarPerfil() {

    return apiFetch(
        "/api/auth/perfil/"
    );
}

export function atualizarPerfil(
    dados
) {

    return apiFetch(
        "/api/auth/perfil/",
        {
            method: "PATCH",

            body: JSON.stringify(
                dados
            )
        }
    );
}

export function excluirConta(
    password
) {

    return apiFetch(
        "/api/auth/perfil/",
        {
            method: "DELETE",

            body: JSON.stringify({
                password
            })
        }
    );
}

export function atualizarFotoPerfil(foto) {
    const formData = new FormData();
    formData.append("foto", foto);

    return apiFetch(
        "/api/auth/perfil/foto/",
        {
            method: "POST",
    
            body: formData
        }
    );
}

export function realizarLogout() {

    return apiFetch(
        "/api/auth/logout/",
        {
            method: "POST"
        }
    );
}