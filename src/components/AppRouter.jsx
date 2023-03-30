import { Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../auth/pages/login"



export const AppRouter = () => {
  return (
    <>
    <Routes>
      <Route path="/" element = {<Navigate to='/login' />}></Route>
      <Route  path="login" element = {<Login />}></Route>
    </Routes>
    </>
  )
}
