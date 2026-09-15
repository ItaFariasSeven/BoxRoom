import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalEditarCategoriaModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';


export default function ModalEditarCategoria({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSubmit(event) {
        event.preventDefault();

        const produto = {
            nome: nome,
            categoria: categoria,
            descricao: descricao,
        };

        console.log(produto);
    }

    const {
    data: categorias = []
} = useQuery({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
    enabled: open
});

  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
        <Box className='container-modal-edit-categoria'>
           <div className='container-title'>
             <h1 className='title-modal'>Editar Categoria</h1>
           </div>

            <Box
              className='form-add'
              component='form'
              onSubmit={handleSubmit}
            >

                <FormControl fullWidth>
                    <InputLabel id='categoria-label'>
                        Categoria
                    </InputLabel>
                    <Select
                      labelId='categoria-label'
                      label='Categoria'
                      value={categoria}
                      onChange={(event) => setCategoria(event.target.value)}
                    >
                        {categorias.map((item) =>(
                            <MenuItem 
                              key={item.id}
                              value={item.id}
                              >
                              {item.nome}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {categoria && (
                    <>
                      <TextField
                        label='Nome do Produto'
                        value={nome}
                        onChange={(event) => setNome(event.target.value)}
                      />
    
                      <TextField
                        multiline
                        rows={10}
                        label='Descrição'
                        value={descricao}
                        onChange={(event) => setDescricao(event.target.value)}
                      />

                        <>
                        <div className='container-button-edit-categoria'>
                            <Button
                                className='button-delete-edit-categoria'
                                type='submit'
                                variant='contained'
                                color='secondary'
                            >
                              Excluir Categoria
                            </Button>
                            <Button
                                className='button-salve-edit-categoria'
                                type='submit'
                                variant='contained'
                            >
                              Salvar
                            </Button>
                        </div>
                        </>
                    </>

            )}
            </Box>

        </Box>

    </Modal>
  );
}
