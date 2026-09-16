import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalEditarCategoriaModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { listarCategorias, atualizarCategoria, excluirCategoria } from "../../services/api";


export default function ModalEditarCategoria({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descricao, setDescricao] = useState("");

  function handleSubmit(event) {
        event.preventDefault();

        const dados = {
            nome,
            descricao,
        };

        atualizarMutation.mutate(dados);
    }

    const queryClient = useQueryClient();

    const atualizarMutation = useMutation({
    mutationFn: (dados) =>
        atualizarCategoria(
            categoria,
            dados
        ),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["categorias"]
        });
        queryClient.invalidateQueries({
            queryKey: ["itens"]
        });
        queryClient.invalidateQueries({
            queryKey: ["dashboard"]
        });
        handleClose();
    },
    onError: (error) => {
        alert(error.message);
    }
});

const excluirMutation = useMutation({
    mutationFn: () =>
        excluirCategoria(categoria),
    onSuccess: () => {
        queryClient.invalidateQueries({
            queryKey: ["categorias"]
        });
        queryClient.invalidateQueries({
            queryKey: ["dashboard"]
        });
        setCategoria("");
        setNome("");
        setDescricao("");
        handleClose();
    },
    onError: (error) => {
        alert(error.message);
    }
});

    const {
    data: categorias = []
} = useQuery({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
    enabled: open
});

function handleSelecionarCategoria(event) {
    const id = event.target.value;
    setCategoria(id);

    const categoriaSelecionada = categorias.find(item => item.id === id);

    if(categoriaSelecionada){
        setNome(categoriaSelecionada.nome);
        setDescricao(categoriaSelecionada.descricao ?? "");
    }
}

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
                      onChange={handleSelecionarCategoria}
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
                        label='Nome da Categoria'
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
                                type='button'
                                variant='contained'
                                color='error'
                                disabled={excluirMutation.isPending}
                                onClick={() => {
                                    const confirmar = window.confirm(
                                        "Deseja realmente excluir esta categoria?"
                                    );
                                    if(confirmar){
                                        excluirMutation.mutate();
                                    }
                                }}
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
