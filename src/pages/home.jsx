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

//Mis Componenetes
import { BarraSuperior }  from '../components/barraSuperios';

export const Home = () => {
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

    const ira = (ruta) =>{
        navigate(ruta)
    }

    return (
        <ThemeProvider theme={darkTheme} >
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <BarraSuperior pag='Administrador' />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Button variant="contained" onClick={() => ira('/usuarios')} style={{height: '300px', width:'100%', backgroundColor: '#BAA247'}} size="large"><i style={{color:'white', fontSize: '150px'}} className="bi bi-people"></i></Button>
        <hr />
        <Button variant="contained"  style={{height: '300px', width:'100%', backgroundColor: '#BAA247'}} size="large"><i style={{color:'white', fontSize: '150px'}} className="bi bi-card-checklist"></i></Button>
      </Box>
    </Box>
        </ThemeProvider>
    );
}

