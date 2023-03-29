import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom';
import { AppRouter } from "../src/components/AppRouter"

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HashRouter>
    {/* <BrowserRouter> */}
    <AppRouter />
    </HashRouter> 
    {/* </BrowserRouter> */}
  </React.StrictMode>,
)
