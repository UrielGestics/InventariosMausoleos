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

export const Colores = () => {

    const [obscuro, setobscuro] = useState()
    const [colores, setcolores] = useState([])
    const [coloresCopia, setcoloresCopia] = useState([])
    const [cargandocolores, setCargandocolores] = useState(false)
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
        obtenerColores()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

      const obtenerColores = () =>{
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodosColores`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setcolores(finalResp[0])
            setCargandocolores(true)
            setcoloresCopia(finalResp[0])
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
            obtenerColores()
        }else{
            const filteredRows = coloresCopia.filter((row) => {
                return row.Nombre_Color.toLowerCase().includes(texto.toLowerCase())
              });
              setcolores(filteredRows)
        }
      }

    const  editarColor = (ID_Color,Nombre_Color,Clave_Color) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Color ${Nombre_Color}`,
            html: `<label>Nombre Del Color</label>
            <br />
            <input type="text" id="nCol" class="swal2-input" value='${Nombre_Color}' placeholder="Nombre Del Color">
            <br />
            <label>Clave Del Color</label>
            <br />
            <input type="text" id="cCol" class="swal2-input" value='${Clave_Color}' placeholder="Clave Del Color">`,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito El Color', 'error')
            }else{
              
                const nCol = Swal.getPopup().querySelector('#nCol').value
                const cCol = Swal.getPopup().querySelector('#cCol').value
                if (!nCol || !cCol) {
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
                  formData.append("tipo","modificarColor")
                  formData.append("id",ID_Color)
                  formData.append("nCol",nCol)
                  formData.append("cCol",cCol)
  
                  fetch(`${apiURL}configuraciones.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerColores()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
    }

    const agregarColor = ()=>{
      Swal.fire({
        allowOutsideClick: false,
        title: `Agregar Color`,
        html: `<label>Nombre Del Color</label>
        <br />
        <input type="text" id="nCol" class="swal2-input" placeholder="Nombre Del Color">
        <br />
        <label>Clave Del Color</label>
        <br />
        <input type="text" id="cCol" class="swal2-input" placeholder="Clave Del Color">`,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isDismissed){
          Swal.fire('Accion Cancelada', 'No Se Agrego El Color', 'error')
        }else{
            const nCol = Swal.getPopup().querySelector('#nCol').value
            const cCol = Swal.getPopup().querySelector('#cCol').value
            if (!nCol || !cCol) {
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
              formData.append("tipo","agregarColor")
              formData.append("nCol",nCol)
              formData.append("cCol",cCol)

              fetch(`${apiURL}configuraciones.php`,{
                  method:'POST',
                  body:formData
              })
              .then(async(resp) =>{
                  const {estatus,mensaje} = await resp.json()
                  if(estatus){
                      Swal.fire('Correcto', mensaje, 'success')
                      obtenerColores()
                  }else{
                      Swal.fire('Error', mensaje, 'error')
                  }
              })
            }
        }
      })
    }

    const deshabilitarColor = (ID_Color,Nombre_Color) =>{
      Swal.fire({
        title: `¿Seguro Que Quieres Deshabilitar El Color? ${Nombre_Color}`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si, Deshabilitado',
        denyButtonText: 'No, Cancelar',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
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
            //Deshabilitar Proveedor
            let formData = new FormData();
            formData.append("tipo","habilitarDeshabilitarColor");
            formData.append("id",ID_Color);
            formData.append("accion",'Baja');

            fetch(`${apiURL}configuraciones.php`,{
                method: 'post',
                body: formData
            })
            .then(async(resp) =>{
                const {estatus,mensaje} = await resp.json();
                if(estatus){
                    Swal.fire('Correcto', mensaje, 'success')
                    obtenerColores()
                }else{
                    Swal.fire('Error', `Hubo un error al Deshabilitar El Color ${Nombre_Color}`, 'error')
                }
            })
        } else if (result.isDenied) {
          Swal.fire('Accion Cancelada', 'No Se Deshabilito El Color', 'error')
        }
      })
    }

    const habilitarColor = (ID_Color,Nombre_Color)=>{
      Swal.fire({
        title: `¿Seguro Que Quieres Habilitar El Color? ${Nombre_Color}`,
        showDenyButton: true,
        showCancelButton: false,
        confirmButtonText: 'Si, Habilitado',
        denyButtonText: 'No, Cancelar',
        allowOutsideClick: false
      }).then((result) => {
        if (result.isConfirmed) {
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
            //Deshabilitar Proveedor
            let formData = new FormData();
            formData.append("tipo","habilitarDeshabilitarColor");
            formData.append("id",ID_Color);
            formData.append("accion",'Activo');

            fetch(`${apiURL}configuraciones.php`,{
                method: 'post',
                body: formData
            })
            .then(async(resp) =>{
                const {estatus,mensaje} = await resp.json();
                if(estatus){
                    Swal.fire('Correcto', mensaje, 'success')
                    obtenerColores()
                }else{
                    Swal.fire('Error', `Hubo un error al Habilitar El Color ${Nombre_Color}`, 'error')
                }
            })
        } else if (result.isDenied) {
          Swal.fire('Accion Cancelada', 'No Se Habilito El Color', 'error')
        }
      })
    }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Colores' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De colores</h3>
    {(!cargandocolores) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : <Button onClick={agregarColor} title='Agregar Proveedor' key='AgregarPro' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Color</Button>}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Color</TableCell>
            <TableCell align="center">Clave Del Color</TableCell>
            <TableCell align="center">Estatus</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandocolores) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(colores!=undefined) ? colores.slice(pg * rpg, pg * rpg + rpg).map(({ID_Color,Nombre_Color,Clave_Color,Estatus}) =>(
            <TableRow
              key={ID_Color}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Color}</TableCell>
              <TableCell align="center">{Clave_Color}</TableCell>
              <TableCell align="center">{Estatus}</TableCell>
              <TableCell align="center">
                <Button onClick={() => editarColor(ID_Color,Nombre_Color,Clave_Color)} title='Editar' key={`a${ID_Color}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
                {(Estatus == 'Activo') ? 
              <Button title='Baja' onClick={() => deshabilitarColor(ID_Color,Nombre_Color)} key={`b${ID_Color}`} variant="contained" color='error' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-trash"></i></Button> : 
              <Button title='Habilitar' onClick={() => habilitarColor(ID_Color,Nombre_Color)} key={`c${ID_Color}`} variant="contained" color='success' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-check-circle"></i></Button>}
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
        {(colores!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={colores.length}
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
