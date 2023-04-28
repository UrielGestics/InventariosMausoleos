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


export const Ceremonias = () => {
  const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [ceremonias, setceremonias] = useState([])
    const [ceremoniasCopia, setceremoniasCopia] = useState([])
    const [cargandoceremonias, setCargandoceremonias] = useState(false)
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
        obtenerCeremonias()
        validarNotLoggedPage()
    }, [])
    
    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

      const obtenerCeremonias = () =>{
        fetch(`${apiURL}ceremonias.php?tipo=obtenerTodasCeremonias`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setceremonias(finalResp[0])
            setCargandoceremonias(true)
            setceremoniasCopia(finalResp[0])
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
            obtenerCeremonias()
        }else{
            const filteredRows = ceremoniasCopia.filter((row) => {
                return row.Portafolio.toLowerCase().includes(texto.toLowerCase())
              });
               setceremonias(filteredRows)
        }
      }

    const  editarCeremonia = (ID_Ceremonia,Portafolio) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Ceremonia ${Portafolio}`,
            html: `<label>Portafolio</label>
            <br />
            <input type="text" id="portafolio" class="swal2-input" value='${Portafolio}' placeholder="Portafolio">
            `,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito La Ceremonia', 'error')
            }else{
              
                const porta = Swal.getPopup().querySelector('#portafolio').value
                if (!porta) {
                  Swal.showValidationMessage(`Porfavor llena El Portafolio`)
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
                  formData.append("tipo","modificarCeremonia")
                  formData.append("id",ID_Ceremonia)
                  formData.append("portafolio",porta)
                  formData.append("oPortafolio",Portafolio)
  
                  fetch(`${apiURL}ceremonias.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerCeremonias()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
    }

    const agregarCeremonia = ()=>{
      Swal.fire({
        allowOutsideClick: false,
        title: `Agregar Ceremonia`,
        html: `<label>Portafolio</label>
        <br />
        <input type="text" id="portafolio" class="swal2-input" placeholder="Portafolio">
        `,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isDismissed){
          Swal.fire('Accion Cancelada', 'No Se Agrego La Ceremonia', 'error')
        }else{
            const portafolio = Swal.getPopup().querySelector('#portafolio').value
            if (!portafolio) {
              Swal.showValidationMessage(`Porfavor llena El portafolio`)
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
              formData.append("tipo","agregarCeremonia")
              formData.append("portafolio",portafolio)

              fetch(`${apiURL}ceremonias.php`,{
                  method:'POST',
                  body:formData
              })
              .then(async(resp) =>{
                  const {estatus,mensaje} = await resp.json()
                  if(estatus){
                      Swal.fire('Correcto', mensaje, 'success')
                      obtenerCeremonias()
                  }else{
                      Swal.fire('Error', mensaje, 'error')
                  }
              })
            }
        }
      })
    }

    const iraPag = (ID,Nombre_Proveedor) =>{
      navigate(`/productosProveedor/${ID}/${Nombre_Proveedor}`);
    }
    const iraPag2 = (ID,Nombre_Proveedor) =>{
      navigate(`/productosProveedorDeshabilitados/${ID}/${Nombre_Proveedor}`);
    }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Ceremonias' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De Ceremonias</h3>
    {(!cargandoceremonias) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : <Button onClick={agregarCeremonia} title='Agregar Proveedor' key='AgregarPro' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Ceremonia</Button>}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Portafolio</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoceremonias) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(ceremonias!=undefined) ? ceremonias.slice(pg * rpg, pg * rpg + rpg).map(({ID_Ceremonia,Portafolio}) =>(
            <TableRow
              key={ID_Ceremonia}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Portafolio}</TableCell>
              <TableCell align="center">
              <Button onClick={() => editarCeremonia(ID_Ceremonia,Portafolio)} title='Editar' key={`a${ID_Ceremonia}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              {/* <Button onClick={() => iraPag(ID_Ceremonia,Nombre_Proveedor)} title='Ver Productos' key={`c${ID_Ceremonia}`} variant="contained" color='primary' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-eye"></i></Button>
              <Button onClick={() => iraPag2(ID_Ceremonia,Nombre_Proveedor)} title='Ver Productos Deshabilitados' key={`c${ID_Ceremonia}`} variant="contained" color='secondary' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-eye-slash"></i></Button> */}
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
        {(ceremonias!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={ceremonias.length}
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
