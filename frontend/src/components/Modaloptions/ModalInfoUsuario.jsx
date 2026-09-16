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

import { buscarPerfil, atualizarPerfil, excluirConta, atualizarFotoPerfil } from "../../services/api";


export default function ModalInfoUsuario({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");

  const [erro, setErro] = useState("");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  const {
        data: usuario,
        isLoading
    } = useQuery({
        queryKey: ["perfil"],
        queryFn: buscarPerfil,
        enabled: open
    });

    useEffect(() => {
        if (!usuario) {
            return;
        }
        setNome(
            usuario.nome ?? ""
        );
    }, [usuario]);

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

    const excluirMutation =
        useMutation({
            mutationFn: excluirConta,
            onSuccess: () => {
                queryClient.clear();
                handleClose();
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

    const fotoMutation =
        useMutation({
            mutationFn: atualizarFotoPerfil,
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["perfil"]
                });
                setFotoSelecionada(null);
                setPreviewFoto(null);
            },
            onError: (error) => {
                setErro(
                    error.message
                );
            }
        });

    


  function handleSubmit(event) {
        event.preventDefault();

        setErro("");

        atualizarMutation.mutate({nome});
    }

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

           {erro && (

              <Alert
                  severity="error"
                  icon={false}
              >
                  {erro}
              </Alert>
            )}

            {isLoading ?(
                <p>Carregando Informações ...</p>
            ) : (
                <>
                    <div className="container-info-usuario">
                    <div>
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
                            accept='
                                image/jpeg,
                                image/png,
                                image/webp,
                            '
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
                    </Box>
                </div>
            </>
            )}
        </Box>

    </Modal>
  );
}
