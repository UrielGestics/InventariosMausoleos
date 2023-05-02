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

export const ProductosCeremoniaDeshabilitados = () => {
    let { id, nombre } = useParams();
    const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [articulosceremonias, setarticulosceremonias] = useState([])
    const [articulosceremoniasCopia, setarticulosceremoniasCopia] = useState([])
    const [cargandoarticulosceremonias, setCargandoarticulosceremonias] = useState(false)
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
        obtenerarticulosceremonias()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

    const obtenerarticulosceremonias = () =>{
        fetch(`${apiURL}ceremonias.php?tipo=obtenerArticulosCeremoniasBaja&ID_Ceremonia=${id}`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setarticulosceremonias(finalResp[0])
            setarticulosceremoniasCopia(finalResp[0])
            setCargandoarticulosceremonias(true)
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
            obtenerarticulosceremonias()
        }else{
            const filteredRows = articulosceremoniasCopia.filter((row) => {
                return row.Nombre_Articulo.toLowerCase().includes(texto.toLowerCase())
              });
               setarticulosceremonias(filteredRows)
        }
      }

      const regresar = () =>{
        navigate(`/Ceremonias`);
      }

      const habilitarArtCeremonia =(ID_CeremoniasXArticulo,Nombre_Articulo) =>{
        Swal.fire({
            title: `¿Seguro Que Quieres Habilitar El Articulo? ${Nombre_Articulo}`,
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
                formData.append("tipo","habilitarArtCeremonia");
                formData.append("ID_CeremoniasXArticulo",ID_CeremoniasXArticulo);

                fetch(`${apiURL}ceremonias.php`,{
                    method: 'post',
                    body: formData
                })
                .then(async(resp) =>{
                    const {estatus,mensaje} = await resp.json();
                    if(estatus){
                        Swal.fire('Correcto', mensaje, 'success')
                        obtenerarticulosceremonias()
                    }else{
                        Swal.fire('Error', `Hubo un error al Habilitar El Articulo ${Nombre_Articulo}`, 'error')
                    }
                })
            } else if (result.isDenied) {
              Swal.fire('Accion Cancelada', 'No Habilito El Articulo', 'error')
            }
          })
    }

   
    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Ceremonias' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Lista De Articulos De {nombre}</h3>
        {(!cargandoarticulosceremonias) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : 
        <>
        <Button onClick={regresar} title='Regresar' key='RregresarArt' variant="contained" color='error' style={{float: 'right', marginRight: '10px', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-arrow-left-circle" style={{marginRight : '10px'}}></i> Regresar</Button>
        </>
        }
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Articulo</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoarticulosceremonias) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(articulosceremonias!=undefined) ? articulosceremonias.slice(pg * rpg, pg * rpg + rpg).map(({ID_CeremoniasXArticulo,Nombre_Articulo}) =>(
            <TableRow
              key={ID_CeremoniasXArticulo}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Articulo}</TableCell>
              <TableCell align="center">
              <Button onClick={() => habilitarArtCeremonia(ID_CeremoniasXArticulo,Nombre_Articulo)}  title='Baja' key={`b${ID_CeremoniasXArticulo}`} variant="contained" color='success' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-check-circle"></i></Button>
             
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
        {(articulosceremonias!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={articulosceremonias.length}
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
    
