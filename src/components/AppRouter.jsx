import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../auth/pages/login"
import { Home } from '../pages/home'
import { Invetarios } from '../pages/invetarios'
import { Sucursal } from '../pages/sucursal'
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

export const AppRouter = () => {
  return (
    <>
    <Routes>
      <Route path="/" element = {<Navigate to='/login' />}></Route>
      <Route  path="login" element = {<Login />}></Route>
      <Route  path="inicio" element = {<Home />}></Route>
      <Route  path="Inventarios" element = {<Invetarios />}></Route>
      <Route  path="Sucursal" element = {<Sucursal />}></Route>
      <Route  path="Reportes" element = {<Reportes />}></Route>
      <Route  path="Perfil" element = {<Perfil />}></Route>
      <Route  path="Captura" element = {<Captura />}></Route>
      <Route path="Proveedores" element = {<Proveedores />}></Route>
      <Route path="productosProveedor/:id/:nombre" element = {<ProductosProveedor />}></Route>
      <Route path="productosProveedorDeshabilitados/:id/:nombre" element = {<ProductosProveedorDeshabilitados />}></Route>
      <Route path="proveedoresDeshabilitados" element = {<ProveedoresDeshabilitados />}></Route>
      <Route path="Materiales" element = {<Materiales />}></Route>
      <Route path="Colores" element = {<Colores />}></Route>
      <Route path="Tonalidades" element = {<Tonalidades />}></Route>
    </Routes>
    </>
  )
}