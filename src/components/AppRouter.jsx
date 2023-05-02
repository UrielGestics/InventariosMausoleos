import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../auth/pages/login"
import { Home } from '../pages/home'
import { Invetarios } from '../pages/invetarios'
import { Plazas } from '../pages/plazas'
import { Reportes } from '../pages/reportes'
import { Perfil } from '../pages/perfil'
import { Captura } from '../pages/captura'
import { Proveedores } from '../pages/proveedores'
import { ProductosProveedor } from '../pages/productosProveedor'
import { ProductosProveedorDeshabilitados } from '../pages/productosProveedorDeshabilitados'
import { ProveedoresDeshabilitados } from '../pages/proveedoresDeshabilitados'
import { Materiales } from '../pages/materiales'
import { Colores } from '../pages/colores'
import { Tonalidades } from '../pages/tonalidades'
import { SucursalesPlaza } from '../pages/sucursalesPlaza'
import { Ceremonias } from "../pages/ceremonias"
import { ProductosCeremonia } from "../pages/productosCeremonia"
import { ProductosCeremoniaDeshabilitados } from "../pages/productosCeremoniaDeshabilitados"
import { Consulta } from "../pages/consulta"

export const AppRouter = () => {
  return (
    <>
    <Routes>
      <Route path="/" element = {<Navigate to='/login' />}></Route>
      <Route  path="login" element = {<Login />}></Route>
      <Route  path="inicio" element = {<Home />}></Route>
      <Route  path="Inventarios" element = {<Invetarios />}></Route>
      <Route  path="Plazas" element = {<Plazas />}></Route>
      <Route  path="Reportes" element = {<Reportes />}></Route>
      <Route  path="Perfil" element = {<Perfil />}></Route>
      <Route  path="Captura" element = {<Captura />}></Route>
      <Route  path="Consulta" element = {<Consulta />}></Route>
      <Route path="Proveedores" element = {<Proveedores />}></Route>
      <Route path="productosProveedor/:id/:nombre" element = {<ProductosProveedor />}></Route>
      <Route path="productosProveedorDeshabilitados/:id/:nombre" element = {<ProductosProveedorDeshabilitados />}></Route>
      <Route path="productosCeremonia/:id/:nombre" element = {<ProductosCeremonia />}></Route>
      <Route path="productosCeremoniaDeshabilitados/:id/:nombre" element = {<ProductosCeremoniaDeshabilitados />}></Route>
      <Route path="sucursalesPlaza/:id/:nombre" element = {<SucursalesPlaza />}></Route>
      <Route path="proveedoresDeshabilitados" element = {<ProveedoresDeshabilitados />}></Route>
      <Route path="Materiales" element = {<Materiales />}></Route>
      <Route path="Colores" element = {<Colores />}></Route>
      <Route path="Tonalidades" element = {<Tonalidades />}></Route>
      <Route path="Ceremonias" element={ <Ceremonias /> }></Route>
    </Routes>
    </>
  )
}