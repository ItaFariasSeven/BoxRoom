import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalEditModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState, useEffect } from 'react';

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { listarCategorias, atualizarItem, excluirItem } from "../../services/api";


export default function ModalEdit({ open, handleClose, item }) {

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [quantidadeTotal, setQuantidadeTotal] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [tempoDuracaoEmDias, setTempoDuracaoEmDias] = useState("");
  
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  function handleSubmit(event) {
        event.preventDefault();

        const formData = new FormData();

        formData.append(
          "nome",
          nome
        )
        formData.append(
          "categoria",
          categoria
        )
        formData.append(
          "valor_unitario",
          valorUnitario
        )
        formData.append(
          "link_compra",
          linkCompra
        )
        formData.append(
          "quantidade_total",
          quantidadeTotal
        )
        formData.append(
          "quantidade_minima",
          quantidadeMinima
        )
        formData.append(
          "tempo_duracao_unidade",
          tempoDuracaoEmDias
        )
        if (foto){
          formData.append(
            "foto",
            foto
          );
        }
        atualizarMutation.mutate(formData);
    }

  function handleSelecionarFoto(event) {
      const arquivo =
          event.target.files?.[0];
      
      if (!arquivo) {
          return;
      }
    
      const tiposPermitidos = [
          "image/jpeg",
          "image/png",
          "image/webp"
      ];
    
      if (
          !tiposPermitidos.includes(
              arquivo.type
          )
      ) {
          alert("Use JPG, PNG ou WEBP.");
          return;
      }
    
      if (
          arquivo.size >
          5 * 1024 * 1024
      ) {
          alert("A imagem deve ter no máximo 5 MB.");
          return;
      }

    setFoto(arquivo);

    setPreviewFoto(
        URL.createObjectURL(
            arquivo
        )
    );
}


    const queryClient = useQueryClient();

    const atualizarMutation = useMutation({
        mutationFn: (produto) =>
            atualizarItem( item.id, produto ),
        onSuccess: () => {
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
            excluirItem( item.id ),
        onSuccess: () => {
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

    useEffect(() => {
        if (!item) {
            return;
        }
        // Quando abrir o modal, preenche automaticamente os campos com os dados atuais do produto.
        setNome(
            item.nome ?? ""
        );
        setCategoria(
            item.categoria ?? ""
        );
        setValorUnitario(
            item.valor_unitario ?? ""
        );
        setLinkCompra(
            item.link_compra ?? ""
        );
        setQuantidadeTotal(
            item.quantidade_total ?? ""
        );
        setQuantidadeMinima(
            item.quantidade_minima ?? ""
        );
        setTempoDuracaoEmDias(
            item.tempo_duracao_unidade ?? ""
        );
        setFoto(null);
        setPreviewFoto(null);
}, [item, open]);

useEffect(() => {
    return () => {
        if (previewFoto) {
            URL.revokeObjectURL(
                previewFoto
            );
        }
    };
}, [previewFoto]);

const {data: categorias = []} = useQuery({queryKey:["categorias"], queryFn:listarCategorias, enabled: open});

  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
        <Box className='container-modal'>
           <div className='container-title'>
             <h1 className='title-modal'>Editar Produto</h1>
           </div>

          <div className="container-info-product">
            <div>
              <img className='photo'
                src={
                    previewFoto
                    || item?.foto 
                    || ImagemProduct
                }
                alt="Imagem do Produto"
                />

                <input
                    id={`foto-produto-${item?.id ?? "novo"}`}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    hidden
                    onChange={handleSelecionarFoto}
                />
    
                <label
                    htmlFor={`foto-produto-${item?.id ?? "novo"}`}
                >
                    <Button
                        component="span"
                        variant="outlined"
                    >
                        Alterar imagem
                    </Button>
                </label>
            </div>

            <Box
              className='form-add'
              component='form'
              onSubmit={handleSubmit}
            >
                <TextField
                  label='Nome do Produto'
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  />

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
                    {categorias.map((categoria) => (
                      <MenuItem 
                        key={categoria.id}
                        value={categoria.id}
                      >
                        {categoria.nome}
                      </MenuItem>
                    ))}
                    </Select>
                </FormControl>

                <TextField
                  label='Valor Unitário'
                  type='number'
                  value={valorUnitario}
                  onChange={(event) => setValorUnitario(event.target.value)}
                />
                <TextField
                  label='Link de Compra'
                  value={linkCompra}
                  onChange={(event) => setLinkCompra(event.target.value)}
                  />
                <TextField
                  label='Quantidade Total'
                  type='number'
                  value={quantidadeTotal}
                  onChange={(event) => setQuantidadeTotal(event.target.value)}
                  />
                <TextField
                  label='Quantidade Mínima'
                  type='number'
                  value={quantidadeMinima}
                  onChange={(event) => setQuantidadeMinima(event.target.value)}
                  />
                <TextField
                  label='Tempo de Duração em Dias'
                  type='number'
                  value={tempoDuracaoEmDias}
                  onChange={(event) => setTempoDuracaoEmDias(event.target.value)}
                />
                
                <>
                 <div className='container-button-edit-produto'>
                     <Button
                        className='button-delete-edit-produto'
                        type='button'
                        variant='contained'
                        color='error'
                        disabled={excluirMutation.isPending}
                        onClick={() =>{
                            const confirmar = window.confirm(
                                "Deseja realmente excluir este produto?"
                            );
                            if(confirmar){
                                excluirMutation.mutate();
                            }
                        }}
                    >
                      Excluir Produto
                    </Button>
                    <Button
                        className='button-salve-edit-produto'
                        type='submit'
                        variant='contained'
                        disabled={atualizarMutation.isPending}
                    >
                        {atualizarMutation.isPending
                            ? "Salvando..."
                            : "Salvar"
                        }
                    </Button>
                 </div>
                </>
            </Box>
          </div>

        </Box>

    </Modal>
  );
}
