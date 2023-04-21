import React, { useEffect, useState } from 'react'

//Navegación
import { useNavigate } from 'react-router-dom';

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

export const Tonalidades = () => {
 
    const [obscuro, setobscuro] = useState()
    const [tonalidades, settonalidades] = useState([])
    const [tonalidadesCopia, settonalidadesCopia] = useState([])
    const [cargandotonalidades, setCargandotonalidades] = useState(false)
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);

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
        obtenertonalidades()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

      const obtenertonalidades = () =>{
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodasTonalidades`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            settonalidades(finalResp[0])
            setCargandotonalidades(true)
            settonalidadesCopia(finalResp[0])
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
            obtenertonalidades()
        }else{
            const filteredRows = tonalidadesCopia.filter((row) => {
                return row.Nombre_Tonalidad.toLowerCase().includes(texto.toLowerCase())
              });
              settonalidades(filteredRows)
        }
      }

    const  editarTonalidad = (ID_Tonalidad,Nombre_Tonalidad,Clave_Tonalidad) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Tonalidad ${Nombre_Tonalidad}`,
            html: `<label>Nombre Del Tonalidad</label>
            <br />
            <input type="text" id="nTon" class="swal2-input" value='${Nombre_Tonalidad}' placeholder="Nombre Del Tonalidad">
            <br />
            <label>Clave Del Tonalidad</label>
            <br />
            <input type="text" id="cTon" class="swal2-input" value='${Clave_Tonalidad}' placeholder="Clave Del Tonalidad">`,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito El Tonalidad', 'error')
            }else{
              
                const nTon = Swal.getPopup().querySelector('#nTon').value
                const cTon = Swal.getPopup().querySelector('#cTon').value
                if (!nTon || !cTon) {
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
                  formData.append("tipo","modificarTonalidad")
                  formData.append("id",ID_Tonalidad)
                  formData.append("nTon",nTon)
                  formData.append("cTon",cTon)
  
                  fetch(`${apiURL}configuraciones.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenertonalidades()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
    }

    const agregarTonalidad = ()=>{
      Swal.fire({
        allowOutsideClick: false,
        title: `Agregar Tonalidad`,
        html: `<label>Nombre Del Tonalidad</label>
        <br />
        <input type="text" id="nTon" class="swal2-input" placeholder="Nombre Del Tonalidad">
        <br />
        <label>Clave Del Tonalidad</label>
        <br />
        <input type="text" id="cTon" class="swal2-input" placeholder="Clave Del Tonalidad">`,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isDismissed){
          Swal.fire('Accion Cancelada', 'No Se Agrego El Tonalidad', 'error')
        }else{
            const nTon = Swal.getPopup().querySelector('#nTon').value
            const cTon = Swal.getPopup().querySelector('#cTon').value
            if (!nTon || !cTon) {
              Swal.showValidationMessage(`Porfavor llena Ambos Campos`)
            }else{
              //Hacer Petición API
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
              let formData = new FormData();
              formData.append("tipo","agregarTonalidad")
              formData.append("nTon",nTon)
              formData.append("cTon",cTon)

              fetch(`${apiURL}configuraciones.php`,{
                  method:'POST',
                  body:formData
              })
              .then(async(resp) =>{
                  const {estatus,mensaje} = await resp.json()
                  if(estatus){
                      Swal.fire('Correcto', mensaje, 'success')
                      obtenertonalidades()
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
  <BarraSuperior pag='Tonalidades' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De tonalidades</h3>
    {(!cargandotonalidades) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : <Button onClick={agregarTonalidad} title='Agregar Proveedor' key='AgregarPro' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Tonalidad</Button>}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Tonalidad</TableCell>
            <TableCell align="center">Clave Del Tonalidad</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandotonalidades) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(tonalidades!=undefined) ? tonalidades.slice(pg * rpg, pg * rpg + rpg).map(({ID_Tonalidad,Nombre_Tonalidad,Clave_Tonalidad}) =>(
            <TableRow
              key={ID_Tonalidad}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Tonalidad}</TableCell>
              <TableCell align="center">{Clave_Tonalidad}</TableCell>
              <TableCell align="center">
                <Button onClick={() => editarTonalidad(ID_Tonalidad,Nombre_Tonalidad,Clave_Tonalidad)} title='Editar' key={`a${ID_Tonalidad}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
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
        {(tonalidades!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={tonalidades.length}
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
