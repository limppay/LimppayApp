import React, { Children } from 'react'
// 1 - configurando o router
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from "react-router-dom"
// 2 - Paginas
import Home from './pages/home/index'
import DiaristaApp from './pages/seja-diarista/diarista-app'
import DiaristaCadastro from './pages/diarista-cadastro/diarista-cadastro-app'
import Error404 from './Error404'
import DaristaLogin from './pages/diarista-login/diarista-login'
import AreaDiarista from './pages/area-diarista/area-diarista'
import ResetPassword from './pages/diarista-login/reset-password'
import RequestResetPassword from './pages/diarista-login/request-reset-password'
import ContrateOnline from './pages/App/ContrateOnline'
import ClienteCadastro from './pages/cliente-cadastro/ClienteCadastro'

// 3 - rotas
const router = createBrowserRouter([
    {
      path: "/",
      element: <Home/>,
      errorElement: <Error404/>
    },
    {
      path: "seja-diarista",
      element: <DiaristaApp/>
    },
    {
      path: "cadastro-diarista",
      element: <DiaristaCadastro/>
    },
    {
      path: "diarista-login",
      element: <DaristaLogin/>
    },
    {
      path: "request-reset-password",
      element: <RequestResetPassword/>
    },
    {
      path:"reset-password",
      element: <ResetPassword/>
    },
    {
      path: "area-diarista",
      element: <AreaDiarista/>
    },
    {
      path: "contrate-online",
      element: <ContrateOnline/>
    },
    {
      path: "cadastro-cliente",
      element: <ClienteCadastro/>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
