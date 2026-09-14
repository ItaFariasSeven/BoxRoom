import ImageLogo from "../../assets/Nav/Logo.png"
import './CadastroModule.css'
import { Button, Box, TextField, Alert } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { realizarCadastro } from "../../services/api";

const styleFormCadastro = {
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

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [erro, setErro] = useState("");

    const navigate = useNavigate();
    
      async function handleSubmit(event) {
            event.preventDefault();
    
            try {

        setErro("");

        const resposta = await realizarCadastro(
            nome,
            email,
            password,
            confirmPassword
        );

        console.log("Cadastro realizado:", resposta);

        navigate("/");

    } catch (error) {

        console.error(error);

        setErro(error.message);
    }
        }


    return(
        
        <main className="container-cadastro">
            <div className="container-logo-cadastro">
                <img className='logo-cadastro'
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
                  className='form-cadastro'
                  component='form'
                  onSubmit={handleSubmit}
                >
                <TextField
                  className="input-form-cadastro"
                  label='Nome'
                  value={nome}
                  sx={styleFormCadastro}
                  onChange={(event) => setNome(event.target.value)}
                  />

                <TextField
                  className="input-form-cadastro"
                  label='E-mail'
                  value={email}
                  sx={styleFormCadastro}
                  onChange={(event) => setEmail(event.target.value)}
                  />

                <TextField
                  className="input-form-cadastro"
                  label='Senha'
                  type="password"
                  value={password}
                  sx={styleFormCadastro}
                  onChange={(event) => setPassword(event.target.value)}
                  />

                <TextField
                  className="input-form-cadastro"
                  label='Confirmar Senha'
                  type="password"
                  value={confirmPassword}
                  sx={styleFormCadastro}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />

              <Button
                className="button-cadastro"
                type='submit'
                variant='contained'
              >
                Cadastrar
              </Button>
            </Box>
            </div>

            <div className="conatiner-com-cadastro">
                <p>Já possui Cadastro?</p>
                <Link to="/login">
                    <p><u>Faça seu Login</u></p>
                </Link>
                
            </div>

        </main>
        
    )
}