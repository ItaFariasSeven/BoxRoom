import ImageLogo from "../../assets/Nav/Logo.png"
import './CadastroModule.css'
import { Button, Box, TextField } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";

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

export default function Cadastro() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    
      function handleSubmit(event) {
            event.preventDefault();
    
            const user = {
                email: email,
                password: password,
                
            };
    
            console.log(user);
        }


    return(
        
        <main className="container-login">
            <div className="container-logo-login">
                <img className='logo-login'
                    src={ImageLogo}
                    alt="Imagem do Produto"
                />
            </div>

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

        </main>
        
    )
}