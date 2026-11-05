import ImageLogo from "../../assets/Nav/Logo.png"
import './LoginModule.css'
import { Button, Box, TextField,Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { realizarLogin } from "../../services/api";
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


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

                      <GoogleOAuthProvider clientId="SEU_CLIENT_ID_DO_GOOGLE">
                          <GoogleLogin
                            onSuccess={credentialResponse => {
                              console.log("Token de login bem-sucedido:", credentialResponse);
                            }}
                            onError={() => {
                              console.log('Falha no Login');
                            }}
                            // Você pode customizar o tema e o formato nativamente através de propriedades
                            theme="outline" // Opções: outline, filled_blue, filled_black
                            shape="pill" // Opções: rectangular, pill, circle, square
                            size="large"        // Opções: small, medium, large
                          />
                        </GoogleOAuthProvider>
                  </div>

                    <div className="conatiner-esqueci-senha">
                        <Link to="/cadastro" style={{ color: 'inherit', textDecoration: 'none' }}>
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