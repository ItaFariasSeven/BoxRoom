import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import imagemLogo from '../../assets/Nav/Logo.png';
import ImagemUser from '../../assets/Nav/user.png';
import './NavBarModule.css';
import ModalAddAside from '../ModalAdd/ModalAddAside';
import ModalOptions from '../Modaloptions/ModalOptions';
import ModalInfoUsuario from '../Modaloptions/ModalInfoUsuario';

import { useQuery } from "@tanstack/react-query";
import { buscarPerfil } from "../../services/api";

import { NavLink, useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import imageBell from '../../assets/infoBar/bell.png';
import imageArrow from '../../assets/infoBar/arrow-down.png';
import MenuEstoque from '../Modaloptions/MenuEstoque';


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(2),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '50ch',
    },
  },
}));

export default function NavBar() {
  const [openOptions, setOpenOptions] = React.useState(false);
  const [openInfoUsuarios, setOpenInfoUsuarios] = React.useState(false);

  const handleOpenOptions = () => setOpenOptions(true);
  const handleCloseOptions = () => setOpenOptions(false);

  const handleOpenInfoUsuarios = () => setOpenInfoUsuarios(true);
  const handleCloseInfoUsuarios = () => setOpenInfoUsuarios(false);

  // Funções do Menu Estoque
  const [anchorElEstoque, setAnchorElEstoque] = React.useState(null);
  const handleOpenEstoque = (event) => setAnchorElEstoque(event.currentTarget);
  const handleCloseEstoque = () => setAnchorElEstoque(null);

  const {
    data: usuario
  } = useQuery({
      queryKey: ["perfil"],
      queryFn: buscarPerfil
  });


const [searchParams, setSearchParams] = useSearchParams();
// Pega o valor atual da busca pela URL. Se não existir, usa uma string vazia.
const busca = searchParams.get("busca") ?? "";

function handleBusca(event) {
    const valor = event.target.value;

    // Cria uma cópia dos parâmetros atuais.
    const novosParametros = new URLSearchParams(searchParams);

    // Se houver alguma coisa digitada, adiciona na URL.
    if (valor.trim()) {
        novosParametros.set(
            "busca",
            valor
        );

    } else {

        // Se apagar a busca inteira, remove a busca da URL.
        novosParametros.delete(
            "busca"
        );
    }

    // replace evita criar dezenas de entradas no histórico enquanto o usuário digita.
    setSearchParams(
        novosParametros,
        {
            replace: true
        }
    );
}

  return (
    <>
      <Box sx={{ flexGrow: 1 }} >
        <AppBar position="static" sx={{ backgroundColor: '#112C5A' }} >
          <Toolbar sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 5fr 0.2fr',
            }}>

            <div className="container-title-boxroom-nav">
                <h1 className="title-boxroom-nav">BoxRoom</h1>
            </div>

            {/* paravras de pesquisa: produtos, dashboard, estoque */}
            <div className='barra-pesquisa'>
              <div className='container-notificacoes-bell'>
                <img 
                  src={imageBell}
                  alt='Notificações'
                  className='notificacoes-bell'
                />
                {/* 1. Link Produtos */}
                <NavLink to={'/produtos'} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <p className={isActive ? 'caminhos-paginas ativo' : 'caminhos-paginas'}>Produtos</p>
                  )}
                </NavLink>
              </div>

              {/* 2. Link Dashboard */}
              <NavLink to={'/dashboard'} style={{ color: 'inherit', textDecoration: 'none' }}>
                {({ isActive }) => (
                  <p className={isActive ? 'caminhos-paginas ativo' : 'caminhos-paginas'}>Dashboard</p>
                )}
              </NavLink>

              {/* 3. Botão de Estoque - SUA LÓGICA MANTIDA */}
              <div className='container-seta-arrow' onClick={handleOpenEstoque}>
                <NavLink to={'/'} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {({ isActive }) => (
                    <p className={isActive ? 'caminhos-paginas ativo' : 'caminhos-paginas'}>Estoque</p>
                  )}
                </NavLink>
                
                <img 
                  src={imageArrow}
                  alt='Flecha'
                  className='seta-arrow'
                />
              </div>
            </div>

              <img className='user'
                src={
                  usuario?.foto ||
                  ImagemUser
                }
                alt="Imagem de usuário"
                onClick={handleOpenInfoUsuarios}
              />
              

              <ModalOptions
                open={openOptions}
                handleClose={handleCloseOptions}
              />
              <ModalInfoUsuario
                open={openInfoUsuarios}
                handleClose={handleCloseInfoUsuarios}
                usuario={usuario}
              />
              
          </Toolbar>
        </AppBar>
      </Box>

      <MenuEstoque
        anchorEl={anchorElEstoque}
        handleClosePopover={handleCloseEstoque}
      />
    </>
  );
}