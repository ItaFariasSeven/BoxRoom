import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalOptionsModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';
import ImagemUser from '../../assets/Nav/user.png'

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { realizarLogout } from "../../services/api";

import ModalCadastrarCategoria from './ModalCadastrarCategoria';
import ModalEditarCategoria from './ModalEditarCategoria';
import ModalInfoUsuario from './ModalInfoUsuario';


// Modal "menu" com as opções principais: cadastrar/editar categoria,
// sair da conta e abrir informações do usuário
export default function ModalOptions({ open, handleClose, usuario }) {
  // Controla a abertura de cada sub-modal individualmente
  const [openCadastrarCategoria, setOpenCadastrarCategoria] = React.useState(false);
  const [openEditarCategoria, setOpenEditarCategoria] = React.useState(false);
  const [openInfoUsuarios, setOpenInfoUsuarios] = React.useState(false);
  
    // Fecha o menu de opções e abre o modal de cadastro de categoria
    const handleOpenCadastrarCategoria = () => {
      handleClose();
      setOpenCadastrarCategoria(true);
    };
    const handleCloseCadastrarCategoria = () => setOpenCadastrarCategoria(false);

    // Fecha o menu de opções e abre o modal de edição de categoria
    const handleOpenEditarCategoria = () => {
      handleClose();
      setOpenEditarCategoria(true);
    };
    const handleCloseEditarCategoria = () => setOpenEditarCategoria(false);

    // Fecha o menu de opções e abre o modal de informações do usuário
    const handleOpenInfoUsuarios = () => {
      handleClose();
      setOpenInfoUsuarios(true);
    };
    const handleCloseInfoUsuarios = () => setOpenInfoUsuarios(false);

    
const navigate = useNavigate();
const queryClient = useQueryClient();

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

  return (
    <>
    {/* Modal principal: menu de opções */}
    <Modal
      open={open} 
      onClose={handleClose} 
      >
        <Box className='container-modal-options'>
              <Button
                type='button'
                variant='contained'
                onClick={handleOpenCadastrarCategoria}
              >
                Cadastrar Categoria
              </Button>

              <Button
                type='button'
                variant='contained'
                onClick={handleOpenEditarCategoria}
              >
                Editar Categoria
              </Button>

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

              {/* Avatar do usuário; ao clicar, abre o modal de informações do usuário */}
              <img className='user-modal'
                src={
                  usuario?.foto ||
                  ImagemUser
                }
                alt="Imagem de usuário"
                onClick={handleOpenInfoUsuarios}
              />

            </Box>

    </Modal>
            {/* Sub-modais, cada um controlado pelo seu próprio estado open/close */}
            <ModalCadastrarCategoria
              open={openCadastrarCategoria}
              handleClose={handleCloseCadastrarCategoria}
            />
            
            <ModalEditarCategoria 
              open={openEditarCategoria}
              handleClose={handleCloseEditarCategoria}
            />
            <ModalInfoUsuario 
              open={openInfoUsuarios}
              handleClose={handleCloseInfoUsuarios}
              />

    </>

  );
}
