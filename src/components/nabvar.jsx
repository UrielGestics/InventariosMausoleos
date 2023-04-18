import React, { useEffect } from 'react'

//MaterialUI
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

//Navegación
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;
//50
const arregloIconos = ['bi bi-emoji-sunglasses','bi bi-geo-alt','bi bi-file-bar-graph-fill']
const arregloIconos2 = ['','bi bi-person-badge','bi bi-door-closed']
const arregloIconosInventarios = ['bi bi-card-checklist','bi bi-mailbox2','bi bi-search','bi bi-arrow-down-up']

const mOscuro = localStorage.oscuro

export const Nabvar = ({active}) => {

  const navigate = useNavigate();

const irAPag = (text) =>{
  if(text == 'Salir'){
    //Cerrar Sesion
    delete localStorage.logged;
    delete localStorage.id;
    navigate('/login')

  }else if(text == 'Administrador'){
    navigate('/inicio')
  }else{
    navigate(`/${text}`)
  }
}

const cambiarModo = () =>{
  if(localStorage.oscuro == 'true') {
    localStorage.oscuro = 'false'
}else{
    localStorage.oscuro = 'true'
} 
  window.location.reload()
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
            {['Administrador', 'Sucursal', 'Reportes'].map((text, index) => (
              <ListItem key={text} disablePadding onClick={() =>irAPag(text) } style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}>
                <ListItemButton>
                  <ListItemIcon>
                  <i className={arregloIconos[index]} style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}></i>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <i className="bi bi-arrows-angle-contract"></i>
          <h4 style={{textAlign: 'center'}}>Inventarios</h4>
          <List>
          {['Captura', 'Recepción', 'Consulta', 'Movimientos'].map((text, index) => (
              <ListItem key={text} disablePadding onClick={() =>irAPag(text) } style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}>
                <ListItemButton>
                  <ListItemIcon>
                  <i className={arregloIconosInventarios[index]} style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}></i>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <h4 style={{textAlign: 'center'}}>Configuraciones</h4>
          <List>
          {['Proveedores', 'Materiales', 'Colores', 'Tonalidades'].map((text, index) => (
              <ListItem key={text} disablePadding onClick={() =>irAPag(text) } style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}>
                <ListItemButton>
                  <ListItemIcon>
                  <i className={arregloIconosInventarios[index]} style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}></i>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['Modo Oscuro', 'Perfil', 'Salir'].map((text, index) => (
              <ListItem key={text} disablePadding onClick={(index == 0) ? cambiarModo : () =>irAPag(text) } style= {(text == active) ? (mOscuro == 'true') ?{ backgroundColor: '#B49A37' } : { backgroundColor: '#9b7c0a', color: 'white' } : {}}>
                <ListItemButton>
                  <ListItemIcon>
                  {(index == 0) ?(mOscuro == 'true') ?<i className='bi bi-toggle-on'></i> : <i className='bi bi-toggle-off'></i> : <i className={arregloIconos2[index]}></i>}
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
