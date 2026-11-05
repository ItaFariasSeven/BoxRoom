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

import { useSearchParams } from "react-router-dom";
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

  const abrirModal = (tipo) => {
    setModalAtivo(tipo);
    handleCloseEstoque(); // Fecha o dropdown ao abrir o modal
  };
  const fecharModal = () => setModalAtivo(null);

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

            {/* Lupa de Pesquisa e ícone de pesquisa */}
            {/* <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                className='barra-pesquisa'
                type='text'
                placeholder="Pesquisar…"
                value={busca}
                onChange={handleBusca}
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search> */}

            {/* paravras de pesquisa: produtos, dashboard, estoque */}
            <div className='barra-pesquisa'>
              <div className='container-notificacoes-bell'>
                <img 
                  src={imageBell}
                  alt='Notificações'
                  className='notificacoes-bell'
                />
                <Link style={{ color: 'inherit',textDecoration: 'none' }}>
                  <p className='caminhos-paginas'>Produtos</p>
                </Link>
              </div>

              <Link style={{ color: 'inherit',textDecoration: 'none' }}>
                <p className='caminhos-paginas'>Dashboard</p>
              </Link>

              {/* Botão de Estoque com gatilho para o Popover */}
              <div className='container-seta-arrow' onClick={handleOpenEstoque}>
                <Link style={{ color: 'inherit',textDecoration: 'none' }}>
                  <p className='caminhos-paginas'>Estoque</p>
                </Link>
                <img 
                  src={imageArrow}
                  alt='Flecha'
                  className='seta-arrow'
                />
              </div>
            </div>

            {/* Espaçamento */}
            {/* <Box sx={{ flexGrow: 1 }} /> */}
            {/* <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            </Box> */}
            {/* <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box> */}

              {/* Ícone de adicionar coisas ao estoque */}
              {/* <Box sx={{ '& > :not(style)' : { m: 0.5 }  }}>
                <Fab 
                  color="error" 
                  aria-label="add" 
                  onClick={handleOpenOptions}
                  sx={{
                    '@media (max-width: 800px)':{
                      width: 36,
                      height: 36,
                    }
                  }}
                >
                    <AddIcon />
                </Fab>
              </Box> */}

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