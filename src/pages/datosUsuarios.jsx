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
export const DatosUsuarios = () => {
    const mOscuro = localStorage.oscuro
    const [obscuro, setobscuro] = useState()
    const [usuarioNombre, setUsuarioNombre] = useState([])
    const [correo, setCorreo] = useState('')
    const [clave, setClave] = useState('')
    const [estado, setEstado] = useState('')
    const [PAdministrador, setPAdministrador] = useState(false)
    const [PTodasPlazas, setPTodasPlazas] = useState(false)
    const [PTodasSucursales, setPTodasSucursales] = useState(false)
    const [PReportes, setPReportes] = useState(false)
    const [PInvetarioPlaza, setPInvetarioPlaza] = useState(false)
    const [PCaptura, setPCaptura] = useState(false)
    const [PRecepcion, setPRecepcion] = useState(false)
    const [PConsulta, setPConsulta] = useState(false)
    const [PMovimientos, setPMovimientos] = useState(false)
    const [PCatalogos, setPCatalogos] = useState(false)
    const [sucursal, setSucursal] = useState('')
    const [plaza, setPlaza] = useState('')
    const [sucursalesUsuarioConsulta, setsucursalesUsuarioConsulta] = useState([])
    const [sucursalUSR, setsucursalUSR] = useState([])
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
        ObtenerDatosUsuario()
        validarPermisos()
    }, [])

    //Validar Usuario Logeado
    const navigate = useNavigate();

    const validarPermisos = ()=>{
      fetch(`${apiURL}usuarios.php?tipo=obtenerTodosUsuariosPorID&ID=${id}`)
      .then(async(resp) =>{
        const finalResp = await resp.json()
        console.log(finalResp[0][0].PCatalogos)
        
        if(finalResp[0][0].PAdministrador == 'true'){
          setPAdministrador(true)
        }else if(finalResp[0][0].PAdministrador== 'false'){
          setPAdministrador(false)
        }
        if(finalResp[0][0].PTodasPlazas== 'true'){
          setPTodasPlazas(true)
        }else if(finalResp[0][0].PTodasPlazas== 'false'){
          setPTodasPlazas(false)
        }
        if(finalResp[0][0].PReportes== 'true'){
          setPReportes(true)
        }else if(finalResp[0][0].PReportes== 'false'){
          setPReportes(false)
        }
        if(finalResp[0][0].PTodasSucursales== 'true'){
          setPTodasSucursales(true)
        }else if(finalResp[0][0].PTodasSucursales== 'false'){
          setPTodasSucursales(false)
        }
        if(finalResp[0][0].PInvetarioPlaza== 'true'){
          setPInvetarioPlaza(true)
        }else if(finalResp[0][0].PInvetarioPlaza== 'false'){
          setPInvetarioPlaza(false)
        }
        if(finalResp[0][0].PCaptura== 'true'){
          setPCaptura(true)
        }else if(finalResp[0][0].PCaptura== 'false'){
          setPCaptura(false)
        }
        if(finalResp[0][0].PRecepcion== 'true'){
          setPRecepcion(true)
        }else if(finalResp[0][0].PRecepcion== 'false'){
          setPRecepcion(false)
        }
        if(finalResp[0][0].PConsulta== 'true'){
          setPConsulta(true)
        }else if(finalResp[0][0].PConsulta== 'false'){
          setPConsulta(false)
        }
        if(finalResp[0][0].PMovimientos== 'true'){
          setPMovimientos(true)
        }else if(finalResp[0][0].PMovimientos== 'false'){
          setPMovimientos(false)
        }
        if(finalResp[0][0].PCatalogos== 'true'){
          setPCatalogos(true)
        }else if(finalResp[0][0].PCatalogos== 'false'){
          setPCatalogos(false)
        }

      })
      
    }

    const cambioSwitchPAdministrador = () =>{
      
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PAdministrador")
      formData.append("valorPermiso",!PAdministrador)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPAdministrador(!PAdministrador)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }

    const cambioSwitchPTodasPlazas = () =>{
      
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PTodasPlazas")
      formData.append("valorPermiso",!PTodasPlazas)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPTodasPlazas(!PTodasPlazas)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }

    const cambioSwitchPReportes = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PReportes")
      formData.append("valorPermiso",!PReportes)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPReportes(!PReportes)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPTodasSucursales = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PTodasSucursales")
      formData.append("valorPermiso",!PTodasSucursales)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPTodasSucursales(!PTodasSucursales)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPInvetarioPlaza = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PInvetarioPlaza")
      formData.append("valorPermiso",!PInvetarioPlaza)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPInvetarioPlaza(!PInvetarioPlaza)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPCaptura = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PCaptura")
      formData.append("valorPermiso",!PCaptura)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPCaptura(!PCaptura)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPRecepcion = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PRecepcion")
      formData.append("valorPermiso",!PRecepcion)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPRecepcion(!PRecepcion)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPConsulta = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PConsulta")
      formData.append("valorPermiso",!PConsulta)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPConsulta(!PConsulta)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPMovimientos = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PMovimientos")
      formData.append("valorPermiso",!PMovimientos)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPMovimientos(!PMovimientos)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }
    const cambioSwitchPCatalogos = () =>{
      let formData = new FormData()
      formData.append("tipo","modificarPermiso")
      formData.append("usuario",id)
      formData.append("clavePermiso","PCatalogos")
      formData.append("valorPermiso",!PCatalogos)
      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        setPCatalogos(!PCatalogos)
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
      })
    }

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const ObtenerDatosUsuario = () =>{
        Swal.showLoading()
        fetch(`${apiURL}usuarios.php?tipo=obtenerTodosUsuariosPorID&ID=${id}`)
        .then(async(resp) =>{
            const finalResp = await resp.json()
            setUsuarioNombre(finalResp[0][0].Nombre)
            setCorreo(finalResp[0][0].Correo)
            setClave(finalResp[0][0].Clave)
            setEstado(finalResp[0][0].Estatus)
            setSucursal(finalResp[0][0].Nombre_Sucursal)
            setPlaza(finalResp[0][0].Plaza)
            setsucursalUSR(finalResp[0][0].ID_Sucursal)
            fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPorPlazas&id=${finalResp[0][0].ID_Plaza}`)
            .then(async(res) =>{
              const finalResp2 = await res.json()
              setsucursalesUsuarioConsulta(finalResp2[0])
              // console.log(finalResp2[0])
            })
            Swal.close()
        })
        .catch(err =>{
            Swal.fire('Error','Hubo un error favor de volver a intentar','error')
        })
    }

    const guardarDatosUsuario = ()=>{
    //  sucursalUSR
    //  clave
    //  usuarioNombre
    let formData = new FormData()
      formData.append("tipo","modificarDatosUsuario")
      formData.append("sucursalUSR",sucursalUSR)
      formData.append("clave",clave)
      formData.append("usuarioNombre",usuarioNombre)
      formData.append("usuario",id)

      fetch(`${apiURL}usuarios.php`,{
        method:'post',
        body: formData
      }).then((resp) =>{
        Swal.fire('Exito',resp.mensaje,'success')
      }).catch(err =>{
        Swal.fire('Error','Hubo un error favor de reintentar','error')
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
    <h3 style={{textAlign: 'center'}}>Edición De usuarios</h3>
    <FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Nombre De Usuario</InputLabel>
    <FilledInput  id="nombreUsuario" type='text'  onChange={(e) => {setUsuarioNombre( e.target.value)}} value={usuarioNombre}/>
  </FormControl>
<hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Correo</InputLabel>
    <FilledInput  id="correoUsuario" type='text' readOnly value={correo}/>
  </FormControl>
  <hr />
<FormControl fullWidth>
    <InputLabel htmlFor='nombreUsuario'>Clave</InputLabel>
    <FilledInput  id="claveUsuario" type='text'  onChange={(e) => {setClave( e.target.value)}} value={clave}/>
  </FormControl>
  <hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='estadoUsuario'>Estado</InputLabel>
    <FilledInput  id="estadoUsuario" type='text' value={estado}/>
  </FormControl>
  <hr />
  <FormControl fullWidth>
    <InputLabel htmlFor='plazaUsuario'>Plaza</InputLabel>
    <FilledInput  id="plazaUsuario" type='text' value={plaza}/>
  </FormControl>
  <hr />
  {/* sucursalesUsuarioConsulta */}
  <hr />
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Sucursal </InputLabel>
        <Select value={sucursalUSR} onChange={(e) => {setsucursalUSR( e.target.value)}} labelId="labelProveedor" id="selectSucursales" label="Proveedor">
            {sucursalesUsuarioConsulta.map(({ID_Sucursal,Nombre_Sucursal,Clave_Sucursal}, idx) =>{
                return(
                 <MenuItem data-clave={Clave_Sucursal} key={ID_Sucursal} value={ID_Sucursal}>{Nombre_Sucursal}</MenuItem>
                
                
                );
            })}

        </Select>
      </FormControl>
  <hr />

  <h3 className="text-center">Lista De Permisos</h3>
  <FormGroup>
  <FormControlLabel  control={<Switch onChange={cambioSwitchPAdministrador} value={PAdministrador} checked={PAdministrador} />} label="Panel De Administración" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPTodasPlazas} value={PTodasPlazas} checked={PTodasPlazas} />} label="Todas Las Plazas" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPTodasSucursales} value={PTodasSucursales} checked={PTodasSucursales} />} label="Reportes" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPReportes} value={PReportes} checked={PReportes} />} label="Todas Las Sucursales" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPInvetarioPlaza} value={PInvetarioPlaza} checked={PInvetarioPlaza} />} label="Inventario Plaza" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPCaptura} value={PCaptura} checked={PCaptura} />} label="Captura" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPRecepcion} value={PRecepcion} checked={PRecepcion} />} label="Recepción" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPConsulta} value={PConsulta} checked={PConsulta} />} label="Consulta" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPMovimientos} value={PMovimientos} checked={PMovimientos} />} label="Movimientos" />
  <FormControlLabel control={<Switch onChange={cambioSwitchPCatalogos} value={PCatalogos} checked={PCatalogos} />} label="Catálogos" />
         
   
        </FormGroup>
        <br />
        <Button  className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} style={{width: '100%'}} onClick={guardarDatosUsuario} size="large"><b>Guardar</b></Button>       
  </Box>
  
</Box>
    </ThemeProvider>
  )
}
