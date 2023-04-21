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


export const ProveedoresDeshabilitados = () => {
  const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [proveedores, setproveedores] = useState([])
    const [proveedoresCopia, setproveedoresCopia] = useState([])
    const [cargandoproveedores, setCargandoproveedores] = useState(false)
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
        obtenerProveedores()
    }, [])

      const obtenerProveedores = () =>{
        fetch(`${apiURL}proveedores.php?tipo=obtenerTodosProveedoresDeshabilitados`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setproveedores(finalResp[0])
            setCargandoproveedores(true)
            setproveedoresCopia(finalResp[0])
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
            obtenerProveedores()
        }else{
            const filteredRows = proveedoresCopia.filter((row) => {
                return row.Nombre_Proveedor.toLowerCase().includes(texto.toLowerCase())
              });
               setproveedores(filteredRows)
        }
      }

    const habilitarProveedor =(ID_Proveedor,Nombre_Proveedor) =>{
        Swal.fire({
            title: `¿Seguro Que Quieres Habilitar El Proveedor? ${Nombre_Proveedor}`,
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
                formData.append("tipo","habilitarProveedor");
                formData.append("id",ID_Proveedor);
                formData.append("nProveedor",Nombre_Proveedor);

                fetch(`${apiURL}proveedores.php`,{
                    method: 'post',
                    body: formData
                })
                .then(async(resp) =>{
                    const {estatus,mensaje} = await resp.json();
                    if(estatus){
                        Swal.fire('Correcto', mensaje, 'success')
                        obtenerProveedores()
                    }else{
                        Swal.fire('Error', `Hubo un error al Habilitar El Proveedor ${Nombre_Proveedor}`, 'error')
                    }
                })
            } else if (result.isDenied) {
              Swal.fire('Accion Cancelada', 'No Se Habilito El Proveedor', 'error')
            }
          })
    }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Proveedores Deshabilitados' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De Proveedores (Baja)</h3>
    {(!cargandoproveedores) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : ''}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Proveedor</TableCell>
            <TableCell align="center">Clave Del Proveedor</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoproveedores) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(proveedores!=undefined) ? proveedores.slice(pg * rpg, pg * rpg + rpg).map(({ID_Proveedor,Nombre_Proveedor,Clave_Proveedor}) =>(
            <TableRow
              key={ID_Proveedor}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Proveedor}</TableCell>
              <TableCell align="center">{Clave_Proveedor}</TableCell>
              <TableCell align="center">
              <Button onClick={()=>habilitarProveedor(ID_Proveedor,Nombre_Proveedor)} title='Habilitar' key={`b${ID_Proveedor}`} variant="contained" color='success' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-check-circle"></i></Button>
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
        {(proveedores!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={proveedores.length}
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