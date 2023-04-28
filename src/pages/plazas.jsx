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


export const Plazas = () => {
  const navigate = useNavigate();

  const [obscuro, setobscuro] = useState()
  const [plazas, setplazas] = useState([])
  const [plazasCopia, setplazasCopia] = useState([])
  const [cargandoplazas, setCargandoplazas] = useState(false)
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
      obtenerPlazas()
      validarNotLoggedPage()
  }, [])
  
  const  validarNotLoggedPage = () => {
    if (localStorage.logged == undefined) {
        navigate('/login')
    }
}

    const obtenerPlazas = () =>{
      fetch(`${apiURL}configuraciones.php?tipo=obtenerTodasPlazas`)
      .then(async(resp) =>{
          const finalResp = await resp.json();
          setplazas(finalResp[0])
          setCargandoplazas(true)
          setplazasCopia(finalResp[0])
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
          obtenerPlazas()
      }else{
          const filteredRows = plazasCopia.filter((row) => {
              return row.Plaza.toLowerCase().includes(texto.toLowerCase())
            });
             setplazas(filteredRows)
      }
    }

  const  editarPlaza = (ID_Plaza,Plaza,Clave) =>{
      Swal.fire({
          allowOutsideClick: false,
          title: `Modificar Plaza ${Plaza}`,
          html: `<label>Nombre Del Plaza</label>
          <br />
          <input type="text" id="nPro" class="swal2-input" value='${Plaza}' placeholder="Nombre Del Plaza">
          <br />
          <label>Clave Del Plaza</label>
          <br />
          <input type="text" id="cPro" class="swal2-input" value='${Clave}' placeholder="Clave Del Plaza">`,
          confirmButtonText: 'Editar',
          showCancelButton: true,
          cancelButtonText: 'Cancelar'
        }).then((result) => {
          if(result.isDismissed){
            Swal.fire('Accion Cancelada', 'No Se Edito La Plaza', 'error')
          }else{
            
              const nPro = Swal.getPopup().querySelector('#nPro').value
              const cPro = Swal.getPopup().querySelector('#cPro').value
              if (!nPro || !cPro) {
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
                formData.append("tipo","modificarPlaza")
                formData.append("id",ID_Plaza)
                formData.append("nPlaza",nPro)
                formData.append("cPlaza",cPro)
                formData.append("oPlaza",Plaza)

                fetch(`${apiURL}plazas.php`,{
                    method:'POST',
                    body:formData
                })
                .then(async(resp) =>{
                    const {estatus,mensaje} = await resp.json()
                    if(estatus){
                        Swal.fire('Correcto', mensaje, 'success')
                        obtenerPlazas()
                    }else{
                        Swal.fire('Error', mensaje, 'error')
                    }
                })
              }
          }
        })
  }

  const agregarPlaza = ()=>{
    Swal.fire({
      allowOutsideClick: false,
      title: `Agregar Plaza`,
      html: `<label>Nombre Del Plaza</label>
      <br />
      <input type="text" id="pPro" class="swal2-input" placeholder="Nombre Del Plaza">
      <br />
      <label>Clave Del Plaza</label>
      <br />
      <input type="text" id="cPro" class="swal2-input" placeholder="Clave Del Plaza">`,
      confirmButtonText: 'Agregar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isDismissed){
        Swal.fire('Accion Cancelada', 'No Se Agrego El Plaza', 'error')
      }else{
          const pPro = Swal.getPopup().querySelector('#pPro').value
          const cPro = Swal.getPopup().querySelector('#cPro').value
          if (!pPro || !cPro) {
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
            formData.append("tipo","agregarPlaza")
            formData.append("pPlaza",pPro)
            formData.append("cPlaza",cPro)

            fetch(`${apiURL}plazas.php`,{
                method:'POST',
                body:formData
            })
            .then(async(resp) =>{
                const {estatus,mensaje} = await resp.json()
                if(estatus){
                    Swal.fire('Correcto', mensaje, 'success')
                    obtenerPlazas()
                }else{
                    Swal.fire('Error', mensaje, 'error')
                }
            })
          }
      }
    })
  }

  const iraPag = (ID,Plaza) =>{
    navigate(`/sucursalesPlaza/${ID}/${Plaza}`);
  }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Plazas' />
  <Box component="main" sx={{ flexGrow: 1, p: 1 }}>
    <Toolbar />
    <h3 style={{textAlign: 'center'}}>Lista De Plazas</h3>
    {(!cargandoplazas) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : <Button onClick={agregarPlaza} title='Agregar Plaza' key='AgregarPro' variant="contained" color='success' style={{float: 'right', marginBottom: '5px', color: 'white'}} size="small"><i className="bi bi-plus-circle" style={{marginRight : '10px'}}></i> Agregar Plaza</Button>}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre De Plaza</TableCell>
            <TableCell align="center">Clave De Plaza</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoplazas) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(plazas!=undefined) ? plazas.slice(pg * rpg, pg * rpg + rpg).map(({ID_Plaza,Plaza,Clave}) =>(
            <TableRow
              key={ID_Plaza}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Plaza}</TableCell>
              <TableCell align="center">{Clave}</TableCell>
              <TableCell align="center">
              <Button onClick={() => editarPlaza(ID_Plaza,Plaza,Clave)} title='Editar' key={`a${ID_Plaza}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              <Button onClick={() => iraPag(ID_Plaza,Plaza)} title='Ver Productos' key={`c${ID_Plaza}`} variant="contained" color='primary' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-eye"></i></Button>
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
        {(plazas!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={plazas.length}
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
