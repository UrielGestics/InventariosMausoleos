import React, { useEffect, useState } from 'react'

import { useNavigate, useParams } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';

import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Switch from '@mui/material/Switch';

//SweetAlert
import Swal from 'sweetalert2';


//Funciones Propias
import { apiURL } from '../functiones'

import { BarraSuperior }  from '../components/barraSuperios';

export const EditarArticulos = () => {
  const mOscuro = localStorage.oscuro
  const [obscuro, setobscuro] = useState()
  const [artiuclos, setArtiuclos] = useState([])
  const [ordenCompra, setOrdenCompra] = useState('')
  const [precio, setPrecio] = useState('')
  const [plazas, setplazas] = useState([])
  const [plazaArticulo, setplazaArticulo] = useState('')
  const [sucursales, setsucursales] = useState([])
  const [sucursalArticulo, setsucursalArticulo] = useState('')
  let { id } = useParams();

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
    obtenerDatosArticulos()
    obtenerPlazas()
}, [])

const  validarNotLoggedPage = () => {
  if (localStorage.logged == undefined) {
      navigate('/login')
  }
}

const obtenerDatosArticulos =() =>{
  Swal.showLoading()
  fetch(`${apiURL}articulos.php?tipo=obtenerTodosArticulosPorID&ID=${id}`)
  .then(async(resp) =>{
    const finalResp = await resp.json()
    Swal.close()
    setArtiuclos(finalResp[0][0])
    setOrdenCompra(finalResp[0][0].Orden_Compra)
    setPrecio(finalResp[0][0].Costo)
    setplazaArticulo(finalResp[0][0].ID_Plaza)
    setsucursalArticulo(finalResp[0][0].ID_Sucursal)
    obtenerSucursalesPlaza(finalResp[0][0].ID_Plaza)
  })
  .catch(err =>{
    Swal.close()
    Swal.fire('Error','Hubo un error recarga la página','error')
  })
}

const obtenerPlazas = ()=>{
  fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
  .then(async(resp) =>{
      const finalResp = await resp.json();
      setplazas(finalResp[0])
      
  })
}

const obtenerSucursalesPlaza = (ID_Plaza)=>{
  fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPorPlazas&id=${ID_Plaza}`)
      .then(async(res) =>{
        const finalResp2 = await res.json()
        setsucursales(finalResp2[0])

      })
}

//Validar Usuario Logeado
const navigate = useNavigate();

const guardarDatosArticulo = () =>{
  Swal.showLoading()
  let formData = new FormData()
  formData.append("plazaArticulo",plazaArticulo)
  formData.append("sucursalArticulo",sucursalArticulo)
  formData.append("ordenCompra",ordenCompra)
  formData.append("precio",precio)
  formData.append("ID",id)
  formData.append("tipo","actualizarCaptura")

  fetch(`${apiURL}articulos.php`,{
    method: 'post',
    body: formData
  })
  .then(async(resp)=>{
    const finalResp = await resp.json()
    if(finalResp.estatus){
      Swal.fire('Exito',finalResp.mensaje,'success')
    }else{
      Swal.fire('Error','Hubo un error, favor de reintentar','error')
    }
  })
  .catch(err =>{
    Swal.fire('Error','Hubo un error, favor de reintentar '+err,'error')
  })
}

const cambioSelectSucursales = (event) =>{
  setplazaArticulo(event.target.dataset.value)
  obtenerSucursalesPlaza(event.target.dataset.value)
}

const cambioSelectSucursales2 = (event) =>{
  setsucursalArticulo(event.target.dataset.value)
}

const regresar = () =>{
  navigate('/articulos')
}

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Administrador' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Edición De Articulo { artiuclos.Nombre_Proveedor } - { artiuclos.Nombre_Articulo }</h3>
  <FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Plaza</InputLabel>
    <Select onChange={() => cambioSelectSucursales(event)} value={plazaArticulo}  labelId="labelProveedor" id="selectSucursales" label="Proveedor">
            {plazas.map(({ID_Plaza,Plaza,Clave_Plaza}, idx) =>{
                return(
                 <MenuItem data-clave={Clave_Plaza} key={ID_Plaza} value={ID_Plaza}>{Plaza}</MenuItem>
                
                
                );
            })}

        </Select>
  </FormControl>
  <hr />
<FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Sucursal</InputLabel>
    <Select onChange={() => cambioSelectSucursales2(event)} value={sucursalArticulo}  labelId="labelProveedor" id="selectSucursales" label="Proveedor">
            {sucursales.map(({ID_Sucursal,Nombre_Sucursal,Clave_Sucursal}, idx) =>{
                return(
                 <MenuItem data-clave={Clave_Sucursal} key={ID_Sucursal} value={ID_Sucursal}>{Nombre_Sucursal}</MenuItem>
                
                
                );
            })}

        </Select>
  </FormControl>
  <hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='estadoUsuario'>Orden De Compra</InputLabel>
    <FilledInput  id="estadoUsuario" type='text'  onChange={(e) => {setOrdenCompra( e.target.value)}} value={ordenCompra}/>
  </FormControl>
  <hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='plazaArticulo'>Precio</InputLabel>
    <FilledInput  id="plazaArticulo" type='number' onChange={(e) => {setPrecio(e.target.value)}} value={precio}/>
  </FormControl>
  <hr />
        <Button  className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} onClick={guardarDatosArticulo} size="large"><b>Guardar</b></Button>
        <hr />       
        <Button  className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} onClick={regresar} size="large"><b>Regresar</b></Button>       
  </Box>
  
</Box>
    </ThemeProvider>
  )
}
