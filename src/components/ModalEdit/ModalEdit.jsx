import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import './ModalEdit.css';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#fff',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function BasicModal({ open, handleClose }) {
  return (
    <Modal
      open={open} 
      onClose={handleClose} 
    >
      <Box sx={style}>
         <Typography>Tela de Edição do Produto</Typography>
      </Box>
    </Modal>
  );
}
