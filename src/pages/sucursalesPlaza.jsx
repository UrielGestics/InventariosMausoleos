import React, { useEffect, useState } from 'react'

//Navegación
import { useNavigate, useParams } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TablePagination from "@mui/material/TablePagination";
import SearchComponent from "react-material-ui-searchbar";

import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

//SweetAlert
import Swal from 'sweetalert2';




//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const SucursalesPlaza = () => {
    let { id, nombre } = useParams();
    const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [sucursalesPlaza, setsucursalesPlaza] = useState([])
    const [sucursalesPlazaCopia, setsucursalesPlazaCopia] = useState([])
    const [cargandosucursalesPlaza, setCargandosucursalesPlaza] = useState(false)
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(10);

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
        obtenerSucursalesPlazas()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

    const obtenerSucursalesPlazas = () =>{
        fetch(`${apiURL}plazas.php?tipo=obtenerSucursalesPlazas&ID_Plaza=${id}`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setsucursalesPlaza(finalResp[0])
            setsucursalesPlazaCopia(finalResp[0])
            setCargandosucursalesPlaza(true)
        })
    }
    
    function handleChangePage(event, newpage) {
        setpg(newpage);
    }
  
    function handleChangeRowsPerPage(event) {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }

    const requestSearch = (texto) => {
        if(texto == ''){
          obtenerSucursalesPlazas()
        }else{
            const filteredRows = sucursalesPlazaCopia.filter((row) => {
                return row.Nombre_Sucursal.toLowerCase().includes(texto.toLowerCase())
              });
               setsucursalesPlaza(filteredRows)
        }
      }

      const regresar = () =>{
        navigate(`/Plazas`);
      }

      const agregarSucursalPlaza = () =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Agregar Sucursal A La Plaza ${nombre}`,
            html: `<label>Nombre De La Sucursal</label>
            <br />
            <input type="text" id="nSucursalPlaza" class="swal2-input" placeholder="Nombre De La Sucursal">
            <br />
            <label>Clave De La Sucursal</label>
            <br />
            <input type="text" id="cSucursalPlaza" class="swal2-input" placeholder="Clave De La Sucursal">`,
            confirmButtonText: 'Agregar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Agrego La Plaza', 'error')
            }else{
                const nSucursalPlaza = Swal.getPopup().querySelector('#nSucursalPlaza').value
                const cSucursalPlaza = Swal.getPopup().querySelector('#cSucursalPlaza').value
                if (!nSucursalPlaza || !cSucursalPlaza) {
                  Swal.showValidationMessage(`Porfavor llena Ambos Campos`)
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
                  formData.append("tipo","agregarSucursalPlaza")
                  formData.append("nSucursalPlaza",nSucursalPlaza)
                  formData.append("cSucursalPlaza",cSucursalPlaza)
                  formData.append("id",id)
    
                  fetch(`${apiURL}plazas.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerSucursalesPlazas()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
      }

    const editarSucursalPlaza = (ID_Sucursal,Nombre_Sucursal,Clave_Sucursal) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Sucursal ${Nombre_Sucursal}`,
            html: `<label>Nombre De La Sucursal</label>
            <br />
            <input type="text" id="nSucursalPlaza" class="swal2-input" value='${Nombre_Sucursal}' placeholder="Nombre De La Sucursal">
            <br />
            <label>Clave De La Sucursal</label>
            <br />
            <input type="text" id="cSucursalPlaza" class="swal2-input" value='${Clave_Sucursal}' placeholder="Clave De La Sucursal">`,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito La Sucursal', 'error')
            }else{
              
                const nSucursalPlaza = Swal.getPopup().querySelector('#nSucursalPlaza').value
                const cSucursalPlaza = Swal.getPopup().querySelector('#cSucursalPlaza').value
                if (!nSucursalPlaza || !cSucursalPlaza) {
                  Swal.showValidationMessage(`Porfavor llena Ambos Campos`)
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
                  formData.append("tipo","modificarSucursalPaza")
                  formData.append("id",ID_Sucursal)
                  formData.append("nSucursalPlaza",nSucursalPlaza)
                  formData.append("cSucursalPlaza",cSucursalPlaza)
  
                  fetch(`${apiURL}plazas.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerSucursalesPlazas()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
    }
    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Plazas' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Lista De Sucursales De La Plaza {nombre}</h3>
        {(!cargandosucursalesPlaza) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : 
        <>
        <Button onClick={agregarSucursalPlaza} title='Agregar' key='AgregarArt' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Sucursal</Button>
        <Button onClick={regresar} title='Regresar' key='RregresarArt' variant="contained" color='error' style={{float: 'right', marginRight: '10px', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-arrow-left-circle" style={{marginRight : '10px'}}></i> Regresar</Button>
        </>
        }
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre De Sucursal</TableCell>
            <TableCell align="center">Clave De Sucursal</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandosucursalesPlaza) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(sucursalesPlaza!=undefined) ? sucursalesPlaza.slice(pg * rpg, pg * rpg + rpg).map(({ID_Sucursal,Nombre_Sucursal,Clave_Sucursal}) =>(
            <TableRow
              key={ID_Sucursal}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Sucursal}</TableCell>
              <TableCell align="center">{Clave_Sucursal}</TableCell>
              <TableCell align="center">
              <Button  onClick={() => editarSucursalPlaza(ID_Sucursal,Nombre_Sucursal,Clave_Sucursal)} title='Editar' key={`a${ID_Sucursal}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              </TableCell>
            </TableRow>
          )) : 
          <TableRow
              key='SIN Datos'
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center" colSpan={3}><b id="nDatos" style={{fontSize: '20px'}}>No Hay Datos</b></TableCell>
            </TableRow>
          }
        </TableBody>
        {(sucursalesPlaza!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={sucursalesPlaza.length}
                rowsPerPage={rpg}
                page={pg}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />: 
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage='Resultados Por Página'
            count={0}
            rowsPerPage={rpg}
            page={pg}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />}
       </Table>
    </TableContainer>
      </Box>
    </Box>
        </ThemeProvider>
      )
    }
    
