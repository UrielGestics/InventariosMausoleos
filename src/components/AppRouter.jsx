import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../auth/pages/login"
import { Home } from '../pages/home'
import { Invetarios } from '../pages/invetarios'
import { Sucursal } from '../pages/sucursal'
import { Reportes } from '../pages/reportes'
import { Perfil } from '../pages/perfil'

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
    </Routes>
    </>
  )
}