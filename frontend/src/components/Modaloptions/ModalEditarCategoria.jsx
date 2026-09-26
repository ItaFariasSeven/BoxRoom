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

// Modal para editar ou excluir uma categoria existente.
// Diferente do ModalEdit de itens, aqui o usuário escolhe a categoria dentro do próprio modal
// (não recebe o item já selecionado por prop)
export default function ModalEditarCategoria({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState(""); // guarda o ID da categoria selecionada no Select
  const [descricao, setDescricao] = useState("");

  // Envia o formulário para atualizar a categoria selecionada
  function handleSubmit(event) {
        event.preventDefault();

        const dados = {
            nome,
            descricao,
        };

        atualizarMutation.mutate(dados);
    }

    const queryClient = useQueryClient();

    // Mutação de atualização: usa o ID da categoria selecionada (state "categoria") + os novos dados
    const atualizarMutation = useMutation({
    mutationFn: (dados) =>
        atualizarCategoria(
            categoria,
            dados
        ),
    onSuccess: () => {
        // Atualiza categorias, itens (pois exibem categoria_nome) e o dashboard
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

// Mutação de exclusão da categoria selecionada
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
        // Limpa a seleção e os campos após excluir
        setCategoria("");
        setNome("");
        setDescricao("");
        handleClose();
    },
    onError: (error) => {
        alert(error.message);
    }
});

    // Busca a lista de categorias para popular o <Select>
    const {
    data: categorias = []
} = useQuery({
    queryKey: ["categorias"],
    queryFn: listarCategorias,
    enabled: open
});

// Quando o usuário escolhe uma categoria no Select, preenche automaticamente
// os campos "nome" e "descricao" com os dados dessa categoria
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

                {/* Select para escolher qual categoria será editada/excluída */}
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

                {/* Só exibe os campos de edição e os botões depois que uma categoria for escolhida */}
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
                                type='button' // evita disparar o submit do form
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
