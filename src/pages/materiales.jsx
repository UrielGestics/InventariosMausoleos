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
export const Materiales = () => {

    const [obscuro, setobscuro] = useState()
    const [materiales, setmateriales] = useState([])
    const [materialesCopia, setmaterialesCopia] = useState([])
    const [cargandomateriales, setCargandomateriales] = useState(false)
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
        obtenerMateriales()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

      const obtenerMateriales = () =>{
        fetch(`${apiURL}configuraciones.php?tipo=obtenerTodosMateriales`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setmateriales(finalResp[0])
            setCargandomateriales(true)
            setmaterialesCopia(finalResp[0])
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
            obtenerMateriales()
        }else{
            const filteredRows = materialesCopia.filter((row) => {
                return row.Nombre_Material.toLowerCase().includes(texto.toLowerCase())
              });
              setmateriales(filteredRows)
        }
      }

    const  editarMaterial = (ID_Material,Nombre_Material,Clave_Material) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Material ${Nombre_Material}`,
            html: `<label>Nombre Del Material</label>
            <br />
            <input type="text" id="nMat" class="swal2-input" value='${Nombre_Material}' placeholder="Nombre Del Material">
            <br />
            <label>Clave Del Material</label>
            <br />
            <input type="text" id="cMat" class="swal2-input" value='${Clave_Material}' placeholder="Clave Del Material">`,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito El Material', 'error')
            }else{
              
                const nMat = Swal.getPopup().querySelector('#nMat').value
                const cMat = Swal.getPopup().querySelector('#cMat').value
                if (!nMat || !cMat) {
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
                  formData.append("tipo","modificarMaterial")
                  formData.append("id",ID_Material)
                  formData.append("nMat",nMat)
                  formData.append("cMat",cMat)
  
                  fetch(`${apiURL}configuraciones.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerMateriales()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
    }

    const agregarMaterial = ()=>{
      Swal.fire({
        allowOutsideClick: false,
        title: `Agregar Material`,
        html: `<label>Nombre Del Material</label>
        <br />
        <input type="text" id="nMat" class="swal2-input" placeholder="Nombre Del Material">
        <br />
        <label>Clave Del Material</label>
        <br />
        <input type="text" id="cMat" class="swal2-input" placeholder="Clave Del Material">`,
        confirmButtonText: 'Agregar',
        showCancelButton: true,
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isDismissed){
          Swal.fire('Accion Cancelada', 'No Se Agrego El Material', 'error')
        }else{
            const nMat = Swal.getPopup().querySelector('#nMat').value
            const cMat = Swal.getPopup().querySelector('#cMat').value
            if (!nMat || !cMat) {
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
              formData.append("tipo","agregarMaterial")
              formData.append("nMat",nMat)
              formData.append("cMat",cMat)

              fetch(`${apiURL}configuraciones.php`,{
                  method:'POST',
                  body:formData
              })
              .then(async(resp) =>{
                  const {estatus,mensaje} = await resp.json()
                  if(estatus){
                      Swal.fire('Correcto', mensaje, 'success')
                      obtenerMateriales()
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
  <BarraSuperior pag='Materiales' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De Materiales</h3>
    {(!cargandomateriales) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : <Button onClick={agregarMaterial} title='Agregar Proveedor' key='AgregarPro' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Material</Button>}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Material</TableCell>
            <TableCell align="center">Clave Del Material</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandomateriales) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(materiales!=undefined) ? materiales.slice(pg * rpg, pg * rpg + rpg).map(({ID_Material,Nombre_Material,Clave_Material}) =>(
            <TableRow
              key={ID_Material}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Material}</TableCell>
              <TableCell align="center">{Clave_Material}</TableCell>
              <TableCell align="center">
                <Button onClick={() => editarMaterial(ID_Material,Nombre_Material,Clave_Material)} title='Editar' key={`a${ID_Material}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
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
        {(materiales!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={materiales.length}
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
