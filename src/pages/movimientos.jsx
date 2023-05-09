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
    const [camOpen, setCamOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [tipo, setTipo] = useState('');
    const [color, setColor] = useState('');
    const [material, setMaterial] = useState('');
    const [ceremonia, setCeremonia] = useState('');
    const [artCeremonia, setArtCeremonia] = useState('');
    const [estatus, setEstatus] = useState('');


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
        //obtenerQR("120230502111503GAM-ESC-MAD-DPC")
    }, [])
    
    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

  const leerQR = ()=>{
    setCamOpen(!camOpen)
  }

  const obtenerQR= (codQRResult)=>{
    fetch(`${apiURL}articulos.php?tipo=obtenerArticuloQR&codQR=${codQRResult}`)
    .then(async(resp) => {
      const finalResp = await resp.json()
      console.log(finalResp)
      if(finalResp.estatus){
        setCamOpen(false)
        document.getElementById("codigoQR").value = codQRResult
        setNombre(finalResp[0][0].Clave_Articulo)
        setTipo(finalResp[0][0].Tipo_Articulo)
        setColor(finalResp[0][0].Nombre_Color)
        setMaterial(finalResp[0][0].Nombre_Material)
        setEstatus(finalResp[0][0].Estatus)
        setCeremonia(finalResp[0][0].Portafolio)
        setArtCeremonia(finalResp[0][0].Nombre_Articulo)
      }else{

      }
    })
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
          const codQRResult = result?.text
          //Consultar API ART CON COD QR
          obtenerQR(codQRResult)
        }

        if (!!error) {
          console.info(error);
        }
      }}
      style={{ width: '100%' }}
    />
    <hr />
      </>
      :
      ''
      }
    <FormControl fullWidth>
        <FilledInput id="codigoQR" placeholder='Codigo QR' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={nombre} readOnly placeholder='Nombre' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={tipo} readOnly placeholder='Tipo' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={color} readOnly placeholder='Color' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={material} readOnly placeholder='Material' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={estatus} readOnly placeholder='Estado' type='text'/>
    </FormControl>
    {(tipo == 'Ataud') ?
    <div>
      <hr />
    <FormControl fullWidth>
        <FilledInput value={ceremonia} readOnly placeholder='Ceremonia' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={artCeremonia} readOnly placeholder='Ceremonia' type='text'/>
    </FormControl>
    </div>
    : ''}
  </Box>
</Box>
    </ThemeProvider>
  )
}
