import React, { useState } from 'react';
import Popover from '@mui/material/Popover';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import './MenuEstoqueModule.css';
import imageAdd from '../../assets/infoBar/addImage.png';
import imageVision from '../../assets/infoBar/vision.png';
import imagePencil from '../../assets/infoBar/pencil.png';
import ModalCadastrarCategoria from './ModalCadastrarCategoria';
import ModalEditarCategoria from './ModalEditarCategoria';
import ModalAddAside from '../ModalAdd/ModalAddAside';
import { useViewMode } from '../../contexts/ViewModeContext'; 


export default function MenuEstoque({ open, anchorEl, handleClosePopover, handleClose }) {
  const [modalAtivo, setModalAtivo] = useState(null);
  const [openCadastrarCategoria, setOpenCadastrarCategoria] = React.useState(false);
  const [openEditarCategoria, setOpenEditarCategoria] = React.useState(false);
  const [openAddAside, setOpenAddAside] = React.useState(false);

  const { toggleViewMode } = useViewMode(); 

  // Fecha o menu de opções e abre o modal de cadastro de categoria
    const handleOpenCadastrarCategoria = () => {
      handleClosePopover();
      setOpenCadastrarCategoria(true);
    };
    const handleCloseCadastrarCategoria = () => setOpenCadastrarCategoria(false);

    // Fecha o menu de opções e abre o modal de edição de categoria
    const handleOpenEditarCategoria = () => {
      handleClosePopover();
      setOpenEditarCategoria(true);
    };
    const handleCloseEditarCategoria = () => setOpenEditarCategoria(false);

    // Fecha o menu de opções e abre o modal de informações do usuário
    const handleOpenAddAside = () => {
      handleClosePopover();
      setOpenAddAside(true);
    };
    const handleCloseAddAside = () => setOpenAddAside(false);

    const handleChangeView = () => {
      toggleViewMode();
      handleClosePopover(); // Fecha o dropdown após clicar
    };

  return (
    <>
      {/* Popover / Dropdown Menu */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClosePopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            sx: { 
              backgroundColor: 'transparent', 
              boxShadow: 'none', 
              marginTop: '0px' 
            }
          }
        }}
      >
        <div className="estoque-menu-container">

          <div className="estoque-menu-item">
              <img 
                src={imageAdd}
                className="estoque-menu-icon-wrapper" 
            />
            <Button 
                type='button'
                variant='text'
                className="estoque-menu-text"
                onClick={handleOpenCadastrarCategoria}
            >
                Cadastrar Categoria
            </Button>
          </div>

          <div className="estoque-menu-item">
              <img 
                src={imagePencil}
                className="estoque-menu-icon-wrapper" 
            />
            <Button 
                type='button'
                variant='text'
                className="estoque-menu-text"
                onClick={handleOpenEditarCategoria}
            >
                Editar Categoria
            </Button>
          </div>

          <div className="estoque-menu-item">
              <img 
                src={imageAdd}
                className="estoque-menu-icon-wrapper" 
            />
            <Button 
                type='button'
                variant='text'
                className="estoque-menu-text"
                onClick={handleOpenAddAside}
            >
                Cadastrar produto
            </Button>
          </div>

          <div className="estoque-menu-item">
              <img 
                src={imageVision}
                className="estoque-menu-icon-wrapper" 
            />
            <Button 
                type='button'
                variant='text'
                className="estoque-menu-text"
                onClick={handleChangeView}
            >
                Mudar Visão
            </Button>
          </div>


        </div>
      </Popover>

      {/* Sub-modais, cada um controlado pelo seu próprio estado open/close */}
        <ModalCadastrarCategoria
          open={openCadastrarCategoria}
          handleClose={handleCloseCadastrarCategoria}
        />
        
        <ModalEditarCategoria 
          open={openEditarCategoria}
          handleClose={handleCloseEditarCategoria}
        />
        <ModalAddAside 
          open={openAddAside}
          handleClose={handleCloseAddAside}
        />

    </>
  );
}