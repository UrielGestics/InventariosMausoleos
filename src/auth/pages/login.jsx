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



export const Login = () => {
    const [obscuro, setobscuro] = useState('dark')

    const [showPassword, setshowPassword] = useState(false)

    const handleClickShowPassword = () => setshowPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };
  

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

const cambiarModo = () =>{
   if(localStorage.oscuro == 'true'){
    localStorage.oscuro = 'false'
    setobscuro('light')
   }else{
    localStorage.oscuro = 'true'
    setobscuro('dark')
   }
}

  return (
    <ThemeProvider theme={darkTheme} >
    <CssBaseline />
    {/* <Button variant="contained" onClick={cambiarModo}>C</Button> */}
    <Grid container spacing={2} style={{marginTop:'5%', width: '99%'}}>
      {/* Imagen */}
  <Grid item md={9} lg={6} xl={5} onClick={cambiarModo}>
    <img style={{width: '100%'}} src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
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
        <Button variant="contained" size="large"><b>Iniciar Sesion</b></Button>
        </FormControl>

  </Grid>

</Grid>

<Divider sx={{ my: 2 }} />

  </ThemeProvider>
  )
}
