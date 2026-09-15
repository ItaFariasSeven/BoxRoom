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


export default function ModalAddAside({ open, handleClose }) {

  const [nome, setNome] = useState("");
  const [categoria, setCategoria] = useState("");
  const [valorUnitario, setValorUnitario] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [quantidadeTotal, setQuantidadeTotal] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [tempoDuracaoEmDias, setTempoDuracaoEmDias] = useState("");

  function handleSubmit(event) {
        event.preventDefault();

        const produto = {
            nome,
            categoria: Number(categoria),
            valor_unitario: valorUnitario,
            link_compra: linkCompra,
            quantidade_total: Number(quantidadeTotal),
            quantidade_minima: Number(quantidadeMinima),
            tempo_duracao_unidade: Number(tempoDuracaoEmDias)
          };
          criarMutation.mutate(produto)
    }

    const queryClient =
    useQueryClient();


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
              <img className='photo'
                src={ImagemProduct}
                alt="Imagem do Produto"
                />
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
                      {categorias.map((categoria) =>(
                      <MenuItem
                        key={categoria.id}
                        value={categoria.id}
                      >
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
