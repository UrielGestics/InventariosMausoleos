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
import Button from '@mui/material/Button';

//SweetAlert
import Swal from 'sweetalert2';

//QRious
import { QRious } from 'react-qrious'



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
    const [codQR, setcodQR] = useState('')

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

    const generarCaptura = () =>{
        if(document.getElementById('numberCantidad').value == 0 || document.getElementById('textNombreProducto').value == '' || proveedoresNombre == ''
           || artProveedoresNombre == '' || materialNombre == '' || coloresNombre == '' || tonalidadesNombre == ''){
            Swal.fire(
                'error',
                'Tienes que llenar todos los campos',
                'error'
              )
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
            }).then((result) => {
            })
            const proveedor = proveedores.filter(pro => pro.ID_Proveedor == proveedoresNombre)
                     const artProveedor = artProveedores.filter(pro => pro.ID_ArticuloXProveedor == artProveedoresNombre)
                     const materiales = material.filter(mat => mat.ID_Material == materialNombre)
                     const color = colores.filter(col => col.ID_Color == coloresNombre)
                     const tona = tonalidades.filter(to => to.ID_Tonalidad == tonalidadesNombre)
            
                    
                    let formData = new FormData();
                    formData.append('pro',proveedoresNombre);
                    formData.append('artProv',artProveedoresNombre);
                    formData.append('materiales',materialNombre);
                    formData.append('colores',coloresNombre);
                    formData.append('tonalidades',tonalidadesNombre);
                    formData.append('claveProducto',proveedor[0].Clave_Proveedor + '-' + artProveedor[0].Clave_Articulo+'-'+materiales[0].Clave_Material+'-'+color[0].Clave_Color+tona[0].Clave_Tonalidad);
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
                            'Exito',
                            mensaje,
                            'success'
                          )
                          setcodQR(proveedor[0].Clave_Proveedor + '-' + artProveedor[0].Clave_Articulo+'-'+materiales[0].Clave_Material+'-'+color[0].Clave_Color+tona[0].Clave_Tonalidad)
                        }else{
                          Swal.fire(
                            'Error',
                            mensaje,
                            'error'
                          )
                        }
                      })
                      .catch(err => {
                        Swal.fire(
                          'Error',
                          'Hubo un error, por favor intentalo de nuevo 2'+err,
                          'error'
                        )
                      })
        }
    }

    const imprimirQr = () =>{
        var win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
            win.document.write(document.getElementById("mainImg").outerHTML);     // Write contents in the new window.
            win.document.close();
            win.print();
            win.addEventListener("afterprint", (event) => {
                
                setTimeout(() => {
                  
                    window.location.reload()
                }, 1000);
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
            {proveedores.map(({Nombre_Proveedor,ID_Proveedor,Clave_Proveedor}, idx) =>{
                return(
                <MenuItem data-clave={Clave_Proveedor} key={ID_Proveedor} value={ID_Proveedor}>{Nombre_Proveedor} - {Clave_Proveedor}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Aritculo Del Proveedor</InputLabel>
        <Select labelId="labelArticuloProveedor" id="selectArticuloProveedor" label="Arituclo Del Proveedor" onChange={cambioSelectProveedoresArituclos}>
            {artProveedores.map(({ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo }, idx) =>{
                return(
                <MenuItem key={ID_ArticuloXProveedor} value={ID_ArticuloXProveedor}>{Nombre_Articulo} - {Clave_Articulo}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Materiales</InputLabel>
        <Select labelId="labelMateriales" id="selectMateriales" label="Materiales" onChange={cambioSelectMateriales}>
            {material.map(({ID_Material,Nombre_Material, Clave_Material}, idx) =>{
                return(
                <MenuItem key={ID_Material} value={ID_Material}>{Nombre_Material} - {Clave_Material}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Colores</InputLabel>
        <Select labelId="labelColores" id="selectColores" label="Colores" onChange={cambioSelectColores}>
            {colores.map(({ID_Color,Nombre_Color, Clave_Color}, idx) =>{
                return(
                <MenuItem key={ID_Color} value={ID_Color}>{Nombre_Color} - {Clave_Color}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tonalidades</InputLabel>
        <Select labelId="labelTonalidades" id="selectTonalidades" label="Tonalidades" onChange={cambioSelectTonalidade}>
            {tonalidades.map(({ID_Tonalidad,Nombre_Tonalidad, Clave_Tonalidad}, idx) =>{
                return(
                <MenuItem key={ID_Tonalidad} value={ID_Tonalidad}>{Nombre_Tonalidad} - {Clave_Tonalidad}</MenuItem>
                );
            })}
          
        </Select>
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
          <FilledInput id="numberCantidad" type='number'/>
      </FormControl>
      <hr />
      {(codQR == '') ?'' :<QRious id="mainImg" value={codQR} size={250}  foreground='black' level='H'  />}
      {(codQR == '') ? <Button onClick={generarCaptura} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Guardar</b></Button> 
      : <Button onClick={imprimirQr} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Imprimir</b></Button>}
     

      
  
      </Box>
    </Box>
        </ThemeProvider>
  )
}
