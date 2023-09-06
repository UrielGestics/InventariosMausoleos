import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilledInput from '@mui/material/FilledInput';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Swal from 'sweetalert2';
import TablePagination from "@mui/material/TablePagination";
import SearchComponent from "react-material-ui-searchbar";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';
import { apiURL } from '../functiones';


export const Usuarios = () => {
    const [obscuro, setobscuro] = useState()
    const [usuarios, setUsuarios] = useState([])
    const [cargandoUsuarios, setcargandoUsuarios] = useState(false)
  const [pg, setpg] = React.useState(0);
  const [rpg, setrpg] = React.useState(5);
  const [usuariosCopia, setusuariosCopia] = useState([])
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

    //Validar Usuario Logeado
    const navigate = useNavigate();

    useEffect(() => {
        
        validarNotLoggedPage()
        validarModoOscuro()
        obtenerTodosUsuarios()
    },[])

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const iraPag = () =>{
      navigate('/agregarUsuario')
    }
    const obtenerTodosUsuarios = () =>{
        
    Swal.showLoading()
        fetch(`${apiURL}usuarios.php?tipo=obtenerTodosUsuarios`)
        .then(async(resp) =>{
            const finalResp = await resp.json()
            setUsuarios(finalResp[0])
            setusuariosCopia(finalResp[0])
            setcargandoUsuarios(true)
            Swal.close()
        })
        .catch(err =>{
            Swal.fire('Error','Hubo un error favor de reintentar','error')
            Swal.close()
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
            obtenerTodosUsuarios()
        }else{
            const filteredRows = usuariosCopia.filter((row) => {
                return row.Nombre.toLowerCase().includes(texto.toLowerCase())
              });
               setUsuarios(filteredRows)
        }
      }
      const ira = (ID) =>{
        navigate(`/usuariosDatos/${ID}`);
      }

      const Deshabilitar = (ID_Usuario) =>{
        Swal.showLoading()
        let formData = new FormData()
        formData.append("ID_Usuario",ID_Usuario)
        formData.append("tipo","DeshabilitarUsuario")

        fetch(`${apiURL}usuarios.php`,{
          method: 'post',
          body: formData
        })
        .then(async(resp) =>{
          const finalResp = await resp.json()
          if(finalResp.estatus){
            Swal.fire('Correcto',finalResp.mensaje,'success')
            .then(resp =>{
              obtenerTodosUsuarios()
            })
          }else{
            Swal.fire('Error','Hubo un error reintenta nuevamente','error')
          }
        })
        .catch(err =>{
          Swal.fire('Error','Hubo un error reintenta nuevamente ','error')
        })
      }

      const Habilitar = (ID_Usuario) =>{
        Swal.showLoading()
        let formData = new FormData()
        formData.append("ID_Usuario",ID_Usuario)
        formData.append("tipo","HabilitarUsuario")

        fetch(`${apiURL}usuarios.php`,{
          method: 'post',
          body: formData
        })
        .then(async(resp) =>{
          const finalResp = await resp.json()
          if(finalResp.estatus){
            Swal.fire('Correcto',finalResp.mensaje,'success')
            .then(resp =>{
              obtenerTodosUsuarios()
            })
          }else{
            Swal.fire('Error','Hubo un error reintenta nuevamente','error')
          }
        })
        .catch(err =>{
          Swal.fire('Error','Hubo un error reintenta nuevamente ','error')
        })
      }

    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Usuarios' />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Usuarios</h3>

        <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Nombre De Usuario</TableCell>
            <TableCell align="center">Correo</TableCell>
            <TableCell align="center">Fecha Registro</TableCell>
            <TableCell align="center">Estatus</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoUsuarios) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(usuarios!=undefined) ? usuarios.slice(pg * rpg, pg * rpg + rpg).map(({ID,Nombre,Correo,Tipo,Fecha_Registro,Estatus}) =>(
            <TableRow
              key={ID}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Nombre}</TableCell>
              <TableCell align="center">{Correo}</TableCell>
              <TableCell align="center">{Fecha_Registro}</TableCell>
              <TableCell align="center">{Estatus}</TableCell>
              <TableCell align="center">
              <Button title='Editar' onClick={() => ira(ID)} key={`a${ID}`} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              {(Estatus == 'Activo') ?  <Button className='ms-3' onClick={() => Deshabilitar(ID)} title='Deshabilitar' variant="contained" color='error' style={{color: 'white'}} size="small"><i className="bi bi-x-circle-fill"></i></Button>  :  <Button onClick={() => Habilitar(ID)} className='ms-3' title='Habilitar' variant="contained" color='success' style={{color: 'white'}} size="small"><i className="bi bi-check-circle-fill"></i></Button>}
              {/* <Button title='Ver Productos' key={`c${ID}`} variant="contained" color='primary' style={{color: 'white', marginLeft : '10px'}} size="small"><i className="bi bi-eye"></i></Button> */}
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
        {(usuarios!=undefined) ? 
        <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                labelRowsPerPage='Resultados Por Página'
                count={usuarios.length}
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
    <Button onClick={iraPag}  style={{width: '100%'}} size="large"><b>Agregar Usuario</b></Button> 
      </Box>
    </Box>
        </ThemeProvider>
    );
}
