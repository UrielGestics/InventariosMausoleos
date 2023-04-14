import React from 'react'

//MaterialUI
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

//Mis Componentes
import { Nabvar } from '../components/nabvar'

export const BarraSuperior = ({pag}) => {
  return (
    <>
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Inventarios Mausoleos
          </Typography>
        </Toolbar>
      </AppBar>
    <Nabvar active={pag} />
    </>
    
      
  )
}
