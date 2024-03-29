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
import { apiURL, monedaMX } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const ProductosProveedor = () => {
    let { id, nombre } = useParams();
    const navigate = useNavigate();

    const [obscuro, setobscuro] = useState()
    const [articulosproveedores, setArticulosProveedores] = useState([])
    const [articulosproveedoresCopia, setArticulosProveedoresCopia] = useState([])
    const [cargandoarticulosproveedores, setCargandoArticulosProveedores] = useState(false)
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
        obtenerArticulosProveedores()
        validarNotLoggedPage()
    }, [])

    const  validarNotLoggedPage = () => {
      if (localStorage.logged == undefined) {
          navigate('/login')
      }
  }

    const obtenerArticulosProveedores = () =>{
        fetch(`${apiURL}proveedores.php?tipo=obtenerArtProveedor&provedorID=${id}`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setArticulosProveedores(finalResp[0])
            setArticulosProveedoresCopia(finalResp[0])
            setCargandoArticulosProveedores(true)
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
            obtenerArticulosProveedores()
        }else{
            const filteredRows = articulosproveedoresCopia.filter((row) => {
                return row.Nombre_Articulo.toLowerCase().includes(texto.toLowerCase())
              });
               setArticulosProveedores(filteredRows)
        }
      }

      const regresar = () =>{
        navigate(`/Proveedores`);
      }

      const agregarArticuloProveedor = () =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Agregar Arituclo A ${nombre}`,
            html: `<label>Nombre Del Articulo</label>
            <br />
            <input type="text" id="nArtPro" class="swal2-input" placeholder="Nombre Del Articulo">
            <br />
            <label>Clave Del Articulo</label>
            <br />
            <input type="text" id="cArtPro" class="swal2-input" placeholder="Clave Del Articulo">
            <br />
            <label>Precio</label>
            <br />
            <input type="number" id="cPrecioPro" class="swal2-input" placeholder="Precio">
            `,
            confirmButtonText: 'Agregar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Agrego El Articulo', 'error')
            }else{
                const nArtPro = Swal.getPopup().querySelector('#nArtPro').value
                const cArtPro = Swal.getPopup().querySelector('#cArtPro').value
                const cPrecioPro = Swal.getPopup().querySelector('#cPrecioPro').value
                if (!nArtPro || !cArtPro || !cPrecioPro) {
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
                  formData.append("tipo","agregarArtProveedor")
                  formData.append("nArtPro",nArtPro)
                  formData.append("cArtPro",cArtPro)
                  formData.append("cPrecioPro",cPrecioPro)
                  formData.append("id",id)
    
                  fetch(`${apiURL}proveedores.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerArticulosProveedores()
                      }else{
                          Swal.fire('Error', mensaje, 'error')
                      }
                  })
                }
            }
          })
      }

      const desHabilitarArtProveedor =(ID_ArticuloXProveedor,Nombre_Articulo) =>{
        Swal.fire({
            title: `¿Seguro Que Quieres Deshabilitar El Articulo? ${Nombre_Articulo}`,
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
                formData.append("tipo","deshabilitarArtProveedor");
                formData.append("ID_ArticuloXProveedor",ID_ArticuloXProveedor);
                formData.append("nArtProveedor",Nombre_Articulo);

                fetch(`${apiURL}proveedores.php`,{
                    method: 'post',
                    body: formData
                })
                .then(async(resp) =>{
                    const {estatus,mensaje} = await resp.json();
                    if(estatus){
                        Swal.fire('Correcto', mensaje, 'success')
                        obtenerArticulosProveedores()
                    }else{
                        Swal.fire('Error', `Hubo un error al Deshabilitar El Proveedor ${Nombre_Articulo}`, 'error')
                    }
                })
            } else if (result.isDenied) {
              Swal.fire('Accion Cancelada', 'No Deshabilito El Proveedor', 'error')
            }
          })
    }

    const editarArtProveedor = (ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo,Precio) =>{
        Swal.fire({
            allowOutsideClick: false,
            title: `Modificar Articulo ${Nombre_Articulo}`,
            html: `<label>Nombre Del Articulo</label>
            <br />
            <input type="text" id="nArtPro" class="swal2-input" value='${Nombre_Articulo}' placeholder="Nombre Del Articulo">
            <br />
            <label>Clave Del Articulo</label>
            <br />
            <input type="text" id="cArtPro" class="swal2-input" value='${Clave_Articulo}' placeholder="Clave Del Proveedor">
            <br />
            <label>Precio</label>
            <br />
            <input type="number" id="cPrecioPro" class="swal2-input" value='${Precio}' placeholder="Precio">
            `,
            confirmButtonText: 'Editar',
            showCancelButton: true,
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if(result.isDismissed){
              Swal.fire('Accion Cancelada', 'No Se Edito El Proveedor', 'error')
            }else{
              
                const nArtPro = Swal.getPopup().querySelector('#nArtPro').value
                const cArtPro = Swal.getPopup().querySelector('#cArtPro').value
                const cPrecioPro = Swal.getPopup().querySelector("#cPrecioPro").value
                if (!nArtPro || !cArtPro || !cPrecioPro) {
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
                  formData.append("tipo","modificarArtProveedor")
                  formData.append("id",ID_ArticuloXProveedor)
                  formData.append("nArtPro",nArtPro)
                  formData.append("cArtPro",cArtPro)
                  formData.append("cPrecioPro",cPrecioPro)
  
                  fetch(`${apiURL}proveedores.php`,{
                      method:'POST',
                      body:formData
                  })
                  .then(async(resp) =>{
                      const {estatus,mensaje} = await resp.json()
                      if(estatus){
                          Swal.fire('Correcto', mensaje, 'success')
                          obtenerArticulosProveedores()
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
      <BarraSuperior pag='Proveedores' />
      <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Lista De Articulos De {nombre}</h3>
        {(!cargandoarticulosproveedores) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : 
        <>
        <Button onClick={agregarArticuloProveedor} title='Agregar' key='AgregarArt' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Articulo</Button>
        <Button onClick={regresar} title='Regresar' key='RregresarArt' variant="contained" color='error' style={{float: 'right', marginRight: '10px', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-arrow-left-circle" style={{marginRight : '10px'}}></i> Regresar</Button>
        </>
        }
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre Del Articulo</TableCell>
            <TableCell align="center">Clave Del Articulo</TableCell>
            <TableCell align="center">Precio</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoarticulosproveedores) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(articulosproveedores!=undefined) ? articulosproveedores.slice(pg * rpg, pg * rpg + rpg).map(({ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo,Precio}) =>(
            <TableRow
              key={ID_ArticuloXProveedor}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre_Articulo}</TableCell>
              <TableCell align="center">{Clave_Articulo}</TableCell>
              <TableCell align="center">{monedaMX.format(Precio)}</TableCell>
              <TableCell align="center">
              <Button  onClick={() => editarArtProveedor(ID_ArticuloXProveedor,Nombre_Articulo,Clave_Articulo, Precio)} title='Editar' key={`a${ID_ArticuloXProveedor}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              <Button onClick={() => desHabilitarArtProveedor(ID_ArticuloXProveedor,Nombre_Articulo)}  title='Baja' key={`b${ID_ArticuloXProveedor}`} variant="contained" color='error' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-trash"></i></Button>
             
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
        {(articulosproveedores!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={articulosproveedores.length}
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
    
