import './RecuperarSenhaModule.css';
import { Button, Box, TextField, Alert, Typography } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { solicitarCodigoRecuperacao, redefinirNovaSenha } from "../../services/api";

import imgConfuso from '../../assets/login/recuperarcontaImage.png'; 
import imgAviao from '../../assets/login/recuperarcontaImage2.png';

const styleFormCadastro = {
    '& label': { color: 'white' },
    '& input': { color: 'white' },
    '& label.Mui-focused': { color: 'white' },
    '& .MuiOutlinedInput-root': {
        '& fieldset': { borderColor: 'white' },
        '&:hover fieldset': { borderColor: 'white' },
        '&.Mui-focused fieldset': { borderColor: 'white' },
    }
};

export default function RecuperarSenha() {
    const [step, setStep] = useState(1); 
    const [email, setEmail] = useState("");
    const [codigo, setCodigo] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    
    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState(""); // Feedback positivo para o utilizador

    const navigate = useNavigate();

    // ================== PASSO 1: DISPARAR E-MAIL ==================
    async function handleEmailSubmit(event) {
        event.preventDefault();
        try {
            if (!email) throw new Error("Por favor, preencha o e-mail.");
            await solicitarCodigoRecuperacao(email); // Chama o Django
            setErro("");
            setStep(2); // Vai para a tela do Código
        } catch (error) {
            setErro(error.message);
        }
    }

    // ================== PASSO 2: VALIDAR CÓDIGO LOCALMENTE ==================
    function handleCodigoSubmit(event) {
        event.preventDefault();
        if (!codigo) {
            setErro("Por favor, insira o código.");
            return;
        }
        setErro("");
        setStep(3); // Vai para a tela da Nova Senha
    }

    // ================== PASSO 3: MUDAR NO BANCO ==================
    async function handleNovaSenhaSubmit(event) {
        event.preventDefault();
        try {
            if (novaSenha !== confirmarSenha) throw new Error("As senhas não coincidem.");
            if (novaSenha.length < 6) throw new Error("A senha deve ter no mínimo 6 caracteres.");
            
            // Envia tudo para o Django validar o código e salvar a senha de uma vez
            await redefinirNovaSenha(email, codigo, novaSenha); 
            
            setErro("");
            setSucesso("Senha alterada com sucesso! Redirecionando...");
            
            // Aguarda 2 segundos para o utilizador ler a mensagem e manda pro Login
            setTimeout(() => {
                navigate("/login"); 
            }, 2000);
            
        } catch (error) {
            setErro(error.message);
        }
    }

    return (
        <main 
            className="container-recuperar"
            // Reutiliza a imagem do avião para o passo 3, ou pode adicionar uma terceira imagem.
            style={{ backgroundImage: `url(${step === 1 ? imgConfuso : imgAviao})` }}
        >
            {erro && (
                <Alert className="codigo-error" severity="error" icon={false}>
                    {erro}
                </Alert>
            )}
            
            {sucesso && (
                <Alert className="codigo-error" severity="success" icon={false} style={{backgroundColor: '#22c55e'}}>
                    {sucesso}
                </Alert>
            )}
            
            <section></section>
            
            <section className="container-lateral-recuperar">
                <div className="container-title-boxroom">
                    <h1 className="title-boxroom">BoxRoom</h1>
                </div>

                <div>
                    {step === 1 && (
                        <Box className='form-recuperar' component='form' onSubmit={handleEmailSubmit}>
                            <TextField className="input-form-recuperar" label='E-mail' value={email} sx={styleFormCadastro} onChange={(e) => setEmail(e.target.value)} />
                            <Button className="button-recuperar" type='submit' variant='contained'>Enviar Código</Button>
                        </Box>
                    )}

                    {step === 2 && (
                        <Box className='form-recuperar' component='form' onSubmit={handleCodigoSubmit}>
                            <Typography className="instrucao-texto">
                                Digite o código numérico enviado para:<br/>
                                <strong>{email}</strong>
                            </Typography>
                            <TextField className="input-form-recuperar" label='Código de 6 dígitos' value={codigo} sx={styleFormCadastro} onChange={(e) => setCodigo(e.target.value)} />
                            <Button className="button-recuperar" type='submit' variant='contained'>Validar Código</Button>
                        </Box>
                    )}

                    {step === 3 && (
                        <Box className='form-recuperar' component='form' onSubmit={handleNovaSenhaSubmit}>
                            <Typography className="instrucao-texto">Crie sua nova senha de acesso.</Typography>
                            <TextField className="input-form-recuperar" label='Nova Senha' type="password" value={novaSenha} sx={styleFormCadastro} onChange={(e) => setNovaSenha(e.target.value)} />
                            <TextField className="input-form-recuperar" label='Confirmar Nova Senha' type="password" value={confirmarSenha} sx={styleFormCadastro} onChange={(e) => setConfirmarSenha(e.target.value)} />
                            <Button className="button-recuperar" type='submit' variant='contained'>Salvar Nova Senha</Button>
                        </Box>
                    )}
                </div>

                <div className="container-voltar-login">
                    <Link to="/login" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <p><u>Voltar ao Login</u></p>
                    </Link>
                </div>
            </section>
        </main>
    );
}