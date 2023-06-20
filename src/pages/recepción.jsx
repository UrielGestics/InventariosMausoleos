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
            const {Tipo_Articulo,Nombre_Proveedor,Plaza,Nombre_Articulo,Nombre_Material,Nombre_Color,Nombre_Tonalidad,Portafolio,Nombre_ArticuloCeremonia} = finalresp[0][0]
            settipo(Tipo_Articulo)
            setproveedores(Nombre_Proveedor)
            setplazas(Plaza)
            setartProveedores(Nombre_Articulo)
            setmaterial(Nombre_Material)
            setcolores(Nombre_Color)
            settonalidades(Nombre_Tonalidad)
            setceremoniaNombre(Portafolio)
            setceremoniaNombre2(Nombre_ArticuloCeremonia)
          })
        }
      }

    
  return (
       <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Recepción' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Recepción</h3>
        <FormControl fullWidth>
            <InputLabel >Clave Articulo</InputLabel>
          <FilledInput onKeyUp={() => handleKeyPress(event)}  id="ClaveArticulo" type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tipo Articulo</InputLabel>
        <FilledInput id="tArticulo" value={tipo} readOnly type='text'/>
      </FormControl>
      <hr />
        <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Proveedor</InputLabel>
        <FilledInput id="proveedor" value={proveedores} readOnly type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Plaza</InputLabel>
        <FilledInput id="plaza" value={plazas} readOnly type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Articulo Del Proveedor</InputLabel>
        <FilledInput id="artProveedor" value={artProveedores} readOnly type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Materiales</InputLabel>
        <FilledInput id="materiales" value={material} readOnly type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Colores</InputLabel>
        <FilledInput id="colores" value={colores} readOnly type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Tonalidades</InputLabel>
        <FilledInput id="tonalidades" value={tonalidades} readOnly type='text'/>
      </FormControl>
      <hr />
      {(ceremoniaNombre != '') ? <div> <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Ceremonia</InputLabel>
        <FilledInput id="ceremonia" value={ceremoniaNombre} readOnly type='text'/>
      </FormControl>
      <hr /></div> : ''}

      {(ceremoniaNombre2 != '') ? <div>
      <FormControl fullWidth >
        <InputLabel id="demo-simple-select-label">Nombre Interno</InputLabel>
        <FilledInput id="ceremoniaNombre" value={ceremoniaNombre2} readOnly type='text'/>
      </FormControl>
      <hr /> 
      </div>: ''}

     
        
      
      </Box>
    </Box>
        </ThemeProvider>
  )
}
