import React, { useEffect, useState } from 'react'

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
import AppBar from '@mui/material/AppBar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
//Navegación
import { useNavigate } from 'react-router-dom';
import { apiURL } from '../functiones';
import { Height } from '@mui/icons-material';

const drawerWidth = 240;
//50
const arregloIconos = [(localStorage.tipo == 'Admin') ? 'bi bi-emoji-sunglasses' : '','bi bi-geo-alt','bi bi-file-bar-graph-fill','bi bi-wallet']
const arregloIconos2 = ['','bi bi-person-badge','bi bi-door-closed']
const arregloIconosInventarios = ['bi bi-card-checklist','bi bi-mailbox2','bi bi-search','bi bi-arrow-down-up']
const arregloIconosConfiguraciones = ['bi bi-people','bi bi-person-x','bi bi-brightness-alt-high-fill','bi bi-box-seam','bi bi-palette','bi bi-paint-bucket']

const mOscuro = localStorage.oscuro

export const Nabvar = ({active}) => {

  const [cambiartamano, setcambiartamano] = useState(50)

  const navigate = useNavigate();

  const validarDispositivo = () =>{
    if( navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)|| navigator.userAgent.match(/Windows Phone/i)){
      setcambiartamano(50)
     }else{
       setcambiartamano(240)
     }
  }

  useEffect(() => {
    validarDispositivo()
  }, [])
  

const irAPag = (text) =>{
  if(text == 'Salir'){
    //Cerrar Sesion
    delete localStorage.logged;
    delete localStorage.id;
    navigate('/login')

  }else if(text == 'Administrador'){
    if(localStorage.tipo == 'Admin') {
      navigate('/inicio')
    }else{
      
    }
  }else if(text == 'Proveedores Deshabilitados'){
    navigate('/proveedoresDeshabilitados')
  }else if(text == 'Inventario Plaza'){
    navigate('/inventarioPlaza')
  }else{
    console.log(text)
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

const cambiartamanof = () =>{
  if(cambiartamano == 240){
    setcambiartamano(50)
  }else{
    setcambiartamano(240)
  }
}

const mostrarNotificaciones = () =>{
  fetch(`${apiURL}movimientos.php?tipo=mostrarNotificacionesAdmin`)
}

  return (
    <>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            <Button onClick={cambiartamanof}><i style={{ color: "white", fontSize: "20px" }} className="bi bi-justify"></i></Button>
          </Typography>
          <label>Inventarios Mausoleos</label>
          {/* <Grid
            justify="space-between" // Add it here :)
            container
          ></Grid> */}
          {/* <Button onClick={mostrarNotificaciones} className={(mOscuro == 'true') ? 'btnMausoleosPrimaryDark' : 'btnMausoleosPrimaryLight'} ><b><i style={{color:'white', fontSize: '25px'}} className="bi bi-bell-fill"></i></b></Button> */}
        </Toolbar>
        
      </AppBar>
      
      
      <Drawer
        variant="permanent"
        sx={{
          width: cambiartamano,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: cambiartamano,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <h4 style={{ textAlign: "center" }}>
            {cambiartamano == 240 ? "Principal" : ""}
          </h4>
          <List>
            {[(localStorage.tipo == 'Admin') ? "Administrador" : '', "Plazas", "Reportes", "Inventario Plaza"].map(
              (text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  onClick={() => (localStorage.tipo != 'Admin' && text == '') ? irAPag('Plazas') :  irAPag(text)}
                  style={
                    text == active
                      ? mOscuro == "true"
                        ? { backgroundColor: "#B49A37" }
                        : { backgroundColor: "#9b7c0a", color: "white" }
                      : {}
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <i
                        id={text}
                        className={arregloIconos[index]}
                        style={
                          text == active
                            ? mOscuro == "true"
                              ? { backgroundColor: "#B49A37" }
                              : { backgroundColor: "#9b7c0a", color: "white" }
                            : {}
                        }
                      ></i>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <h4 style={{ textAlign: "center" }}>
            {" "}
            {cambiartamano == 240 ? "Inventarios" : ""}
          </h4>
          <List>
            {["Captura", "Recepción", "Consulta", "Movimientos"].map(
              (text, index) => (
                <ListItem
                  key={text}
                  disablePadding
                  onClick={() => irAPag(text)}
                  style={
                    text == active
                      ? mOscuro == "true"
                        ? { backgroundColor: "#B49A37" }
                        : { backgroundColor: "#9b7c0a", color: "white" }
                      : {}
                  }
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <i
                        className={arregloIconosInventarios[index]}
                        style={
                          text == active
                            ? mOscuro == "true"
                              ? { backgroundColor: "#B49A37" }
                              : { backgroundColor: "#9b7c0a", color: "white" }
                            : {}
                        }
                      ></i>
                    </ListItemIcon>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <h4 style={{ textAlign: "center" }}>
            {cambiartamano == 240 ? "Catalogos" : ""}
          </h4>
          <List>
            {[
              "Proveedores",
              "Proveedores Deshabilitados",
              //"Ceremonias",
              //"Materiales",
              //"Colores",
              //"Tonalidades",
            ].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                onClick={() => irAPag(text)}
                style={
                  text == active
                    ? mOscuro == "true"
                      ? { backgroundColor: "#B49A37" }
                      : { backgroundColor: "#9b7c0a", color: "white" }
                    : {}
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    <i
                      className={arregloIconosConfiguraciones[index]}
                      style={
                        text == active
                          ? mOscuro == "true"
                            ? { backgroundColor: "#B49A37" }
                            : { backgroundColor: "#9b7c0a", color: "white" }
                          : {}
                      }
                    ></i>
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <h4 style={{ textAlign: "center" }}>
            {cambiartamano == 240 ? "Configuraciones" : ""}
          </h4>
          <List>
            {["Modo Oscuro", 
            //"Perfil", 
            "Salir"].map((text, index) => (
              <ListItem
                key={text}
                disablePadding
                onClick={index == 0 ? cambiarModo : () => irAPag(text)}
                style={
                  text == active
                    ? mOscuro == "true"
                      ? { backgroundColor: "#B49A37" }
                      : { backgroundColor: "#9b7c0a", color: "white" }
                    : {}
                }
              >
                <ListItemButton>
                  <ListItemIcon>
                    {index == 0 ? (
                      mOscuro == "true" ? (
                        <i className="bi bi-toggle-on"></i>
                      ) : (
                        <i className="bi bi-toggle-off"></i>
                      )
                    ) : (
                      <i className={arregloIconos2[index]}></i>
                    )}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
}
