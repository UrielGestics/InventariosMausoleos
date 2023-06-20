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


export const Recepción = () => {
    const mOscuro = localStorage.oscuro
    const [obscuro, setobscuro] = useState()
    const [proveedores, setproveedores] = useState([])
    const [proveedoresNombre, setproveedoresNombre] = useState([])
    const [plazas, setplazas] = useState([])
    const [plazasNombre, setplazasNombre] = useState([])
    const [artProveedores, setartProveedores] = useState([])
    const [artProveedoresNombre, setartProveedoresNombre] = useState([])
    const [artCeremoniasNombre, setartCeremoniasNombre] = useState([])
    const [material, setmaterial] = useState([])
    const [materialNombre, setmaterialNombre] = useState([])
    const [colores, setcolores] = useState([])
    const [ceremonias, setceremonias] = useState([])
    const [coloresNombre, setcoloresNombre] = useState([])
    const [tonalidades, settonalidades] = useState([])
    const [tonalidadesNombre, settonalidadesNombre] = useState([])
    const [ceremoniaNombre, setceremoniaNombre] = useState([])
    const [ceremoniaNombre2, setceremoniaNombre2] = useState([])
    const [arregloQR, setarregloQR] = useState([])
    //setartCeremoniaNombre
    const [artCeremoniaNombre, setartCeremoniaNombre] = useState([])
    //const [claveProducto, setclaveProducto] = useState('')
    const [codQR, setcodQR] = useState('')
    const [tipo, settipo] = useState('')

    const nArt = ['Ceremonia'];

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

  
    const imprimirQr = () =>{
        var win = window.open('', '', 'height=700,width=700'); // Open the window. Its a popup window.
            win.document.write(document.getElementById("QRS").outerHTML);     // Write contents in the new window.
            win.document.close();
            win.print();
            win.addEventListener("afterprint", (event) => {
                
                setTimeout(() => {
                  
                    window.location.reload()
                }, 1000);
            })
    }

    const handleKeyPress = (event) => {
        if(event.code === 'Enter'){
          const valorCA = document.getElementById("ClaveArticulo").value
          //TODO Api para obtener valor
          fetch(`${apiURL}articulos.php?tipo=obtenerArtXCA&claveProducto=${valorCA}`)
          .then(async(resp)=>{
            const finalresp = await resp.json();
            const {Tipo_Articulo,ID_Proveedor,ID_Plaza,ID_ArticuloXProveedor,ID_Material,ID_Color,ID_Tonalidad,ID_Ceremonia,ID_CeremoniasXArticulo} = finalresp[0][0]
            console.log(Tipo_Articulo)
          })
        }
      }

    
  return (
       <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Recepcion' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Recepción</h3>
        <FormControl fullWidth>
      <InputLabel >Clave Articulo</InputLabel>
          <FilledInput onKeyUp={() => handleKeyPress(event)}  id="ClaveArticulo" type='text'/>
      </FormControl>
        {/* <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tipo Articulo</InputLabel>
        <Select labelId="labelProveedor" id="selectTipoArtiuclo" label="Articulo" onChange={cambioSelectTipo}>
            <MenuItem key={1} value='Ataud'>Ataud</MenuItem>
            <MenuItem key={2} value='Urna'>Urna</MenuItem>
            <MenuItem key={3} value='Relicario'>Relicario</MenuItem>
        </Select>
      </FormControl>
      <hr />
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
        <Select labelId="labelProveedor" id="selectProveedor" label="Proveedor" onChange={cambioSelectProveedores}>
            {proveedores.map(({Nombre_Proveedor,ID_Proveedor,Clave_Proveedor}, idx) =>{
                return(
                <MenuItem data-clave={Clave_Proveedor} key={ID_Proveedor} value={ID_Proveedor}>{Nombre_Proveedor}</MenuItem>
                );
            })}
          
        </Select>
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
        <InputLabel id="demo-simple-select-label">Articulo Del Proveedor</InputLabel>
        <Select labelId="labelArticuloProveedor" id="selectArticuloProveedor" label="Arituclo Del Proveedor" onChange={cambioSelectProveedoresArituclos}>
            {artProveedores.map(({ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo }, idx) =>{
                return(
                <MenuItem key={ID_ArticuloXProveedor} value={ID_ArticuloXProveedor}>{Nombre_Articulo}</MenuItem>
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
                <MenuItem key={ID_Material} value={ID_Material}>{Nombre_Material}</MenuItem>
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
                <MenuItem key={ID_Color} value={ID_Color}>{Nombre_Color}</MenuItem>
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
                <MenuItem key={ID_Tonalidad} value={ID_Tonalidad}>{Nombre_Tonalidad}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      <div id="hideShowCeremonia">
      <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Ceremonia</InputLabel>
        <Select labelId="labelCeremonia" id="selectCeremonia" label="Ceremonia" onChange={cambioSelectCeremoniasAritculos}>
            {ceremonias.map(({ID_Ceremonia,Portafolio}, idx) =>{
                return(
                <MenuItem key={ID_Ceremonia} value={ID_Ceremonia}>{Portafolio}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      </div>
      <div id="hideShowNombreInterno">
      <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Nombre Interno</InputLabel>
        <Select labelId="labelNombreInterno" id="selectNombreInterno" label="Nombre Interno" onChange={cambioSelectArtCeremonia}>
            {ceremoniaNombre.map(({ID_CeremoniasXArticulo,Nombre_Articulo}, idx) =>{
                return(
                <MenuItem key={ID_CeremoniasXArticulo} value={ID_CeremoniasXArticulo}>{Nombre_Articulo}</MenuItem>
                );
            })}
          
        </Select>
      </FormControl>
      <hr />
      </div> */}
      
      </Box>
    </Box>
        </ThemeProvider>
  )
}
