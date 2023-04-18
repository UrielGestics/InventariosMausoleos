import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Captura = () => {
    const [obscuro, setobscuro] = useState()
    const [proveedores, setproveedores] = useState([])
    const [artProveedores, setartProveedores] = useState([])
    const [material, setmaterial] = useState([])
    const [colores, setcolores] = useState([])
    const [tonalidades, settonalidades] = useState([])

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
        obtenerProveedores()
        obtenerMateriales()
        obtenerColores()
        obtenerTonalidades()
    }, [])

    //Validar Usuario Logeado
    const navigate = useNavigate();

    useEffect(() => {
        validarNotLoggedPage()
    })

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const obtenerProveedores = () =>{
        fetch(`${apiURL}proveedores.php?tipo=obtenerTodosProveedores`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setproveedores(finalResp[0])
        })
    } 

    const cambioSelectProveedores = (event) =>{
        const proovedorID = event.target.value
        //setartProveedores
        setartProveedores([])
        fetch(`${apiURL}proveedores.php?tipo=obtenerArtProveedor&provedorID=${proovedorID}`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            if(finalResp.estatus){
                setartProveedores(finalResp[0])
            }
        })
    }

    const obtenerMateriales = () => {
        setartProveedores([])
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodosMateriales`)
            .then(async(resp) => {
                const finalResp = await resp.json();
                setmaterial(finalResp[0]) 
            })
    }

    const obtenerColores = () => {
        setartProveedores([])
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodosColores`)
            .then(async(resp) => {
                const finalResp = await resp.json();
                setcolores(finalResp[0]) 
            })
    }

    const obtenerTonalidades = () => {
        setartProveedores([])
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodasTonalidades`)
            .then(async(resp) => {
                const finalResp = await resp.json();
                settonalidades(finalResp[0]) 
            })
    }

  return (
       <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Captura' />
      
      
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Captura De Inventarios</h3>
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
        <Select labelId="labelProveedor" id="selectProveedor" label="Proveedor" onChange={cambioSelectProveedores}>
            {proveedores.map(({Nombre_Proveedor,ID_Proveedor}, idx) =>{
                return(
                <MenuItem value={ID_Proveedor}>{Nombre_Proveedor}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Aritculo Del Proveedor</InputLabel>
        <Select labelId="labelArticuloProveedor" id="selectArticuloProveedor" label="Arituclo Del Proveedor">
            {artProveedores.map(({ID_ArticuloXProveedor,Nombre_Articulo}, idx) =>{
                return(
                <MenuItem value={ID_ArticuloXProveedor}>{Nombre_Articulo}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Materiales</InputLabel>
        <Select labelId="labelMateriales" id="selectMateriales" label="Materiales">
            {material.map(({ID_Material,Nombre_Material}, idx) =>{
                return(
                <MenuItem value={ID_Material}>{Nombre_Material}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Colores</InputLabel>
        <Select labelId="labelColores" id="selectColores" label="Colores">
            {colores.map(({ID_Color,Nombre_Color}, idx) =>{
                return(
                <MenuItem value={ID_Color}>{Nombre_Color}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tonalidades</InputLabel>
        <Select labelId="labelTonalidades" id="selectTonalidades" label="Tonalidades">
            {tonalidades.map(({ID_Tonalidad,Nombre_Tonalidad}, idx) =>{
                return(
                <MenuItem value={ID_Tonalidad}>{Nombre_Tonalidad}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>

     
      </Box>
    </Box>
        </ThemeProvider>
  )
}
