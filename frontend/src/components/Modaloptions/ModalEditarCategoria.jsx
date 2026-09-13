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
  const [valorUnitario, setValorUnitario] = useState("");
  const [linkCompra, setLinkCompra] = useState("");
  const [quantidadeTotal, setQuantidadeTotal] = useState("");
  const [quantidadeMinima, setQuantidadeMinima] = useState("");
  const [tempoDuracaoEmDias, setTempoDuracaoEmDias] = useState("");

  function handleSubmit(event) {
        event.preventDefault();

        const produto = {
            nome: nome,
            categoria: categoria,
            valorUnitario: valorUnitario,
            linkCompra: linkCompra,
            quantidadeTotal: quantidadeTotal,
            quantidadeMinima: quantidadeMinima,
            tempoDuracaoEmDias: tempoDuracaoEmDias
        };

        console.log(produto);
    }

  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
        <Box className='container-modal-edit-categoria'>
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
                      <MenuItem value="limpeza">
                        Limpeza
                      </MenuItem>
                      <MenuItem value="higiene">
                        Higiene
                      </MenuItem>
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
                  label='Qantidade Mínima'
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
