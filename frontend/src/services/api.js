const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
let csrfToken = null;

// Teste
console.log(
    "VITE_API_URL recebida:",
    import.meta.env.VITE_API_URL
);

console.log(
    "API_URL final:",
    API_URL
);
// Teste

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

    if (alteraDados) {

        if (!csrfToken) {
            await prepararCsrf();
        }

        if (!csrfToken) {
            throw new Error(
                "Token CSRF não disponível"
        );
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
        headers.set("X-CSRFToken", csrfToken);
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

    const contentType = response.headers.get("content-type") || "";
    let dados;

    if(response.status === 204){
        return null
    }

    if(
        contentType.includes(
            "application/json"
        )
    ){
        dados = await response.json()
    }else{
        const texto = await response.text();
        console.error("Resposta não-JSON do servidor", texto);
        dados = {
            erro: 
                `Erro ${response.status} no servidor.`
        };
    }

    if(!response.ok){
        throw new Error(
            dados?.erro ||
            `Erro ${response.status} no servidor`
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
     
    const dados = await apiFetch(
        `/api/auth/login/`,
        {
            method: "POST",
            body: JSON.stringify({email, password})
        }
    );
    csrfToken = null;
    await prepararCsrf();
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

    // Teste
    console.log(
        "CADASTRO VAI PARA:",
        `${API_URL}/api/auth/cadastro/`
    );
    // Teste
    
    const dados = await apiFetch(
        `/api/auth/cadastro/`,
        {
            method: "POST",

            body: JSON.stringify({
                nome,
                email,
                password,
                confirmPassword
            })
        }
    );
    csrfToken = null
    await prepararCsrf();

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

export async function realizarLogout() {

    csrfToken = null;
    await prepararCsrf();
    
    const dados = await apiFetch(
        "/api/auth/logout/",
        {
            method: "POST"
        }
    );
    csrfToken = null;
    return dados;
}