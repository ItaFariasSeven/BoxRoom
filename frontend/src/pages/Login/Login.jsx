import ImageLogo from "../../assets/Nav/Logo.png"
import './LoginModule.css'
import { Button, Box, TextField,Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { realizarLogin } from "../../services/api";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { loginComGoogle } from "../../services/api";

const styleFormLogin = {
                '& label':{
                    color: 'white',
                },
                '& input': {
                    color: 'white',
                },
                '& label.Mui-focused': {
                    color: 'white',
                },
                '& .MuiOutlinedInput-root': {
                    '& fieldset':{
                        borderColor: 'white',
                    },
                    '&:hover fieldset': {
                        borderColor: 'white',
                    },
                    '&.Mui-focused fieldset': {
                        borderColor: 'white',
                    },
                }
            }

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();
    
    
      async function handleSubmit(event) {
            event.preventDefault();

            try{
                setErro("");
                const resposta = await realizarLogin(
                    email, password
                );
                console.log("Login Realizado: ", resposta);
                navigate("/");
            }catch(error){
                console.error(error);
                setErro(error.message);
            }
        }


    return(
        
        <main className="container-login">
            {erro && (
                <Alert
                    className="codigo-error"
                    severity="error"
                    icon={false}
                >
                    {erro}
                </Alert>
            )}
            <section></section>
            <section className="container-lateral-login">
                
                <div className="container-title-boxroom-login">
                    <h1 className="title-boxroom-login">BoxRoom</h1>
                </div>

                <div>
                    <Box
                      className='form-login'
                      component='form'
                      onSubmit={handleSubmit}
                    >
                    <TextField
                      className="input-form-login"
                      label='E-mail'
                      value={email}
                      sx={styleFormLogin}
                      onChange={(event) => setEmail(event.target.value)}
                      />
                    <TextField
                      className="input-form-login"
                      label='Senha'
                      type="password"
                      value={password}
                      sx={styleFormLogin}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  <div className="container-buttons">
                      <Button
                        className="button-login"
                        type='submit'
                        variant='contained'
                      >
                        Login
                      </Button>

                    <GoogleOAuthProvider clientId="763202616838-gku3ugjukbopf0lb2j2c94r3pdm957t6.apps.googleusercontent.com">
                        <GoogleLogin
                            onSuccess={async credentialResponse => {
                                try {
                                    setErro("");
                                    // Envia o token para o Django validar e logar o utilizador
                                    const resposta = await loginComGoogle(credentialResponse.credential);

                                    console.log("Login com Google bem-sucedido:", resposta);

                                    // Salva o token de acesso (se aplicável ao seu projeto) e redireciona
                                    localStorage.setItem('access_token', resposta.access);
                                    navigate("/");
                                } catch (error) {
                                    console.error(error);
                                    setErro("Falha ao autenticar com o Google no servidor.");
                                }
                            }}
                            onError={() => {
                                setErro('Falha na comunicação com o Google.');
                            }}
                            theme="outline" 
                            shape="pill" 
                            size="large"
                        />
                    </GoogleOAuthProvider>
                  </div>

                    <div className="conatiner-esqueci-senha">
                        <Link to="/recuperarsenha" style={{ color: 'inherit', textDecoration: 'none' }}>
                            <p>Não lembra a <u>senha?</u></p>
                        </Link>
                    
                    </div>

                </Box>
                </div>
                <div className="conatiner-sem-cadastro">
                    <Link to="/cadastro" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <p>Não tem uma conta? Faça seu <u>Cadastro</u></p>
                    </Link>
                
                </div>
            </section>

        </main>
        
    )
}