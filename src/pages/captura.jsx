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
        obtenerProveedores()
        obtenerMateriales()
        obtenerColores()
        obtenerTonalidades()
        obtenerCeremonias()
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
        fetch(`${apiURL}proveedores.php?tipo=obtenerTodosProveedoresActivos`)
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

    const cambioSelectArtCeremonia = (event) =>{
        setartCeremoniaNombre(event.target.value)
    }

    //cambioSelectCeremoniasAritculos
    const cambioSelectCeremoniasAritculos = (event) =>{
        //setartProveedoresNombre(event.target.value)
         const ID_Ceremonia = event.target.value
         setceremoniaNombre2(ID_Ceremonia)
        setartCeremoniasNombre(event.target.value)
        setceremoniaNombre([])
        fetch(`${apiURL}configuraciones.php?tipo=obtenerArtCeremonias&ID_Ceremonia=${ID_Ceremonia}`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            if(finalResp.estatus){
                setceremoniaNombre(finalResp[0])
                console.log(finalResp[0])
            }
        })
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

    const obtenerCeremonias = () => {
        setartProveedores([])
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodasCeremonias`)
            .then(async(resp) => {
                const finalResp = await resp.json();
                setceremonias(finalResp[0]) 
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
        if( proveedoresNombre == ''
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
            }).then((result) => {})
            const proveedor = proveedores.filter(pro => pro.ID_Proveedor == proveedoresNombre)
                     const artProveedor = artProveedores.filter(pro => pro.ID_ArticuloXProveedor == artProveedoresNombre)
                     const materiales = material.filter(mat => mat.ID_Material == materialNombre)
                     const color = colores.filter(col => col.ID_Color == coloresNombre)
                     const tona = tonalidades.filter(to => to.ID_Tonalidad == tonalidadesNombre)
                     
                     for(let i = 1; i<=document.getElementById('numberCantidad').value; i++){
                    let formData = new FormData();
                    formData.append('pro',proveedoresNombre);
                    formData.append('artProv',artProveedoresNombre);
                    formData.append('materiales',materialNombre);
                    formData.append('colores',coloresNombre);
                    formData.append('tonalidades',tonalidadesNombre);
                    formData.append('claveProducto',proveedor[0].Clave_Proveedor + '-' + artProveedor[0].Clave_Articulo+'-'+materiales[0].Clave_Material+'-'+color[0].Clave_Color+tona[0].Clave_Tonalidad);
                    //formData.append('nombreProducto',document.getElementById('textNombreProducto').value);
                    formData.append('cantidad',1);
                    //formData.append('nombreInterno',document.getElementById('textNombreInterno').value);
                    formData.append('tipo_ART',tipo);
                    formData.append('usuario',localStorage.id);
                    if(tipo == 'Urna'){
                        formData.append('ceremonia',999);
                        formData.append('artCeremonia',999); 
                    }else{
                        formData.append('ceremonia',ceremoniaNombre2);
                        formData.append('artCeremonia',artCeremoniaNombre);
                    }
                    
                    formData.append('incrementa',i);
                    formData.append('tipo','guardarCaptura');

                    
                        fetch(`${apiURL}articulos.php`,{
                            method: 'post',
                            body: formData
                        })
                        .then(async(resp) => {
                            const {estatus,mensaje,QR} = await resp.json();
                           
                            if(estatus == true){
                                if(i==document.getElementById('numberCantidad').value){
                                    Swal.close()
                                    Swal.fire(
                                        'Exito',
                                        mensaje,
                                        'success'
                                      )
                                }else{}
                              
                              
                              setarregloQR(arregloQR=>[...arregloQR,QR])
                              
                             // setcodQR(proveedor[0].Clave_Proveedor + '-' + artProveedor[0].Clave_Articulo+'-'+materiales[0].Clave_Material+'-'+color[0].Clave_Color+tona[0].Clave_Tonalidad)
                            }else{
                                Swal.close()
                              Swal.fire(
                                'Error',
                                mensaje,
                                'error'
                              )
                            }
                          })
                          .catch(err => {
                            Swal.close()
                            Swal.fire(
                              'Error',
                              'Hubo un error, por favor intentalo de nuevo 2'+err,
                              'error'
                            )
                          })
                    }
                    
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

    const cambioSelectTipo = (event) =>{
        settipo(event.target.value)
        if(event.target.value == 'Urna'){
            document.getElementById("hideShowCeremonia").style.display = "none";
            document.getElementById("hideShowNombreInterno").style.display = "none";
        }else{
            document.getElementById("hideShowCeremonia").style.display = "block";
            document.getElementById("hideShowNombreInterno").style.display = "block";
        }
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
        <InputLabel id="demo-simple-select-label">Tipo Articulo</InputLabel>
        <Select labelId="labelProveedor" id="selectProveedor" label="Articulo" onChange={cambioSelectTipo}>
            <MenuItem key={1} value='Ataud'>Ataud</MenuItem>
            <MenuItem key={2} value='Urna'>Urna</MenuItem>
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
        <InputLabel id="demo-simple-select-label">Aritculo Del Proveedor</InputLabel>
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
      </div>
      <FormControl fullWidth>
      <InputLabel >Cantidad</InputLabel>
          <FilledInput id="numberCantidad" type='number'/>
      </FormControl>
      <hr />
      <div id='QRS'>
      {(arregloQR.length == 0) ?'' :
      arregloQR.map(qr =>{
        return(<QRious class="mainImg" value={qr} size={250} style={{marginLeft: '50px', marginTop:'30px'}}  foreground='black' level='H'  />)
      })
      }
</div>
      {(arregloQR.length == 0) ? <Button onClick={generarCaptura} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Guardar</b></Button> 
      : <Button onClick={imprimirQr} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Imprimir</b></Button>}
     

      
  
      </Box>
    </Box>
        </ThemeProvider>
  )
}
