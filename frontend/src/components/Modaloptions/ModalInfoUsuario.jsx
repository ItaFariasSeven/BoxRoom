import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalInfoUsuarioModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";
import { Alert } from '@mui/material';

import { buscarPerfil, atualizarPerfil, excluirConta, atualizarFotoPerfil, realizarLogout } from "../../services/api";

// Modal que mostra as informações do usuário logado, permitindo editar nome,
// trocar foto de perfil e excluir a conta
export default function ModalInfoUsuario({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [password, setPassword] = useState(""); // senha exigida para confirmar exclusão da conta

  const [erro, setErro] = useState(""); // mensagem de erro exibida no Alert
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [fotoSelecionada, setFotoSelecionada] = useState(null); // arquivo escolhido para upload
  const [previewFoto, setPreviewFoto] = useState(null); // URL local para pré-visualização

  // Busca os dados do perfil do usuário (nome, email, foto)
  const {
        data: usuario,
        isLoading
    } = useQuery({
        queryKey: ["perfil"],
        queryFn: buscarPerfil,
        enabled: open // só busca quando o modal está aberto
    });

    // Sempre que os dados do usuário chegarem, preenche o campo "nome"
    useEffect(() => {
        if (!usuario) {
            return;
        }
        setNome(
            usuario.nome ?? ""
        );
    }, [usuario]);

    // Mutação para atualizar o nome do perfil
    const atualizarMutation =
        useMutation({
            mutationFn: atualizarPerfil,
            onSuccess: () => {
                setErro("");
                queryClient.invalidateQueries({
                    queryKey: ["perfil"]
                });
                alert(
                    "Perfil atualizado com sucesso!"
                );
                handleClose();
            },
            onError: (error) => {
                setErro(
                    error.message
                );
            }
        });

    // Mutação para excluir a conta do usuário
    const excluirMutation =
        useMutation({
            mutationFn: excluirConta,
            onSuccess: () => {
                // Limpa TODO o cache do React Query (itens, categorias, dashboard, perfil etc.)
                queryClient.clear();
                handleClose();      
                // Redireciona para a tela de login, substituindo o histórico (não permite "voltar" para a área logada)
                navigate(
                    "/login",
                    {
                        replace: true
                    }
                );
            },
            onError: (error) => {
                setErro(
                    error.message
                );
            }
        });

    // Mutação para enviar a nova foto de perfil
    const fotoMutation =
        useMutation({
            mutationFn: atualizarFotoPerfil,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["perfil"]
                });
                // Limpa a seleção após o upload ser concluído
                setFotoSelecionada(null);
                setPreviewFoto(null);
            },
            onError: (error) => {
                setErro(
                    error.message
                );
            }
        });

