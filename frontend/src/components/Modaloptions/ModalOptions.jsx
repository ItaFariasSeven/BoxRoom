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

import ModalCadastrarCategoria from './ModalCadastrarCategoria';
import ModalEditarCategoria from './ModalEditarCategoria';
import ModalInfoUsuario from './ModalInfoUsuario';


export default function ModalOptions({ open, handleClose }) {

  const [openCadastrarCategoria, setOpenCadastrarCategoria] = React.useState(false);
  const [openEditarCategoria, setOpenEditarCategoria] = React.useState(false);
  const [openInfoUsuarios, setOpenInfoUsuarios] = React.useState(false);
  
    const handleOpenCadastrarCategoria = () => {
      handleClose();
      setOpenCadastrarCategoria(true);
    };
    const handleCloseCadastrarCategoria = () => setOpenCadastrarCategoria(false);

    const handleOpenEditarCategoria = () => {
      handleClose();
      setOpenEditarCategoria(true);
    };
    const handleCloseEditarCategoria = () => setOpenEditarCategoria(false);

    const handleOpenInfoUsuarios = () => {
      handleClose();
      setOpenInfoUsuarios(true);
    };
    const handleCloseInfoUsuarios = () => setOpenInfoUsuarios(false);

  return (
    <>
    <Modal
      open={open} 
      onClose={handleClose} 
      >
        <Box className='container-modal-options'>
              <Button
                type='submit'
                variant='contained'
                onClick={handleOpenCadastrarCategoria}
              >
                Cadastrar Categoria
              </Button>

              <Button
                type='submit'
                variant='contained'
                onClick={handleOpenEditarCategoria}
              >
                Editar Categoria
              </Button>

              <img className='user-modal'
                src={ImagemUser}
                alt="Imagem de usuário"
                onClick={handleOpenInfoUsuarios}
              />

            </Box>

    </Modal>

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
