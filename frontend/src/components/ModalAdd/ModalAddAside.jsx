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


// Modal para cadastrar um novo produto
export default function ModalAddAside({ open, handleClose }) {
  // Estados controlados de cada campo do formulário
  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [quantidadeTotal, setQuantidadeTotal] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [tempoDuracaoEmDias, setTempoDuracaoEmDias] = useState("");

  // Estado do arquivo de imagem selecionado e da URL de pré-visualização
  const [foto, setFoto] = useState(null);
  const [previewFoto, setPreviewFoto] = useState(null);

  // Envia o formulário para criar o item
  function handleSubmit(event) {
        event.preventDefault(); // evita reload da página

        // Usa FormData porque o backend espera multipart/form-data (por conta do upload de imagem)
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
        // Só anexa a foto se o usuário tiver selecionado uma
        if (foto){
          formData.append(
            "foto",
            foto
          );
        }  
        // Dispara a mutação de criação
        criarMutation.mutate(formData);
    }

    const queryClient =
    useQueryClient();

    // Trata a seleção de arquivo de imagem, com validações de tipo e tamanho
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

      // Bloqueia formatos não permitidos
      if (
          !tiposPermitidos.includes(
              arquivo.type
          )
      ) {
          alert("Use JPG, PNG ou WEBP.");
          return;
      }

      // Bloqueia arquivos maiores que 5 MB
      if (
          arquivo.size >
          5 * 1024 * 1024
      ) {
          alert("A imagem deve ter no máximo 5 MB.");
          return;
      }

    setFoto(arquivo);

    // Cria uma URL temporária local para pré-visualizar a imagem antes de enviar
    setPreviewFoto(
        URL.createObjectURL(
            arquivo
        )
    );
}

// Busca a lista de categorias do usuário para preencher o <Select>
const {
    data: categorias = []
} = useQuery({

    queryKey: ["categorias"],

    queryFn: listarCategorias,

    // Só busca quando o modal estiver aberto.
    enabled: open
});

// Mutação responsável por criar o item no backend
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
            {/* Área de upload/pré-visualização da imagem do produto */}
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
                  {/* Input de arquivo escondido; acionado através do <label> abaixo */}
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

            {/* Formulário com os dados do produto */}
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

                {/* Select de categoria, populado com os dados vindos da API */}
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
