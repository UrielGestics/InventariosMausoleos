import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../auth/pages/login"



export const AppRouter = () => {
  return (
    <>
    <Routes>
      {/* <Route element={<BarraNavegacion />}> */}
      {/* <Route path="/" element = {<Navigate to='/login' />}></Route>
        <Route path="/*" element = {<Navigate to='/404' />}></Route> */}
        {/* <Route path="inicio" element= {<PreAltaEmpleadosApp />}></Route>
        <Route path="editarPreAlta/:id" element = {<EditarPreAlta />}></Route> */}
        {/* </Route> */}
        <Route  path="login" element = {<Login />}></Route>
    </Routes>
    </>
  )
}
