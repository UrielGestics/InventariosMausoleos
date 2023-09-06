//React, States, etc
import React, { useEffect, useState } from 'react'

// MaterialUI
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import { Box, Divider, FilledInput, IconButton, InputAdornment, InputLabel, Typography } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//SweetAlert
import Swal from 'sweetalert2';

//Funciones Propias
import { apiURL } from '../../functiones'

//Navegación
import { useNavigate } from 'react-router-dom';



export const Login = () => {

  const navigate = useNavigate();

    useEffect(() => {
      if(localStorage.logged){
        navigate('/inicio')
      }
    })
    

    const handleClickShowPassword = () => setshowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    //Modo Oscuro
    const [obscuro, setobscuro] = useState('dark')

    const [showPassword, setshowPassword] = useState(false)

    const validarModoOscuro = () => {
        if(localStorage.oscuro == 'true') {
            localStorage.oscuro = 'true'
            setobscuro('dark')
        }else{
            localStorage.oscuro = 'false'
            setobscuro('light')
        } 
    }
    useEffect(() => {validarModoOscuro()}, [])
    

const darkTheme = createTheme({
    palette: {
        mode: obscuro,
    },
});


const iniciarSesion = () =>{
  const email = document.getElementById("email").value;
  const clave = document.getElementById("clave").value;

  if(email == '' || clave == ''){
    Swal.fire(
      'error',
      'Tienes que proporcionar el correo y la contraseña',
      'error'
    )
  }
  else if(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
    let formData = new FormData();
    formData.append("tipo", "login");
    formData.append("correo", email);
    formData.append("Clave", clave);
  
  
    fetch(`${apiURL}usuarios.php`,{
      method: 'POST',
      body: formData
    })
    .then(async(resp) =>{
      const finalResp = await resp.json();
      if(!finalResp.estatus){
        Swal.fire(
          'Error',
          finalResp.mensaje,
          'error'
        )
      }else{
        localStorage.id = finalResp[0][0].ID;
        localStorage.tipo = finalResp[0][0].Tipo;
        localStorage.PAdministrador = finalResp[0][0].PAdministrador;
        localStorage.PTodasPlazas = finalResp[0][0].PTodasPlazas;
        localStorage.PTodasSucursales = finalResp[0][0].PTodasSucursales;
        localStorage.PReportes = finalResp[0][0].PReportes;
        localStorage.PInvetarioPlaza = finalResp[0][0].PInvetarioPlaza;
        localStorage.PCaptura = finalResp[0][0].PCaptura;
        localStorage.PRecepcion = finalResp[0][0].PRecepcion;
        localStorage.PConsulta = finalResp[0][0].PConsulta;
        localStorage.PMovimientos = finalResp[0][0].PMovimientos;
        localStorage.PCatalogos = finalResp[0][0].PCatalogos;
        localStorage.logged = true;
        navigate('/inicio')
      }
    })
  }else{
    Swal.fire(
      'error',
      'Tienes que proporcionar el correo correcto',
      'error'
    )
  }
}
const mOscuro = localStorage.oscuro
  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    {/* <Button variant="contained" onClick={cambiarModo}>C</Button> */}
    <Grid container spacing={2} style={{marginTop:'5%', width: '99%'}}>
      {/* Imagen */}
  <Grid item md={9} lg={6} xl={6} xs={12} sm={12} >
    <img style={{width: '534px'}} src="https://inventariosmausoleos.com/assets/logoMausoleos.png"
          className="img-fluid"></img>
  </Grid>
  {/* Formulario */}
  <Grid item md={8} lg={6} xl={6} >
    <h2 style={{textAlign: 'center'}}>Iniciar Sesion</h2>
    <FormControl fullWidth style={{marginTop: '22px', marginLeft: '5px', marginRight: '5px'}}  variant="filled">
          <InputLabel htmlFor="email">Correo Electronico</InputLabel>
          <FilledInput
            id="email"
            startAdornment={<InputAdornment position="start">@</InputAdornment>}
          />
        </FormControl>
        
        <FormControl fullWidth  style={{marginTop: '82px', marginLeft: '5px', marginRight: '5px'}} variant="filled">
          <InputLabel htmlFor="clave">Contraseña</InputLabel>
          <FilledInput
            id="clave"
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />
        </FormControl>
           
        <FormControl fullWidth sx={{ m: -1,  }} style={{marginTop: '82px'}} >
        <Button onClick={iniciarSesion} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} size="large"><b>Iniciar Sesion</b></Button>
        </FormControl>

  </Grid>

</Grid>

<Divider sx={{ my: 2 }} />

  </ThemeProvider>
  )
}
