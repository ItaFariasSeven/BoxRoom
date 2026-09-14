import ImageLogo from "../../assets/Nav/Logo.png"
import './LoginModule.css'
import { Button, Box, TextField,Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { realizarLogin } from "../../services/api";

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
            <div className="container-logo-login">
                <img className='logo-login'
                    src={ImageLogo}
                    alt="Imagem do Produto"
                />
            </div>
            {erro && ( 
                <Alert
                    className="codigo-error"
                    severity="error"
                    icon={false}
                >
                    {erro}
                </Alert>
            )}

            <div >
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

              <Button
                className="button-login"
                type='submit'
                variant='contained'
              >
                Login
              </Button>
            </Box>
            </div>

            <div className="conatiner-sem-cadastro">
                <p>Ainda não tem Cadastro?</p>
                <Link to="/cadastro">
                    <p><u>Realize seu Cadastro</u></p>
                </Link>
                
            </div>

        </main>
        
    )
}