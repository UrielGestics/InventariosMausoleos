//React, States, etc
import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';


export const Login = () => {
    const [obscuro, setobscuro] = useState('dark')

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
    <ThemeProvider theme={darkTheme}>
    <CssBaseline />
    <h3>Login Hola</h3>
    <Button variant="contained" onClick={cambiarModo}>Cambiar Modo</Button>
  </ThemeProvider>
  )
}
