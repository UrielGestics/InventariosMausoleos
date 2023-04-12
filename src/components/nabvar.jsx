import React from 'react'

//MaterialUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

//FONT Awesome Icons

// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'




const drawerWidth = 240;

const arregloIconos = ['bi bi-emoji-sunglasses','bi bi-archive','bi bi-geo-alt','bi bi-file-bar-graph-fill']
const arregloIconos2 = ['','bi bi-person-badge','bi bi-door-closed']

const mOscuro = localStorage.oscuro




export const Nabvar = () => {

  
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
    <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
          {/* <ListItem key={'Inventarios'}>
          <ListItemButton>
                  <ListItemIcon>
                  <MailIcon /> 
                  </ListItemIcon>
                  <ListItemText primary={'Inventarios'} />
                </ListItemButton>
          </ListItem> */}
            {['Administrador','Inventarios', 'Sucursal', 'Reportes'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  <i className={arregloIconos[index]}></i>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Modo Oscuro', 'Perfil', 'Salir'].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                  {(index == 0) ?(mOscuro == 'true') ?<i onClick={cambiarModo} className='bi bi-toggle-on'></i> : <i onClick={cambiarModo} className='bi bi-toggle-off'></i> : <i className={arregloIconos2[index]}></i>}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

  )
}
