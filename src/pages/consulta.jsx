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

import { QRious } from 'react-qrious'


//Funciones Propias
import { apiURL } from '../functiones'

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Consulta = () => {
    const [obscuro, setobscuro] = useState()
    const [articulos, setarticulos] = useState([])
    const [articulosCopia, setarticulosCopia] = useState([])
    const [cargandoarticulos, setCargandoarticulos] = useState(false)
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
    const [QR, setQR] = useState('')
    const [nombre, setnombre] = useState('')
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
        obtenerarticulos()}, [])

    //Validar Usuario Logeado
    const navigate = useNavigate();

    useEffect(() => {
        validarNotLoggedPage()
    })

    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const obtenerarticulos = () =>{
        fetch(`${apiURL}articulos.php?tipo=obtenerTodosArticulosPorUsuarioSucursal&plazaUsario=${localStorage.id}`)
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

    const requestSearch = (texto) => {
        if(texto == ''){
            obtenerarticulos()
        }else{
            const filteredRows = articulosCopia.filter((row) => {
                return row.Portafolio.toLowerCase().includes(texto.toLowerCase())
              });
              setarticulos(filteredRows)
        }
      }

      const mostrarQR = (QR,nombre) =>{
        Swal.showLoading()
        document.getElementById("QRS").hidden = false
        setQR(QR)
        setnombre(nombre)
        
      setTimeout(() => {
        var win = window.open('', '', 'height=700,width=1000'); // Open the window. Its a popup window.
    win.document.write('<html><head><title></title>');
    //win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />');
    win.document.write('</head><style>label{font-size:6.3px !important}</style><style>.etiqueta{margin-right:-1cm !important}</style></body>');
        win.document.write(document.getElementById("QRS").outerHTML);     // Write contents in the new window.
        win.document.write('</body></html>');
        win.document.close();
        win.print();
        win.addEventListener("afterprint", (event) => {
  
            setTimeout(() => {
  
                window.location.reload()
            }, 1000);
        })
      }, 100);
  
      }

    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Consulta' />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
      {/* <iframe title="Report Section" width="1000" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiNjljOTQ5MmUtYWM3Mi00ZWM2LTkxMjYtMDMzYTc1N2U5MWQ4IiwidCI6IjBmM2RjM2FhLTQ0MWQtNGU2YS1iMWQzLWM0YTBlMjMxMzQ2MiJ9" frameborder="0" allowFullScreen="true"></iframe> */}
      <h3 style={{textAlign: 'center'}}>Lista De Articulos</h3>
    {(!cargandoarticulos) ? <CircularProgress color="success" style={{float: 'right', marginBottom: '5px'}}  /> : ''}
    <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Clave De Articulo</TableCell>
            <TableCell align="center">Nombre Del Articulo</TableCell>
            <TableCell align="center">Estatus</TableCell>
            <TableCell align="center">Plaza</TableCell>
            <TableCell align="center">Sucursal</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoarticulos) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={8}> <Skeleton /></TableCell>
            </TableRow>
          :(articulos!=undefined) ? articulos.slice(pg * rpg, pg * rpg + rpg).map(({Estatus,Clave_Articulo,Nombre_Articulo,Plaza,Nombre_Sucursal,Codigo_QR}) =>(
            <TableRow
              key={Clave_Articulo}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Clave_Articulo}</TableCell>
              <TableCell align="center">{Nombre_Articulo}</TableCell>
              <TableCell align="center">{Estatus}</TableCell>
              <TableCell align="center">{Plaza}</TableCell>
              <TableCell align="center">{Nombre_Sucursal}</TableCell>
              <TableCell align="center"><Button className='ms-3' title='MostrarQR' onClick={() =>mostrarQR(Codigo_QR,Nombre_Articulo)} variant="contained" color='info' style={{color: 'white'}} size="small"><i className="bi bi-printer-fill"></i></Button></TableCell>
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
       <div hidden id='QRS' className='etiqueta' style={{ height:'1.563cm'}}>
       <QRious style={{width:'1.3cm',float: 'left'}} value={QR}  foreground='black' level='H'  />
       
       <label  style={{width:'1.6cm', marginRight:'0.1cm',  marginTop:'6px', float: 'left'}} >
       {QR}
       <br />
       {nombre} 
     </label>
    
      </div>

    </TableContainer>
      
      </Box>
    </Box>
        </ThemeProvider>
    );
}


