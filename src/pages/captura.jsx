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
import FilledInput from '@mui/material/FilledInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';

//SweetAlert
import Swal from 'sweetalert2';



//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Captura = () => {
    const mOscuro = localStorage.oscuro
    const [obscuro, setobscuro] = useState()
    const [proveedores, setproveedores] = useState([])
    const [proveedoresNombre, setproveedoresNombre] = useState([])
    const [artProveedores, setartProveedores] = useState([])
    const [artProveedoresNombre, setartProveedoresNombre] = useState([])
    const [material, setmaterial] = useState([])
    const [materialNombre, setmaterialNombre] = useState([])
    const [colores, setcolores] = useState([])
    const [coloresNombre, setcoloresNombre] = useState([])
    const [tonalidades, settonalidades] = useState([])
    const [tonalidadesNombre, settonalidadesNombre] = useState([])
    const [claveProducto, setclaveProducto] = useState('')

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

    const cambioSelectTonalidade = (event) =>{
        settonalidadesNombre(event.target.value)
    }
    const cambioSelectColores = (event) =>{
        setcoloresNombre(event.target.value)
    }

    const cambioSelectMateriales = (event) =>{
        setmaterialNombre(event.target.value)
    }

    const cambioSelectProveedoresArituclos = (event) =>{
        setartProveedoresNombre(event.target.value)
    }

    const cambioSelectProveedores = (event) =>{
        const proovedorID = event.target.value
        setproveedoresNombre(event.target.value)
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

    const actualizarClaveProducto = () =>{
        //proveedoresNombre
        const proveedor = proveedores.filter(pro => pro.ID_Proveedor == proveedoresNombre)
        const artProveedor = artProveedores.filter(pro => pro.ID_ArticuloXProveedor == artProveedoresNombre)
        const materiales = material.filter(mat => mat.ID_Material == materialNombre)
        const color = colores.filter(col => col.ID_Color == coloresNombre)
        const tona = tonalidades.filter(to => to.ID_Tonalidad == tonalidadesNombre)
        if(proveedor.length > 0 && artProveedor.length > 0 && materiales.length > 0 && color.length > 0 && tona.length > 0){
            setclaveProducto(proveedor[0].Nombre_Proveedor.substr(0,3) + '-' + artProveedor[0].Nombre_Articulo.substr(0,3)+'-'+materiales[0].Nombre_Material.substr(0,3)+'-'+color[0].Nombre_Color.substr(0,2)+tona[0].Nombre_Tonalidad.substr(0,1))
        }else{
            Swal.fire(
                'error',
                'Tienes que llenar todos los datos para generar la clave',
                'error'
              )
        }
    }

    const generarCaptura = () =>{
        let formData = new FormData();
        formData.append('pro',proveedoresNombre);
        formData.append('artProv',artProveedoresNombre);
        formData.append('materiales',materialNombre);
        formData.append('colores',coloresNombre);
        formData.append('tonalidades',tonalidadesNombre);
        formData.append('claveProducto',claveProducto);
        formData.append('nombreProducto',document.getElementById('textNombreProducto').value);
        formData.append('cantidad',document.getElementById('numberCantidad').value);
        formData.append('nombreInterno',document.getElementById('textNombreInterno').value);
        formData.append('usuario',localStorage.id);
        formData.append('tipo','guardarCaptura');

        fetch(`${apiURL}articulos.php`,{
            method: 'post',
            body: formData
        })
        .then(async(resp) => {
            const {estatus,mensaje} = await resp.json();
            Swal.close()
            if(estatus == true){
              Swal.fire(
                'Succes',
                mensaje,
                'Succes'
              )
            }else{
              Swal.fire(
                'Error',
                'Hubo un error, por favor intentalo de nuevo',
                'error'
              )
            }
          })
          .catch(err => {
            Swal.fire(
              'Error',
              'Hubo un error, por favor intentalo de nuevo',
              'error'
            )
          })
    }

  return (
       <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Captura' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
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
        <Select labelId="labelArticuloProveedor" id="selectArticuloProveedor" label="Arituclo Del Proveedor" onChange={cambioSelectProveedoresArituclos}>
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
        <Select labelId="labelMateriales" id="selectMateriales" label="Materiales" onChange={cambioSelectMateriales}>
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
        <Select labelId="labelColores" id="selectColores" label="Colores" onChange={cambioSelectColores}>
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
        <Select labelId="labelTonalidades" id="selectTonalidades" label="Tonalidades" onChange={cambioSelectTonalidade}>
            {tonalidades.map(({ID_Tonalidad,Nombre_Tonalidad}, idx) =>{
                return(
                <MenuItem value={ID_Tonalidad}>{Nombre_Tonalidad}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Clave Del Producto</InputLabel>
          <FilledInput 
          readOnly 
          disabled 
          value={claveProducto} 
          id="textClaveProducto"
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={actualizarClaveProducto}
                edge="end"
              >
                <i class="bi bi-arrow-clockwise"></i>
              </IconButton>
            </InputAdornment>
          }
          />
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Nombre Del Producto</InputLabel>
          <FilledInput id="textNombreProducto"/>
      </FormControl> 
      <hr />
      <FormControl fullWidth>
      <InputLabel >Nombre Interno</InputLabel>
          <FilledInput id="textNombreInterno"/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Cantidad</InputLabel>
          <FilledInput value={1} type='number' id="numberCantidad"/>
      </FormControl>
      <hr />
      <Button onClick={generarCaptura} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Guardar</b></Button>         

      </Box>
    </Box>
        </ThemeProvider>
  )
}
