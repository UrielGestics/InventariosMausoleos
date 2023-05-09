import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//QR
import { QrReader } from 'react-qr-reader';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';

//SweetAlert
import Swal from 'sweetalert2';

//QRious
import { QRious } from 'react-qrious'



//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Movimientos = () => {
  const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [data, setData] = useState('');
    const [camOpen, setCamOpen] = useState(false);


    const darkTheme = createTheme({
        palette: {
            mode: obscuro,
        },
    });

    const validarModoOscuro = () => {
        if(localStorage.oscuro == 'true') {
            localStorage.oscuro = 'true'
            setobscuro('dark')
        }else{
            localStorage.oscuro = 'false'
            setobscuro('light')
        } 
    }

    useEffect(() => {
        validarModoOscuro()
        validarNotLoggedPage()
    }, [])
    
    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

  const leerQR = ()=>{
    setCamOpen(!camOpen)

  }
  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Movimientos' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Movimientos</h3>
    <FormControl fullWidth>
    <Button variant="contained" onClick={leerQR} style={{height: '300px', backgroundColor: '#BAA247'}} size="large"><i style={{color:'white', fontSize: '150px'}} className="bi bi-camera"></i></Button>
      </FormControl>
      <hr />
      {(camOpen) ?
      <>
      <QrReader
      constraints={{ facingMode: 'environment' }}
      onResult={(result, error) => {
        if (!!result) {
          setData(result?.text);
        }

        if (!!error) {
          console.info(error);
        }
      }}
      style={{ width: '100%' }}
    />
    <p>{data}</p>
    <hr />
      </>
      :
      ''
      }
    <FormControl fullWidth>
      <InputLabel >Codigo QR</InputLabel>
          <FilledInput id="codigoQR" type='text'/>
      </FormControl>
  </Box>
</Box>
    </ThemeProvider>
  )
}