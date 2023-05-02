import React, { useEffect, useState } from 'react'

import { useNavigate } from 'react-router-dom';

//Modo Oscuro
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';

//MaterialUI
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Consulta = () => {
    const [obscuro, setobscuro] = useState()
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
    useEffect(() => {validarModoOscuro()}, [])

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

    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Consulta' />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
      <iframe title="Report Section" width="1000" height="800" src="https://app.powerbi.com/view?r=eyJrIjoiNjljOTQ5MmUtYWM3Mi00ZWM2LTkxMjYtMDMzYTc1N2U5MWQ4IiwidCI6IjBmM2RjM2FhLTQ0MWQtNGU2YS1iMWQzLWM0YTBlMjMxMzQ2MiJ9" frameborder="0" allowFullScreen="true"></iframe>
      </Box>
    </Box>
        </ThemeProvider>
    );
}


