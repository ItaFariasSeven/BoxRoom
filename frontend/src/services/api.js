// URL base da API: usa a variável de ambiente do Vite, ou localhost como fallback (dev local)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
// Guarda o token CSRF em memória (módulo), para ser reutilizado em requisições que alteram dados
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


// Busca o token CSRF no backend e guarda na variável "csrfToken"
// Necessário porque o Django exige esse token em requisições que alteram dados (POST/PATCH/DELETE)
export async function prepararCsrf() {
    
    const response = await fetch(
        `${API_URL}/api/auth/csrf/`,
        {credentials: "include"} // envia/recebe cookies de sessão entre domínios
    );
    if(!response.ok) {
        throw new Error("Não foi possível preparar a proteção CSRF");
    }
    const dados = await response.json();
    csrfToken = dados.csrfToken;
    return csrfToken;
}

// Função central de requisições à API — todas as outras funções deste arquivo passam por ela.
// Cuida de: método HTTP, token CSRF, headers, tipo de corpo (JSON ou FormData) e tratamento de erros.
export async function apiFetch(endpoint, options ={}) {
    // Normaliza o método (GET por padrão)
    const method =options.method?.toUpperCase() || "GET";
    // Identifica se a requisição altera dados no servidor (tudo que não é GET/HEAD/OPTIONS)
    const alteraDados = ![
        "GET",
        "HEAD",
        "OPTIONS"
    ].includes(method);

    // Se a requisição altera dados, garante que exista um token CSRF válido antes de continuar
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
    // Monta os headers da requisição a partir dos que vierem em "options"
    const headers = new Headers(options.headers || {});

    // Só define Content-Type JSON se o corpo NÃO for FormData
    // (FormData define seu próprio Content-Type com boundary automaticamente)
    if(options.body && !(options.body instanceof FormData))
        {
            headers.set(
                "Content-Type",
                "application/json"
            );
        }

    // Anexa o token CSRF no header exigido pelo Django, só quando necessário
    if(alteraDados){
        headers.set("X-CSRFToken", csrfToken);
    }

    // Faz a requisição HTTP de fato
    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            ...options,
            method,
            headers,
            credentials: "include" // sempre envia cookies de sessão (autenticação)
        }
    );

    const contentType = response.headers.get("content-type") || "";
    let dados;

    // Status 204 (No Content) não tem corpo — retorna null direto
    if(response.status === 204){
        return null
    }

    // Se a resposta for JSON, faz o parse normalmente
    if(
        contentType.includes(
            "application/json"
        )
    ){
        dados = await response.json()
    }else{
        // Se vier algo que não é JSON (ex: página de erro HTML), trata como erro genérico
        const texto = await response.text();
        console.error("Resposta não-JSON do servidor", texto);
        dados = {
            erro: 
                `Erro ${response.status} no servidor.`
        };
    }

    // Se a resposta HTTP não for de sucesso (status fora do range 200-299), lança um erro
    // usando a mensagem vinda do backend ("erro"), ou uma mensagem genérica
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

// Cria um novo item; aceita FormData (quando há upload de foto) ou objeto comum (JSON)
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

// Atualiza parcialmente (PATCH) um item existente pelo ID
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

// Exclui um item pelo ID
export function excluirItem(id) {

    return apiFetch(
        `/api/itens/${id}/`,
        {
            method: "DELETE"
        }
    );
}

// Aumenta em 1 a quantidade em estoque do item (endpoint customizado no backend)
export function incrementarItem(id) {

    return apiFetch(
        `/api/itens/${id}/incrementar/`,
        {
            method: "POST"
        }
    );
}

// Diminui em 1 a quantidade em estoque do item (endpoint customizado no backend)
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
// Busca os dados agregados do dashboard (totais, gráficos, baixo estoque)
export function buscarDashboard() {
    
    return apiFetch(
        "/api/dashboard/"
    );
}

// Cria uma nova categoria
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

// Atualiza parcialmente uma categoria existente pelo ID
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

// Exclui uma categoria pelo ID
export function excluirCategoria(id) {

    return apiFetch(
        `/api/categorias/${id}/`,
        {
            method: "DELETE"
        }
    );
}

// Realiza login do usuário (email/senha) e renova o token CSRF depois,
// pois o Django costuma trocar o token de sessão após autenticar
export async function realizarLogin(email, password) {
     
    const dados = await apiFetch(
        `/api/auth/login/`,
        {
            method: "POST",
            body: JSON.stringify({email, password})
        }
    );
    csrfToken = null; // invalida o token antigo
    await prepararCsrf(); // busca um novo token válido para a sessão logada
    return dados;
}

// Verifica se há um usuário autenticado (usado para checagem de sessão ao carregar a app)
// Usa fetch direto (não apiFetch) porque não precisa lançar erro — apenas retorna null se não autenticado
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

// Realiza o cadastro de um novo usuário e, assim como no login,
// renova o token CSRF após a criação da sessão
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

// Busca os dados de perfil do usuário logado (nome, email, foto)
export function buscarPerfil() {

    return apiFetch(
        "/api/auth/perfil/"
    );
}

// Atualiza dados do perfil (ex: nome)
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

// Exclui a conta do usuário; exige senha como confirmação de segurança
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

// Envia uma nova foto de perfil via multipart/form-data
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

// Realiza logout do usuário.
// Renova o CSRF antes (garante token válido para o POST de logout)
// e novamente depois (limpa o token, já que a sessão anterior foi encerrada)
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