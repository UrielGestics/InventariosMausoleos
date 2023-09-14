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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import CircularProgress from '@mui/material/CircularProgress';
import Skeleton from '@mui/material/Skeleton';

//SweetAlert
import Swal from 'sweetalert2';




//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const InventarioPlaza = () => {
    const [obscuro, setobscuro] = useState()
    const [articulos, setarticulos] = useState([])
    const [articulosCopia, setarticulosCopia] = useState([])
    const [cargandoarticulos, setCargandoarticulos] = useState(false)
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
    const [plazas, setplazas] = useState([])
    const [plazasNombre, setplazasNombre] = useState([])
    const [totalArticulos, setTotalArticulos] = useState('')
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
        obtenerCostoTotalArticulos()
        obtenerarticulos()}, [])

    //Validar Usuario Logeado
    const navigate = useNavigate();

    useEffect(() => {
        validarNotLoggedPage()
        obtenerPlazas()
    }, [])

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const obtenerarticulos = () =>{
        fetch(`${apiURL}articulos.php?tipo=obtenerArticulosAgrupados`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setarticulos(finalResp[0])
            setCargandoarticulos(true)
            setarticulosCopia(finalResp[0])
        })
    } 
  
    function handleChangePage(event, newpage) {
        setpg(newpage);
    }
  
    function handleChangeRowsPerPage(event) {
        setrpg(parseInt(event.target.value, 10));
        setpg(0);
    }

    const obtenerPlazas = () =>{
        fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setplazas(finalResp[0])
        })
    }

    const obtenerCostoTotalArticulos = () =>{
        fetch(`${apiURL}articulos.php?tipo=obtenerCostoTotalArticulos`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setTotalArticulos(finalResp[0][0].Suma)
        })
    }

    const obtenerCostoTotalArticulosFiltro = (plaza) =>{
      console.log(plaza)
      fetch(`${apiURL}articulos.php?tipo=obtenerCostoTotalArticulosFiltro&plaza=${plaza}`)
      .then(async(resp) =>{
          const finalResp = await resp.json();
         
          setTotalArticulos(finalResp[0][0].Suma)
      })
  }

    const requestSearch = (texto) => {
        if(texto == ''){
            obtenerarticulos()
        }else{
            const filteredRows = articulosCopia.filter((row) => {
                return row.Clave_Articulo.toLowerCase().includes(texto.toLowerCase())
              });
              setarticulos(filteredRows)
        }
      }

      const cambioPlazaSelect = (event) =>{
        if(event.target.value == 'Todos'){
            obtenerarticulos()
        }else{
            fetch(`${apiURL}articulos.php?tipo=obtenerArticulosAgrupadosPorPlaza&plaza=${event.target.value}`)
            .then(async(resp) =>{
                const finalResp = await resp.json();
                setarticulos(finalResp[0])
                setCargandoarticulos(true)
                setarticulosCopia(finalResp[0])
                obtenerCostoTotalArticulosFiltro(event.target.value)
            })
        }
        

      }

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    <Box sx={{ display: 'flex' }}>
  <CssBaseline />
  <BarraSuperior pag='Inventario Plaza' />
  <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
    <Toolbar />
  {/* <iframe title="Report Section" width="1000" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiNjljOTQ5MmUtYWM3Mi00ZWM2LTkxMjYtMDMzYTc1N2U5MWQ4IiwidCI6IjBmM2RjM2FhLTQ0MWQtNGU2YS1iMWQzLWM0YTBlMjMxMzQ2MiJ9" frameborder="0" allowFullScreen="true"></iframe> */}
  <h3 style={{textAlign: 'center'}}>Inventario Por Plaza</h3>
{(!cargandoarticulos) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : ''}

<Select labelId="labelPlaza" id="selectPlaza" style={{width: '100%'}} label="Plaza" onChange={cambioPlazaSelect}>
<MenuItem data-clave='Todos' key='TodasPlaza' value='Todos'>Todos</MenuItem>
{plazas.map(({ID_Plaza,Plaza,Clave}, idx) =>{
    return(
    <MenuItem data-clave={Clave} key={ID_Plaza} value={ID_Plaza}>{Plaza}</MenuItem>
    );
})}
</Select>
<hr />
<SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
<hr />
<TableContainer component={Paper}>
  <Table sx={{ minWidth: 650 }} aria-label="simple table">
    <TableHead>
      <TableRow>
        <TableCell align="center">Plaza</TableCell>
        <TableCell align="center">Clave Del Articulo</TableCell>
        <TableCell align="center">Nombre Del Articulo</TableCell>
        <TableCell align="center">Cantidad</TableCell>
        <TableCell align="center">Costo</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {(!cargandoarticulos) ?
        <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell align="center" colSpan={8}> <Skeleton /></TableCell>
        </TableRow>
      :(articulos!=undefined) ? articulos.slice(pg * rpg, pg * rpg + rpg).map(({Plaza,Clave_Articulo,Cantidad,Costo,Nombre_Articulo}, idx) =>(
        <TableRow
          key={idx}
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          
          <TableCell align="center">{Plaza}</TableCell>
          <TableCell align="center">{Clave_Articulo}</TableCell>
          <TableCell align="center">{Nombre_Articulo}</TableCell>
          <TableCell align="center">{Cantidad}</TableCell>
          <TableCell align="center">{Costo}</TableCell>
          
        </TableRow>
      ))
      
      : 
      <TableRow
          key='SIN Datos'
          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
        >
          
          <TableCell align="center" colSpan={3}><b id="nDatos" style={{fontSize: '20px'}}>No Hay Datos</b></TableCell>
        </TableRow>
      }
    </TableBody>
    {(articulos!=undefined) ? 
    <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            labelRowsPerPage='Resultados Por Página'
            count={articulos.length}
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
  <div  style={{ marginLeft: '80%'}}>
    <h1 >Total: ${Intl.NumberFormat('en-US').format(totalArticulos)}</h1>
  </div>
  </Box>
</Box>
    </ThemeProvider>
  )
}
