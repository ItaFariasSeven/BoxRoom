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
import RemoveIcon from '@mui/icons-material/Remove';

import './CardItemModule.css';
import ImagemProduct from "../../assets/Nav/user.png";

import * as React from 'react'
import Modal from '@mui/material/Modal'

import ModalEdit from '../ModalEdit/ModalEdit';

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incrementarItem, decrementarItem } from "../../services/api";

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

export default function CardItem({item}) {

const [open, setOpen] = React.useState(false);
const handleOpen = () => setOpen(true);
const handleClose = () => setOpen(false);

const queryClient = useQueryClient();


const incrementarMutation = useMutation({
    mutationFn: () =>
        incrementarItem(item.id),

    onSuccess: () => {
        // Atualiza os cards.
        queryClient.invalidateQueries({
            queryKey: ["itens"]
        });
        // Atualiza gráficos, valores e baixo estoque.
        queryClient.invalidateQueries({
            queryKey: ["dashboard"]
        });
    }
});

const decrementarMutation = useMutation({

    mutationFn: () =>
        decrementarItem(item.id),
    onSuccess: () => {
      // Atualiza os cards.
        queryClient.invalidateQueries({
            queryKey: ["itens"]
        });
      // Atualiza gráficos, valores e baixo estoque.
        queryClient.invalidateQueries({
            queryKey: ["dashboard"]
        });
    },

    onError: (error) => {
        alert(error.message);
    }
});

  return (
    <>
      <Card className='container-card'
        sx={{ 
          display: 'flex',
          backgroundColor: '#B5B5B5'
         }}
      >

        <div className='container-card-int'>
          {/* Imagem do Card */}
              <div>
                <CardMedia
                  component="img"
                  sx={{ width: 151 }}
                  image={
                    item.foto ||
                    ImagemProduct
                  }
                  alt={item.nome}
                />
              </div>

              {/* Textos de título e descrição */}
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <div>
                      <CardContent className='container-texto' sx={{ flex: '1 0 auto' }}>
                        <Typography component="div" variant="h5">
                          {item.nome}
                        </Typography>
                        <Typography
                        className='description'
                          variant="subtitle1"
                          component="div"
                          // sx={{ color: 'text.secondary' }}
                        >
                          <p>Quantidade: {" "} {item.quantidade_total}</p>
                          <p>Duração: {" "} {item.tempo_duracao_unidade} {" "} dias</p>
                          <p>Categoria: {" "} {item.categoria_nome}</p>
                          {item.link_compra &&(
                            <a
                              href={item.link_compra}
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Comprar
                            </a>
                          )}
                          
                        </Typography>
                      </CardContent>
                    </div>
                </Box>
          
              <div>
                <Box className='buttom-edit'>
                  {/* Ícones de Editar Informações */}
                  <Box sx={{ '& > :not(style)': { m: 1 } }}>
                      <Fab color="primary" aria-label="edit" onClick={handleOpen}>
                          <EditIcon />
                      </Fab>
                  </Box>
                {/* Ícone de adicionar */}
                <Box sx={{ '& > :not(style)' : { m: 1 }  }}>
                    <Fab color="secondary" aria-label="add" onClick={incrementarMutation.mutate()}>
                        <AddIcon />
                    </Fab>
                </Box>
                {/* Ícone de Subtrair */}
                <Box sx={{ '& > :not(style)' : { m: 1 }  }}>
                    <Fab color="error" aria-label="subtract" onClick={decrementarMutation.mutate()}>
                        <RemoveIcon />
                    </Fab>
                </Box>
              </Box>
            </div>
        </div>
      </Card>

      <ModalEdit 
        open={open} 
        handleClose={handleClose} 
        item={item}
      />
    </>
  );
}