// Mutação de logout: chama o backend e limpa todo o estado local
const logoutMutation =
    useMutation({
        // Faz POST no Django.
        mutationFn: realizarLogout,
        onSuccess: () => {
            // apagamos do cache itens, dashboard, perfil, categorias etc.
            queryClient.clear();
            // Volta para login.
            navigate(
                "/login",
                {
                    replace: true
                }
            );
        },
        onError: (error) => {
            alert(
                error.message
            );
        }
    });

    

  // Envia o formulário para atualizar apenas o nome do usuário
  function handleSubmit(event) {
        event.preventDefault();

        setErro("");

        atualizarMutation.mutate({nome});
    }

    // Valida a senha e confirma antes de excluir a conta
    function handleExcluirConta() {
        setErro("");
        if (!password) {
            setErro(
                "Digite sua senha antes de excluir a conta."
            );
            return;
        }

        const confirmar =
            window.confirm(
                "Esta ação excluirá sua conta e não poderá ser desfeita. Deseja continuar?"
            );

        if (!confirmar) {
            return;
        }

        excluirMutation.mutate(
            password
        );
    }

    // Trata a seleção da nova foto de perfil, validando tipo e tamanho
    function handleSelecionarFoto(event) {

    const arquivo = event.target.files?.[0];

    if (!arquivo) {
        return;
    }

    // Validação rápida no frontend.
    if (
        ![
            "image/jpeg",
            "image/png",
            "image/webp"
        ].includes(
            arquivo.type
        )
    ) {
        setErro(
            "Selecione uma imagem JPG, PNG ou WEBP."
        );
        return;
    }

    if ( arquivo.size > 5 * 1024 * 1024) {
        setErro(
            "A imagem deve ter no máximo 5 MB."
        );
        return;
    }

    setErro("");

    setFotoSelecionada(
        arquivo
    );

    // Cria preview local.
    const url =
        URL.createObjectURL(
            arquivo
        );
    setPreviewFoto(url);
}

  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
        <Box className='container-modal-info-usuario'>
           <div className='container-title'>
             <h1 className='title-modal'>Informações do Usuário</h1>
           </div>

            {/* Exibe mensagem de erro, se houver */}
           {erro && (

              <Alert
                  severity="error"
                  icon={false}
              >
                  {erro}
              </Alert>
            )}

            {/* Enquanto os dados do perfil estão carregando, mostra um texto simples */}
            {isLoading ?(
                <p>Carregando Informações ...</p>
            ) : (
                <>
                    <div className="container-info-usuario">
                    <div>
                    {/* Prioridade de exibição: preview novo > foto atual do usuário > imagem padrão */}
                      <img className='photo'
                        src={
                            previewFoto
                            || usuario?.foto
                            || ImagemProduct
                        }
                        alt="Imagem do Produto"
                        />
                    <div className='input-info-usuario'>
                        <input 
                            id="foto-perfil"
                            type='file'
                            accept=' image/jpeg, image/png, image/web'
                            hidden
                            onChange={handleSelecionarFoto}
                        />
                        <label htmlFor='foto-perfil'>
                            <Button
                                component='span'
                                variant='outlined'
                            >
                                Escolher foto
                            </Button>
                        </label>
                    </div>

                    {/* Botão de salvar foto só aparece depois que uma nova foto for selecionada */}
                    {fotoSelecionada && (
                        <div className='buttom-photo-select'>
                            <Button
                                type='button'
                                variant='contained'
                                disabled={fotoMutation.isPending}
                                onClick={() => fotoMutation.mutate(fotoSelecionada)}
                            >
                                {
                                    fotoMutation.isPending
                                    ? "Enviando..."
                                    : "Salvar foto"
                                }
                            </Button>
                        </div>
                    )}
                    </div>

                    {/* Formulário com nome, senha (para exclusão) e e-mail (somente leitura) */}
                    <Box
                      className='form-user'
                      component='form'
                      onSubmit={handleSubmit}
                    >

                        <TextField
                          required
                          label='Nome'
                          value={nome}
                          onChange={(event) => setNome(event.target.value)}
                          />
    
                        <TextField
                          label="Senha"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                        />
    
                        {/* E-mail é somente leitura, pois não pode ser alterado pelo usuário */}
                        <TextField
                          required
                          label='E-mail'
                          value={usuario?.email ?? ""}
                          InputProps={{readOnly: true}}
                          />
    
                        <div className='conatiner-button-user'>
                            <Button
                              className='button-delete-user'
                              type='button'
                              variant='contained'
                              disabled={excluirMutation.isPending}
                              onClick={handleExcluirConta}
                            >
                            {
                                excluirMutation.isPending 
                                ? "Excluindo..."
                                : "Excluir minha conta"
                            }
                             </Button>
                            <Button
                              className='button-save-user'
                              type='submit'
                              variant='contained'
                              disabled={atualizarMutation.isPending}
                            >
                              {
                                  atualizarMutation.isPending 
                                  ? "Salvando..."
                                  : "Salvar Alterações"
                              }
                            </Button>
                        </div>

                        <div
                          className='butto-sair'>
                          <Button
                            type='button'
                            variant='contained'
                            color='error'
                            disabled={logoutMutation.isPending}
                            onClick={() => logoutMutation.mutate()}
                          >
                            {
                              logoutMutation.isPending
                              ? "Saindo"
                              : "Sair da conta"
                            }
                          </Button>
                        </div>
                    </Box>
                </div>
            </>
            )}
        </Box>

    </Modal>
  );
}
