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

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const AgregarUsuario = () => {
    const mOscuro = localStorage.oscuro
    const [obscuro, setobscuro] = useState()
    const [plazas, setplazas] = useState([])
    const [plazasNombre, setplazasNombre] = useState('')
    const [sucursales, setsucursales] = useState([])
    const [sucursalUSR, setsucursalUSR] = useState('')
    const [plazaUSR, setplazaUSR] = useState('')

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

    const obtenerPlazas = ()=>{
        fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setplazas(finalResp[0])
        })
    } 

    useEffect(() => {
        validarModoOscuro()
        validarNotLoggedPage()
        obtenerPlazas()
    }, [])
     //Validar Usuario Logeado
     const navigate = useNavigate();

     const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const guardarDatosUsuario = () =>{
        //Datos Normales
        const nombreUsuario = document.getElementById("nombreUsuario").value
        const correoUsuario = document.getElementById("correoUsuario").value
        const claveUsuario = document.getElementById("claveUsuario").value
        //Permisos
        const PPanelAdministracion = document.getElementById("PPanelAdministracion").checked
        const PTodasPlazas = document.getElementById("PTodasPlazas").checked
        const PReportes = document.getElementById("PReportes").checked
        const PTodasSucursales = document.getElementById("PTodasSucursales").checked
        const PInventarioPlaza = document.getElementById("PInventarioPlaza").checked
        const PCaptura = document.getElementById("PCaptura").checked
        const PRecepcion = document.getElementById("PRecepcion").checked
        const PConsulta = document.getElementById("PConsulta").checked
        const PMovimientos = document.getElementById("PMovimientos").checked
        const Pcatalogos = document.getElementById("Pcatalogos").checked

        if(nombreUsuario == '' || correoUsuario == '' || claveUsuario == '' || sucursalUSR == '' || plazasNombre == ''){
          Swal.fire('Error','Nesecitas llenar todos los datos','error')
        }else{
          Swal.showLoading()
          let formData = new FormData()
          formData.append("nombreUsuario",nombreUsuario)
          formData.append("correoUsuario",correoUsuario)
          formData.append("claveUsuario",claveUsuario)
  
          formData.append("sucursalUSR",sucursalUSR)
          formData.append("plazasNombre",plazasNombre)
  
          formData.append("PPanelAdministracion",PPanelAdministracion)
          formData.append("PTodasPlazas",PTodasPlazas)
          formData.append("PReportes",PReportes)
          formData.append("PTodasSucursales",PTodasSucursales)
          formData.append("PInventarioPlaza",PInventarioPlaza)
          formData.append("PCaptura",PCaptura)
          formData.append("PConsulta",PConsulta)
          formData.append("PMovimientos",PMovimientos)
          formData.append("Pcatalogos",Pcatalogos)
          formData.append("PRecepcion",PRecepcion)
          
          formData.append("tipo","DarUsuarioAlta")
  
          fetch(`${apiURL}usuarios.php`,{
            method: 'POST',
            body: formData
          })
          .then(async(resp) =>{
            const finalResp = await resp.json();
            console.log(finalResp)
            if(!finalResp.estatus){
              Swal.fire(
                'Error',
                finalResp.mensaje,
                'error'
              )
            }else{
              Swal.fire('Exito',finalResp.mensaje,'success')
              .then(resp =>{
               navigate('/usuarios')
              })
            }
          })
        }

       
        
    //    sucursalUSR
    //    plazasNombre
        
    }

    const cambioSelectPlazas = (event) =>{
        setplazasNombre(event.target.value)

        fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPorPlazas&id=${event.target.value}`)
            .then(async(res) =>{
              const finalResp2 = await res.json()
              setsucursales(finalResp2[0])
              // console.log(finalResp2[0])
            })
    }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='datosUsuario' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Alta De usuarios</h3>
    <FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Nombre De Usuario</InputLabel>
    <FilledInput  id="nombreUsuario" type='text'/>
  </FormControl>
<hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='correoUsuario'>Correo</InputLabel>
    <FilledInput  id="correoUsuario" type='text'/>
  </FormControl>
  <hr />
<FormControl fullWidth>
    <InputLabel htmlFor='claveUsuario'>Clave</InputLabel>
    <FilledInput  id="claveUsuario" type='password'/>
  </FormControl>
  <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Plaza</InputLabel>
        <Select labelId="labelProveedor" id="selectPlazas" label="Proveedor" onChange={cambioSelectPlazas}>
            {plazas.map(({ID_Plaza,Plaza,Clave}, idx) =>{
                return(
                <MenuItem data-clave={Clave} key={ID_Plaza} value={ID_Plaza}>{Plaza}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
  <hr />
  <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sucursal </InputLabel>
        <Select value={sucursalUSR} onChange={(e) => {setsucursalUSR( e.target.value)}} labelId="labelProveedor" id="selectSucursales" label="Proveedor">
            {sucursales.map(({ID_Sucursal,Nombre_Sucursal,Clave_Sucursal}, idx) =>{
                return(
                 <MenuItem data-clave={Clave_Sucursal} key={ID_Sucursal} value={ID_Sucursal}>{Nombre_Sucursal}</MenuItem>
                
                
                );
            })}

        </Select>
      </FormControl>
  <hr />
  {/* sucursalesUsuarioConsulta */}

  <h3 className="text-center">Lista De Permisos</h3>
  <FormGroup>
  <FormControlLabel  control={<Switch id="PPanelAdministracion" />} label="Panel De Administración" />
  <FormControlLabel control={<Switch id="PTodasPlazas" />} label="Todas Las Plazas" />
  <FormControlLabel control={<Switch id="PReportes" />} label="Reportes" />
  <FormControlLabel control={<Switch id="PTodasSucursales" />} label="Todas Las Sucursales" />
  <FormControlLabel control={<Switch id="PInventarioPlaza" />} label="Inventario Plaza" />
  <FormControlLabel control={<Switch id="PCaptura" />} label="Captura" />
  <FormControlLabel control={<Switch id="PRecepcion" />} label="Recepción" />
  <FormControlLabel control={<Switch id="PConsulta" />} label="Consulta" />
  <FormControlLabel control={<Switch id="PMovimientos" />} label="Movimientos" />
  <FormControlLabel control={<Switch id="Pcatalogos" />} label="Catálogos" />
         
   
        </FormGroup>
        <br />
        <Button  className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} onClick={guardarDatosUsuario} size="large"><b>Guardar</b></Button>       
  </Box>
  
</Box>
    </ThemeProvider>
  )
}
