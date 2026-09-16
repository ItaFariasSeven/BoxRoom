import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalCadastrarCategoriaModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { criarCategoria } from "../../services/api";


export default function ModalCadastrarCategoria({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSubmit(event) {
        event.preventDefault();

        const categoria = {
            nome,
            descricao,
        };
        criarMutation.mutate(categoria);
    }

    const queryClient = useQueryClient();
    
    const criarMutation = useMutation({
            mutationFn: criarCategoria, 
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["categorias"]
                });
                setNome("");
                setDescricao("");
                handleClose();
            },
            onError: (error) => {
                alert(error.message);
            }
        });
    

  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
        <Box className='container-modal-cadastro-categoria'>
           <div className='container-title'>
             <h1 className='title-modal'>Cadastrar Categoria</h1>
           </div>

            <Box
              className='form-add'
              component='form'
              onSubmit={handleSubmit}
            >
                <TextField
                  label='Nome da Categoria'
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  />

                <TextField
                  multiline
                  rows={15}
                  label='Descrição'
                  value={descricao}
                  onChange={(event) => setDescricao(event.target.value)}
                />

              <Button
                type='submit'
                variant='contained'
              >
                Salvar
              </Button>
            </Box>

        </Box>

    </Modal>
  );
}
