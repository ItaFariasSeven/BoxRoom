import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalAddAsideModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';
import { criarItem, listarCategorias } from '../../services/api';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";


export default function ModalAddAside({ open, handleClose }) {

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
        criarMutation.mutate(formData);
    }

    const queryClient =
    useQueryClient();

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


const {
    data: categorias = []
} = useQuery({

    queryKey: ["categorias"],

    queryFn: listarCategorias,

    // Só busca quando o modal estiver aberto.
    enabled: open
});


const criarMutation =
    useMutation({
        mutationFn: criarItem,
        onSuccess: () => {

            // Atualiza os Cards.
            queryClient.invalidateQueries({
                queryKey: ["itens"]
            });

            // Atualiza o dashboard.
            queryClient.invalidateQueries({
                queryKey: ["dashboard"]
            });

            // Limpa os campos.
            setNome("");
            setCategoria("");
            setValorUnitario("");
            setLinkCompra("");
            setQuantidadeTotal("");
            setQuantidadeMinima("");
            setTempoDuracaoEmDias("");

            // Fecha o modal.
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
        <Box className='container-modal'>
           <div className='container-title'>
             <h1 className='title-modal'>Cadastrar produto</h1>
           </div>

          <div className="container-info-product">
            <div>
              <img 
                className='photo'
                src={
                  previewFoto
                  || ImagemProduct
                }
                alt="Imagem do Produto"
                />

                <div className='input-cadastrar-product'>
                  <input
                      id="foto-produto"
                      type='file'
                      accept='
                          image/jpeg,
                          image/png,
                          image/webp,
                      '
                      hidden
                      onChange={handleSelecionarFoto}
                  />
                  <label htmlFor='foto-produto'>
                      <Button
                          component='span'
                          variant='outlined'
                      >
                          Escolher imagem
                      </Button>
                  </label>
                </div>
              </div>


            <Box
              className='form-add'
              component='form'
              onSubmit={handleSubmit}
            >
                <TextField
                  required
                  label='Nome do Produto'
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  />

                <FormControl required fullWidth>
                    <InputLabel id='categoria-label'>
                        Categoria
                    </InputLabel>
                    <Select
                      labelId='categoria-label'
                      label='Categoria'
                      value={categoria}
                      onChange={(event) => setCategoria(event.target.value)}
                    >
                      {categorias.map((categoria) =>(
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
                  required
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
                  required
                  label='Quantidade Total'
                  type='number'
                  inputProps={{
                    min: 0,
                    step: 1
                  }}
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

              <Button
                type='submit'
                variant='contained'
              >
                Salvar
              </Button>
            </Box>
          </div>

        </Box>

    </Modal>
  );
}
