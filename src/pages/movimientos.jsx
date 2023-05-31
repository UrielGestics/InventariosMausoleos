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
  const mOscuro = localStorage.oscuro
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
    const [plaza, setplaza] = useState('')
    const [selectPlaza, setselectPlaza] = useState('')


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
        obtenerQR("120230502111914GAM-GAL-CER-ENM")
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
      if(finalResp.estatus){
        setCamOpen(false)
        document.getElementById("codigoQR").value = codQRResult
        setNombre(finalResp[0][0].Clave_Articulo)
        obtenerSucursalPlaza(finalResp[0][0].ID_Plaza)
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

  const obtenerSucursalPlaza = (plaza2)=>{
    fetch(`${apiURL}plazas.php?tipo=obtenerSucursalesPlazas&ID_Plaza=${plaza2}`)
    .then(async(resp) => {
      const finalResp = await resp.json()
      if(finalResp.estatus){
        setplaza(finalResp[0])
        //setselectPlaza(JSON.stringify(finalResp[0][0]))
        let option  = '';
        finalResp[0].map(({ID_Sucursal,Nombre_Sucursal}) =>{
          option += `<option value='${ID_Sucursal}'>${Nombre_Sucursal}</option>`
          
        })
        setselectPlaza(option)
        
      }else{}
    })
  }

  const moverSucursal = ()=>{
    Swal.fire({
      allowOutsideClick: false,
      title: `Mover a Sucursal`,
      html: `<label>Sucursal</label>
      <br />
      <select class="form-select" id="plaza" aria-label="Default select example">
        ${selectPlaza}
        </Select>
      <hr>
      <label>Motivo</label>
      <br />
      <select class="form-select" id="motivo" aria-label="Default select example">
        <option value='Salida Temporal'>Salida Temporal</option>
        <option value='Entrada'>Entrada</option>
        <option value='Salida'>Salida</option>
        <option value='Baja'>Baja</option>
        </Select>
      `,
      confirmButtonText: 'Mover',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isDismissed){
        Swal.fire('Accion Cancelada', 'No Se Realizo la acción', 'error')
      }else{
        
          const motivo = Swal.getPopup().querySelector('#motivo').value
          const plaza = Swal.getPopup().querySelector('#plaza').value
          if (!motivo || !plaza) {
            Swal.showValidationMessage(`Porfavor llena toda la información`)
          }else{
            let timerInterval
        Swal.fire({
          title: 'Cargando',
          html: `<div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>`,
          timer: 2000,
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()
            
            timerInterval = setInterval(() => {
             
            }, 100)
          },
          willClose: () => {
            clearInterval(timerInterval)
          }
        }).then((result) => {})
            //Hacer Petición API
            console.log(motivo,plaza,localStorage.id)
          }
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
          //obtenerQR(codQRResult)
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
    <hr />
    <FormControl fullWidth>
    <Button onClick={moverSucursal} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Mover a Sucursal</b></Button>
    </FormControl>
    </div>
    : ''}
  </Box>
</Box>
    </ThemeProvider>
  )
}
