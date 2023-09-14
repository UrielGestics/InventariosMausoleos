import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
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
import Skeleton from '@mui/material/Skeleton';

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';
import { apiURL } from '../functiones';

import { QRious } from 'react-qrious'

export const Articulos = () => {
    const [obscuro, setobscuro] = useState()
    const [pg, setpg] = React.useState(0);
    const [rpg, setrpg] = React.useState(5);
    const [articulos, setarticulos] = useState([])
    const [cargandoarticulos, setcargandoarticulos] = useState(false)
    const [articulosCopia, setarticulosCopia] = useState([])
    const [articuloSelecionado, setarticuloSelecionado] = useState('')
    const [plazas, setplazas] = useState([])
    const [sucursales, setsucursales] = useState([])
    const [selectSucursales, setselectSucursales] = useState([])
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

    //Validar Usuario Logeado
    const navigate = useNavigate();

    useEffect(() => {
        
        validarNotLoggedPage()
        validarModoOscuro()
        obtenerTodosArticulos()
        obtenerPlazas()
    },[])

    const obtenerPlazas = ()=>{
        fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPlazas`)
        .then(async(resp) =>{
            const finalResp = await resp.json();
            setplazas(finalResp[0])

        })
    }

    const obtenerTodosArticulos = () =>{
        
        Swal.showLoading()
            fetch(`${apiURL}articulos.php?tipo=obtenerTodosArticulosConsulta`)
            .then(async(resp) =>{
                const finalResp = await resp.json()
                setarticulos(finalResp[0])
                setarticulosCopia(finalResp[0])
                setcargandoarticulos(true)
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


    const  validarNotLoggedPage = () => {
        if (localStorage.logged == undefined) {
            navigate('/login')
        }
    }

    const requestSearch = (texto) => {
        if(texto == ''){
            obtenerTodosArticulos()
        }else{
            const filteredRows = articulosCopia.filter((row) => {
                return row.Nombre_Articulo.toLowerCase().includes(texto.toLowerCase())
              });
              setarticulos(filteredRows)
        }
      }

      const obtenerSucursalesPlaza = (ID_Plaza)=>{
        fetch(`${apiURL}plazas.php?tipo=obtenerTodasSucursalesPorPlazas&id=${ID_Plaza}`)
            .then(async(res) =>{
              const finalResp2 = await res.json()
              setsucursales(finalResp2[0])

            })
      } 

    const editarArt = (ID) =>{
      navigate('/editarArticulos/'+ID)
    }

    const bajaArt = (ID) =>{
      let formData = new FormData()
      formData.append("tipo","bajaArticulo")
      formData.append("ID",ID)
      fetch(`${apiURL}articulos.php`,{
        method:'post',
        body:formData
      })
      .then(async(resp)=>{
        const finalResp = await resp.json()
        if(finalResp.estatus){
          Swal.fire('Exito',finalResp.mensaje,'success')
          .then(()=>{
            obtenerTodosArticulos()
          })
        }else{
          Swal.fire('Error','Lo sentimos hubo un error favor de reintentar')
          
        }
      })
      .catch(err=>{
        Swal.fire('Error','Lo sentimos hubo un error favor de reintentar')
      })
    }

    const altaArt = (ID) =>{
      let formData = new FormData()
      formData.append("tipo","altaArticulo")
      formData.append("ID",ID)
      fetch(`${apiURL}articulos.php`,{
        method:'post',
        body:formData
      })
      .then(async(resp)=>{
        const finalResp = await resp.json()
        if(finalResp.estatus){
          Swal.fire('Exito',finalResp.mensaje,'success')
          .then(()=>{
            obtenerTodosArticulos()
          })
        }else{
          Swal.fire('Error','Lo sentimos hubo un error favor de reintentar')
        }
        
      })
      .catch(err=>{
        Swal.fire('Error','Lo sentimos hubo un error favor de reintentar')
        
      })
    }

    const mostrarQR = (QR,nombre) =>{
      Swal.showLoading()
      document.getElementById("QRS").hidden = false
      setQR(QR)
      setnombre(nombre)
      
    setTimeout(() => {
      var win = window.open('', '', 'height=700,width=1000'); // Open the window. Its a popup window.
      win.document.write('<html><head><title></title>');
      win.document.write('<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" />');
      win.document.write('</head><body >');
          win.document.write(document.getElementById("QRS").outerHTML);     // Write contents in the new window.
          win.document.write('</body></html>');
          win.document.close();
          win.print();
          win.addEventListener("afterprint", (event) => {
    
              setTimeout(() => {
                document.getElementById("QRS").hidden = true
                  Swal.close()
              }, 1000);
          })
    }, 100);

    }

  return (
    <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Administrador' />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <h3 style={{textAlign: 'center'}}>Articulos</h3>

        <SearchComponent placeholder='Buscar' onChangeHandle={(texto) =>requestSearch(texto)}/>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Código QR</TableCell>
            <TableCell align="center">Proveedor</TableCell>
            <TableCell align="center">Articulo Del Proveedor</TableCell>
            <TableCell align="center">Plaza</TableCell>
            <TableCell align="center">Sucursal</TableCell>
            <TableCell align="center">Orden De Compra</TableCell>
            <TableCell align="center">Precio</TableCell>
            <TableCell align="center">Estatus</TableCell>
            <TableCell align="center">Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(!cargandoarticulos) ?
            <TableRow key='Skeleton' sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell align="center" colSpan={3}> <Skeleton /></TableCell>
            </TableRow>
          :(articulos!=undefined) ? articulos.slice(pg * rpg, pg * rpg + rpg).map(({Estatus,ID_Articulo,Codigo_QR,Nombre_Proveedor,Nombre_Articulo,Plaza,Nombre_Sucursal,Orden_Compra,Costo}) =>(
            <TableRow
              key={ID_Articulo}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              
              <TableCell align="center">{Codigo_QR}</TableCell>
              <TableCell align="center">{Nombre_Proveedor}</TableCell>
              <TableCell align="center">{Nombre_Articulo}</TableCell>
              <TableCell align="center">{Plaza}</TableCell>
              <TableCell align="center">{Nombre_Sucursal}</TableCell>
              <TableCell align="center">{Orden_Compra}</TableCell>
              <TableCell align="center">{Costo}</TableCell>
              <TableCell align="center">{(Estatus == 'Baja') ? 'Baja' : 'Alta'}</TableCell>
              <TableCell align="center">
              <Button className='ms-3' title='MostrarQR' onClick={() =>mostrarQR(Codigo_QR,Nombre_Articulo)} variant="contained" color='info' style={{color: 'white'}} size="small"><i className="bi bi-printer-fill"></i></Button>
              <Button className='ms-3' title='Editar' onClick={() =>editarArt(ID_Articulo)} variant="contained" color='warning' style={{color: 'white'}} size="small"><i className="bi bi-pencil-square"></i></Button>
              
              {(Estatus == 'Baja') ? <Button className='ms-3' title='Dar De Alta' onClick={() =>altaArt(ID_Articulo)} variant="contained" color='success' style={{color: 'white'}} size="small"><i className="bi bi-check-circle-fill"></i></Button> : <Button className='ms-3' title='Dar De Baja' onClick={() =>bajaArt(ID_Articulo)} variant="contained" color='error' style={{color: 'white'}} size="small"><i className="bi bi-x-circle-fill"></i></Button>}
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

       <div hidden id='QRS' className='row' style={{marginBottom:'17px', marginLeft:'25px'}}>
          <QRious className="mainImg col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6 col-xxl-6" value={QR} size={70}  foreground='black' level='H'  />
          <label style={{marginLeft:'-15px'}} className="col-xs-5 col-sm-5 col-md-5 col-lg-5 col-xl-5 col-xxl-5">  
          {QR}
          <br />
          {nombre} 
        </label>
         </div>

    </TableContainer>
      </Box>
    </Box>
        </ThemeProvider>
  )
}
