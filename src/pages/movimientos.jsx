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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';

//SweetAlert
import Swal from 'sweetalert2';

//QRious
import { QRious } from 'react-qrious'



//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';
import { func } from 'prop-types';

export const Movimientos = () => {
  const mOscuro = localStorage.oscuro
  const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [camOpen, setCamOpen] = useState(false);
    const [nombre, setNombre] = useState('');
    const [claveArticulo, setclaveArticulo] = useState('')
    const [idArticulo, setidArticulo] = useState('')
    const [selectPlaza, setselectPlaza] = useState('')
    const [plazas, setplazas] = useState('')
    const [estatus, setestatus] = useState('')
    const [idArticulos, setidArticulos] = useState('')
    const [sucursal, setsucursal] = useState('')
    const [totalCremaciones, settotalCremaciones] = useState('')
    const [idSucursal, setidSucursal] = useState('')
    const [movimientos, setMovimientos] = useState([''])


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
        obtenerPlazas()
        //obtenerQR("120230612104115GAM-MAG-MAD-NGCO")
    }, [])
    
    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }
  const obtenerPlazas = () =>{
    fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
    .then(async(resp) =>{
        const finalResp = await resp.json();
        // setplazas(finalResp[0])
        let selectopt = '<select id="seelectDataPlazas" class="form-select">'
        finalResp[0].map(({ID_Plaza,Plaza}) =>{
          selectopt+=`<option value='${ID_Plaza}'>${Plaza}</option>`
        })
        selectopt+=`</select>`

        setplazas(selectopt)
    })
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
        console.log(finalResp)
        document.getElementById("codigoQR").value = codQRResult
        setNombre(finalResp[0][0].Nombre_Articulo)
        setclaveArticulo(finalResp[0][0].Clave_Articulo)
        obtenerSucursalPlaza(finalResp[0][0].ID_Plaza)
        setestatus(finalResp[0][0].estatusArt)
        setidArticulos(finalResp[0][0].ID_Articulo)
        obtenerMovimientosart(finalResp[0][0].ID_Articulo)
        
        fetch(`${apiURL}articulos.php?tipo=obtenerPlazaArt&ID_Articulo=${finalResp[0][0].ID_Articulo}`)
        .then(async(resp) =>{
          const finalresp = await resp.json();
          setsucursal(finalresp[0][0].Nombre_Sucursal)
          setidSucursal(finalresp[0][0].ID_Sucursal)
        })

        fetch(`${apiURL}articulos.php?tipo=obtenerCremacionesArt&ID_Articulo=${finalResp[0][0].ID_Articulo}`)
        .then(async(resp) =>{
          const finalresp = await resp.json();
          settotalCremaciones(finalresp.totalCremaciones)
          console.log(finalresp.totalCremaciones)
          
        })

      }else{

      }
    })
  }

  const obtenerSucursalPlaza = (plaza2)=>{

    fetch(`${apiURL}plazas.php?tipo=obtenerSucursalesPlazas`)
    .then(async(resp) => {
      const finalResp = await resp.json()
      if(finalResp.estatus){
        //setplaza(finalResp[0])
        //setselectPlaza(JSON.stringify(finalResp[0][0]))
        let option  = '<select id="seelectDataPlazas" class="form-select">';
        finalResp[0].map(({ID_Sucursal,Nombre_Sucursal}) =>{
          option += `<option value='${ID_Sucursal}'>${Nombre_Sucursal}</option>`
          
        })
        option += '</select>'
        console.log(option)
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
            let formData = new FormData();
            formData.append('ID_Usuario',localStorage.id);
            formData.append("ID_Articulo",idArticulo)
            formData.append("ID_Sucursal",plaza)
            formData.append("Motivo",motivo)
            formData.append("tipo","moveraSucursal")

            fetch(`${apiURL}movimientos.php`,{
              method: 'post',
              body: formData
          }).then(async(resp) =>{
            const {estatus,mensaje} = await resp.json();
            if(estatus){
              Swal.fire('Accion Completada', mensaje, 'success').then(resp =>{location.reload();})
            }
          });
          }
      }
    })
  }

  const handleKeyPress = (event) => {
    if(event.code === 'Enter'){
      const qrValor = document.getElementById("codigoQR").value;
      obtenerQR(qrValor)
    }
  }

  
  const verTipoMovimiento = () =>{
    // alert(document.getElementById("codigoQR").value)
    Swal.fire({
      allowOutsideClick: false,
      title: `Movimientos`,
      html: ``,
      showConfirmButton: true,
      confirmButtonText: (estatus =='Cremación') ? 'Reingreso' :  'Traspaso',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showDenyButton: (estatus.includes('Alta') || estatus.includes('Cremación')) ? false : true,
      denyButtonText: 'Cremación / Inhumación',
    }).then((result) => {
      console.log(result)
      if(result.isDismissed){
        Swal.close()
      }else if(result.isConfirmed){
        if(estatus == 'Cremación'){
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
               
              }, 5000)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {})

          let formDataInventario = new FormData();
          formDataInventario.append("tipo","actualizarEstausArticuloInventario")
          formDataInventario.append("ID_Articulo",idArticulos)
          fetch(`${apiURL}articulos.php`,{
              method: 'post',
              body: formDataInventario
          })
          .then(async(resp) =>{
            const {mensaje} = await resp.json()
            console.log(mensaje)
            Swal.close()
            Swal.fire('Accion Completada', mensaje, 'success').then(resp =>{location.reload();})
          })
        }else{
        Swal.fire({
          allowOutsideClick: false,
      title: `Traspaso`,
      html: `${selectPlaza}`,
      showConfirmButton: true,
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      showDenyButton: false,
        }).then((result) => {
          if(result.isDismissed){
            Swal.close()
          }else if(result.isConfirmed){
            const palzaDestino = document.getElementById("seelectDataPlazas").value
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
                 
                }, 5000)
              },
              willClose: () => {
                clearInterval(timerInterval)
              }
            }).then((result) => {})
           
            //idArticulos
            let formData = new FormData();
            formData.append("ID_Usuario",localStorage.id)
            formData.append("ID_Articulo",idArticulos) 
            formData.append("ID_Sucursal",palzaDestino) 
            formData.append("Motivo","Traspaso")
            formData.append("tipo","moveraSucursal") 

            fetch(`${apiURL}movimientos.php`,{
              method: 'post',
              body: formData
            }).then(async(resp) =>{

             
              const {estatus,mensaje} = await resp.json()

              if(estatus == true){
                Swal.close();
                Swal.fire('Accion Completada', mensaje, 'success').then(resp =>{location.reload();})

               
                
                //api para actualziar estatus
              }else{
                //mensaje error
                Swal.close();
                Swal.fire('Accion Incorrecta', 'Hubo un error al actualizar los datos', 'error').then(resp =>{})
              }
            })
          }
        })
      }
      }else{
            //Hacer Petición API
            Swal.fire({
              allowOutsideClick: false,
          title: `Cremación/Inhumación`,
          html: `<div>
          <input type='text' class='form-control' id='nPropuesta' placeholder='Numero de propuesta'>
          <hr>
          <input type='text' class='form-control' id='Persona_Fallecida' placeholder='Nombre de la persona fallecida'>
          <hr>
          <select class='form-select' id='Redimido'>
          <option value='Redimido'>Redimido</option>
          <option value='Inmediato'>Inmediato</option>
          </select>
          <hr>
          <select id='selectCremacionInhumacion' class='form-select'>
          <option value='Cremación'>Cremación</option>
          <option value='Inhumación'>Inhumación</option>
          </select>
          <hr>
          <input type='text' class='form-control' value='${totalCremaciones}' placeholder='Numero de cremaciones' readonly>
          <hr>
          <input type='text' class='form-control' value='${sucursal}' placeholder='Sucursal' readonly>
          </div>`,
          showConfirmButton: true,
          confirmButtonText: 'Confirmar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar',
          showDenyButton: false,
            }).then(result =>{
             if(result.isConfirmed){
              let formDataCremacionInhumacion = new FormData();
              formDataCremacionInhumacion.append("tipo","guardarMovimientoCremacionInhumacion")
              formDataCremacionInhumacion.append("ID_Usuario",localStorage.id)
              formDataCremacionInhumacion.append("ID_Articulo",idArticulos)
              formDataCremacionInhumacion.append("Tipos",document.getElementById("selectCremacionInhumacion").value)
              formDataCremacionInhumacion.append("ID_Sucursal",idSucursal)
              formDataCremacionInhumacion.append("Numero_Propuesta", document.getElementById("nPropuesta").value)
              formDataCremacionInhumacion.append("Persona_Fallecida", document.getElementById("Persona_Fallecida").value)
              formDataCremacionInhumacion.append("Redimido", document.getElementById("Redimido").value)

              fetch(`${apiURL}articulos.php`,{
                method: 'post',
                body: formDataCremacionInhumacion
            })
            .then(async(resp) =>{
              const {mensaje} = await resp.json()
              Swal.fire('Accion Completada', mensaje, 'success').then(resp =>{location.reload();})
            })
             }
            })
          
      }
    })

  }

  const recibirArticulo = () =>{
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
               
              }, 5000)
            },
            willClose: () => {
              clearInterval(timerInterval)
            }
          }).then((result) => {})

          let formDataInventario = new FormData();
          formDataInventario.append("tipo","actualizarEstausArticuloInventario")
          formDataInventario.append("ID_Articulo",idArticulos)
          fetch(`${apiURL}articulos.php`,{
              method: 'post',
              body: formDataInventario
          })
          .then(async(resp) =>{
            const {mensaje} = await resp.json()
            console.log(mensaje)
            Swal.close()
            Swal.fire('Accion Completada', mensaje, 'success').then(resp =>{location.reload();})
          })

  }

  const obtenerMovimientosart = (art)=>{
     fetch(`${apiURL}articulos.php?tipo=obtenerHistorialMovimientos&ID_Articulo=${art}`)
     .then(async(resp)=>{
      const finalResp = await resp.json()
      console.log(finalResp)
      if(finalResp.estatus == true){
        setMovimientos(finalResp[0])
      }
      
     })
    //setidArticulos
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
          obtenerQR(codQRResult)
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
      <hr />
      <Button disabled={(nombre == ''  || estatus == 'En Transito' || estatus == 'Inhumación') ? true : false} onClick={verTipoMovimiento} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Movimientos</b></Button>
      <hr />
    <FormControl fullWidth>
        <FilledInput id="codigoQR" onKeyUp={() => handleKeyPress(event)}  placeholder='Codigo QR' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={nombre} readOnly placeholder='Nombre' type='text'/>
    </FormControl>
    <hr />
    <FormControl fullWidth>
        <FilledInput value={claveArticulo} readOnly placeholder='Clave Articulo' type='text'/>
    </FormControl>

    <hr />
    <FormControl fullWidth>
        <FilledInput value={estatus} readOnly placeholder='Estatus' type='text'/>
    </FormControl>
    <hr />
    { (estatus == 'En Transito') ?  <Button onClick={recibirArticulo} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} size="large"><b>Recibir</b></Button>: ''}
     {/* <hr />
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
    : ''} */}

     {(movimientos) ? (movimientos.length > 0) ? <h3 className="text-center">Historial De Movimientos</h3> : '' : ''}
     
     <List style={{ border: '3px solid white', borderRadius: '10px' } }>
     {(movimientos.length > 0) ?
     movimientos.map(mov =>{
      return(<ListItem key={mov.Fecha_Movimiento}><p className="text-center">{mov.Tipo} - {mov.Fecha_Movimiento} - {mov.Nombre}</p></ListItem>)
     })
     : ''}
    </List>

  </Box>
</Box>
    </ThemeProvider>
  )
}
