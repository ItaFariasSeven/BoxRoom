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
    marginLeft: theme.spacing(3),
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
      width: '20ch',
    },
  },
}));

export default function NavBar() {
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openOptions, setOpenOptions] = React.useState(false);

  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);

  const handleOpenOptions = () => setOpenOptions(true);
  const handleCloseOptions = () => setOpenOptions(false);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>

            {/* Logo */}
            <img className='logo'
              src={imagemLogo}
              alt="Imagem da logo"
            />

            {/* Lupa de Pesquisa e ícone de pesquisa */}
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Search…"
                inputProps={{ 'aria-label': 'search' }}
              />
            </Search>

            {/* Espaçamento */}
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>

            </Box>
            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="show more"
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>

                {/* Ícone de adicionar coisas ao estoque */}
              <Box sx={{ '& > :not(style)' : { m: 1 }  }}>
                <Fab color="error" aria-label="add" onClick={handleOpenAdd}>
                    <AddIcon />
                </Fab>
              </Box>

              <img className='user'
                src={ImagemUser}
                alt="Imagem de usuário"
                onClick={handleOpenOptions}
              />

              <ModalAddAside
                open={openAdd}
                handleClose={handleCloseAdd}
              />
              <ModalOptions
                open={openOptions}
                handleClose={handleCloseOptions}
              />
              
          </Toolbar>
        </AppBar>
      </Box>
    </>
  );
}