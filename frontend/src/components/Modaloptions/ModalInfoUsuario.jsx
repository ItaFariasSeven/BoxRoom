import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalInfoUsuarioModule.css';
import ImagemProduct from '../../assets/Nav/user.png'
import { InputLabel, MenuItem, Select, TextField, FormControl } from '@mui/material';
import { useState } from 'react';


export default function ModalInfoUsuario({ open, handleClose }) {

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
        <Box className='container-modal-info-usuario'>
           <div className='container-title'>
             <h1 className='title-modal'>Informações do Usuário</h1>
           </div>

          <div className="container-info-product">
            <div>
              <img className='photo'
                src={ImagemProduct}
                alt="Imagem do Produto"
                />
            </div>

            <Box
              className='form-user'
              component='form'
              onSubmit={handleSubmit}
            >
                <TextField
                  label='Nome do Produto'
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  />

              <div className='conatiner-button-user'>
                  <Button
                    className='button-delete-user'
                    type='submit'
                    variant='contained'
                  >
                    Excluir conta
                  </Button>
                  <Button
                    className='button-save-user'
                    type='submit'
                    variant='contained'
                  >
                    Salvar
                  </Button>
              </div>
            </Box>
          </div>

        </Box>

    </Modal>
  );
}
