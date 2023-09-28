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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';

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
    const [artProveedores, setartProveedores] = useState([])
    const [artProveedoresNombre, setartProveedoresNombre] = useState([])
    const [claveArticulos, setclaveArticulos] = useState([])
    const [plazas, setplazas] = useState([])
    const [plazasNombre, setplazasNombre] = useState([])
    const [codQR, setcodQR] = useState('')
    const [precio, setprecio] = useState('')
    const [sucursales, setsucursales] = useState([])
    const [sucursalID, setsucursalID] = useState('')
    const [qRTexto, setQRTexto] = useState('')

    const defaultProps = {
        options: claveArticulos,
        getOptionLabel: (option) => option.Clave_Articulo,
      };


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
        obtenerProveedores()
        obtenerPlazas()
    }, [])

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
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

  const obtenerProveedores = () =>{
    fetch(`${apiURL}proveedores.php?tipo=obtenerTodosProveedoresActivos`)
    .then(async(resp) =>{
        const finalResp = await resp.json();
        setproveedores(finalResp[0])
    })
}

const cambioSelectProveedoresArituclos = (event) =>{
  setartProveedoresNombre(event.target.value)
  fetch(`${apiURL}proveedores.php?tipo=buscarDatosArtProveedor&nombre=${event.target.value}`)
  .then(async(resp) =>{
    const finalresp = await resp.json();
    setprecio('$'+finalresp[0][0].Precio)
  })

}

const cambioSelectSucursales = (event) =>{
setsucursalID(event.target.value)
}

const cambioSelectPlazas = (event) =>{
  setplazasNombre(event.target.value)
  fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPorPlazas&id=${event.target.value}`)
  .then(async(resp) =>{
    const finalresp = await resp.json();
    
    setsucursales(finalresp[0])
  })
}
const obtenerPlazas = () =>{
  fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
  .then(async(resp) =>{
      const finalResp = await resp.json();
      setplazas(finalResp[0])
  })
}

const generarCaptura = () =>{
  if(plazasNombre == '' || sucursalID == '' || proveedoresNombre == '' || artProveedoresNombre == '' || document.getElementById('ordenCompra').value == '' || document.getElementById('numberCantidad').value  == '' || document.getElementById('numberCantidad').value <1){
      Swal.fire(
          'error',
          'Tienes que llenar todos los campos',
          'error'
        )
  }else{
    Swal.showLoading()

               for(let i = 1; i<=document.getElementById('numberCantidad').value; i++){
              let formData = new FormData();
              formData.append('pro',proveedoresNombre);
              formData.append('artProv',artProveedoresNombre);
              formData.append('plaza',plazasNombre);
              formData.append('cantidad',document.getElementById('numberCantidad').value);
              formData.append('costo',document.getElementById('numberCosto').value);
              formData.append('ordenCompra',document.getElementById('ordenCompra').value);
              formData.append('usuario',localStorage.id);
              formData.append("sucursalID",sucursalID)


              formData.append('incrementa',i);
              formData.append('tipo','guardarRecepcion');


                  fetch(`${apiURL}articulos.php`,{
                      method: 'post',
                      body: formData
                  })
                  .then(async(resp) => {
                      const {estatus,mensaje,QR} = await resp.json();
setQRTexto(QR)
                      if(estatus == true){
                          if(i==document.getElementById('numberCantidad').value){
                              Swal.close()
                              Swal.fire(
                                  'Exito',
                                  mensaje,
                                  'success'
                                )
                          }else{}


                          setcodQR(codQR=>[...codQR,QR])




                        //setcodQR(proveedor[0].Clave_Proveedor + '-' + artProveedor[0].Clave_Articulo+'-'+materiales[0].Clave_Material+'-'+color[0].Clave_Color+tona[0].Clave_Tonalidad)
                      }else{
                          Swal.close()
                          console.log(estatus)
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
//   let printContents = document.getElementById('QRS').innerHTML;
//   let originalContents = document.body.innerHTML;
//   document.body.innerHTML = printContents;
//   window.print();
//  document.body.innerHTML = originalContents; 
  var win = window.open('', '', 'height=700,width=1000'); // Open the window. Its a popup window.
  win.document.write('<html><head><title></title>');
  //win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />');
  win.document.write('</head><style>label{font-size:6.3px !important}</style><style>.etiqueta{margin-right:-1cm !important}</style></body>');
      win.document.write(document.getElementById("QRS").outerHTML);     // Write contents in the new window.
      win.document.write('</body></html>');
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
      <BarraSuperior pag='Recepción' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Recepción</h3>

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
        <InputLabel id="demo-simple-select-label">Articulo Del Proveedor</InputLabel>
        <Select labelId="labelArticuloProveedor" id="selectArticuloProveedor" label="Arituclo Del Proveedor" onChange={cambioSelectProveedoresArituclos}>
            {artProveedores.map(({ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo }, idx) =>{
                return(
                <MenuItem data-clave={Clave_Articulo} key={Clave_Articulo} value={ID_ArticuloXProveedor}>{Nombre_Articulo}</MenuItem>
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
        <InputLabel id="demo-simple-select-label">Sucursales</InputLabel>
        <Select labelId="labelProveedor" id="selectSucursales" label="Proveedor" onChange={cambioSelectSucursales}>
            {sucursales.map(({ID_Sucursal,Nombre_Sucursal,Clave_Sucursal}, idx) =>{
                return(
                <MenuItem data-clave={Clave_Sucursal} key={ID_Sucursal} value={ID_Sucursal}>{Nombre_Sucursal}</MenuItem>
                );
            })}

        </Select>
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Cantidad</InputLabel>
          <FilledInput id="numberCantidad" type='number'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Orden De Compra</InputLabel>
          <FilledInput id="ordenCompra" type='text'/>
      </FormControl>
      <hr />
      <FormControl fullWidth>
      <InputLabel >Precio</InputLabel>
          <FilledInput id="numberCosto" value={precio} disabled type='text'/>
      </FormControl>
      <hr />
      <div id='QRS'>
      {(codQR.length == 0) ?'' :
      codQR.map(qr =>{
        return(
          // 

          <div className='etiqueta' style={{ height:'1.563cm'}}>
           <QRious style={{width:'1.3cm',float: 'left'}} value={qr}  foreground='black' level='H'  />
       
           <label  style={{width:'1.6cm', marginRight:'0.1cm',  marginTop:'6px', float: 'left'}} >
           {qr}
           <br />
           {document.getElementById("selectArticuloProveedor").textContent} 
         </label>
        
          </div>


        // <div style={{marginBottom:'0px', marginLeft:'38px'}}>
        //  <label>Inicio Etiqueta</label>
        //  <div  >
        //   <QRious className='mainImg' value={qr} size={57} style={{marginLeft:'14px'}} foreground='black' level='H'  />
        //  </div>
        // <div style={{width:'95px'}}>
        //   <label  style={{ marginTop:'-43px', marginLeft:'62px', fontSize:'2px'}} >
        //   {qr}
        //   <br />
        //   {document.getElementById("selectArticuloProveedor").textContent} 
        // </label>
        // </div>
       
        //  </div>
        )
      })
      }
      
</div>
      {(codQR.length == 0) ? <Button onClick={generarCaptura} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Guardar</b></Button>
      : <Button onClick={imprimirQr} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Imprimir</b></Button>}


      {/* <Button onClick={generarCaptura} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Guardar</b></Button> */}
      </Box>
    </Box>
        </ThemeProvider>
  )
}
