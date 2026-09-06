import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import SkipNextIcon from '@mui/icons-material/SkipNext';

import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';

import './CardItem.css';

import * as React from 'react'
import Modal from '@mui/material/Modal'

import BasicModal from '../ModalEdit/ModalEdit';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function MediaControlCard() {
  const theme = useTheme();

const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

  return (
    <>
      <Card sx={{ display: 'flex' }}>

        {/* Imagem do Card */}
            <CardMedia
              component="img"
              sx={{ width: 151 }}
              image="https://www.drogaraia.com.br/_next/image?url=https%3A%2F%2Fproduct-data.raiadrogasil.io%2Fimages%2F9777082.webp&w=1080&q=75"
              alt="Imagem do seu produto em estoque"
            />

            {/* Textos de título e descrição */}
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          <CardContent className='container-texto' sx={{ flex: '1 0 auto' }}>
            <Typography component="div" variant="h5">
              Pasta de Dente
            </Typography>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{ color: 'text.secondary' }}
            >
              Breve Descrição
            </Typography>
          </CardContent>

          {/* Ícones de Editar Informações */}
          <Box sx={{ '& > :not(style)': { m: 1 } }}>
              <Fab color="primary" aria-label="edit" onClick={handleOpen}>
                  <EditIcon />
              </Fab>
          </Box>
          {/* <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1 }}>
            <IconButton aria-label="previous">
              {theme.direction === 'rtl' ? <SkipNextIcon /> : <SkipPreviousIcon />}
            </IconButton>
            <IconButton aria-label="play/pause">
              <PlayArrowIcon sx={{ height: 38, width: 38 }} />
            </IconButton>
            <IconButton aria-label="next">
              {theme.direction === 'rtl' ? <SkipPreviousIcon /> : <SkipNextIcon />}
            </IconButton>
          </Box> */}
        </Box>
      </Card>

      <BasicModal open={open} handleClose={handleClose} />
    </>
  );
}
