import React, { Children } from 'react'
// 1 - configurando o router
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider} from "react-router-dom"
import { HelmetProvider } from "react-helmet-async";

// 2 - Paginas
import Home from './pages/home/index'
import DiaristaApp from './pages/seja-diarista/diarista-app'
import DiaristaCadastro from './pages/diarista-cadastro/diarista-cadastro-app'
import Error404 from './Error404'
import DaristaLogin from './pages/diarista-login/diarista-login'
import AreaDiarista from './pages/area-diarista/area-diarista'
import ResetPassword from './pages/diarista-login/reset-password'
import RequestResetPassword from './pages/diarista-login/request-reset-password'
import ResetPasswordCliente from './pages/cliente-login/reset-password'
import RequestResetPasswordCliente from './pages/cliente-login/request-reset-password'
import CookiePolicy from './pages/PoliticasCookies'

import ContrateOnline from './pages/App/ContrateOnline'
import ClienteCadastro from './pages/cliente-cadastro/ClienteCadastro'
import ClienteLogin from './pages/cliente-login/cliente-login'
import AreaCliente from './pages/area-cliente/area-cliente'
import Checkout from './pages/Checkout/Checkout'
import ProtectedRoute from './routerProtect/ProtectedRouter'

import { UserProvider } from './context/UserProvider'
import { AgendamentoData } from './context/AgendamentoData'
import { SelectedProvider } from './context/SelectedProvider'
import { SelectedDates } from './context/SelectedDates'
import { SelectedTimes } from './context/SelectedTimes'
import { ScreenSelect } from './context/ScreenSelect'
import { CheckoutProvider } from './context/CheckoutData';
import { WebSocketProvider } from './context/WebSocketContext';

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
      path: "request-reset-password-user",
      element: <RequestResetPassword/>
    },
    {
      path:"reset-password",
      element: <ResetPassword/>
    },
    {
      path: "request-reset-password-cliente",
      element: <RequestResetPasswordCliente/>
    },
    {
      path: "area-diarista",
      element: (
        <WebSocketProvider>
          <AreaDiarista/>
        </WebSocketProvider>
      )

    },
    {
      path: "contrate-online",
      element: <ContrateOnline/>
    },
    {
      path: "cadastro-cliente",
      element: <ClienteCadastro/>
    },
    {
      path: "login-cliente",
      element: <ClienteLogin/>
    },
    {
      path: "area-cliente",
      element: (
        <WebSocketProvider>
          <AreaCliente/>
        </WebSocketProvider>
      )
    },
    {
      path: "checkout-pagamento",
      element: <Checkout/>
    },
    {
      path: "politica-de-cookies",
      element: <CookiePolicy/>
    }
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <UserProvider>
        <SelectedProvider>
          <CheckoutProvider>
            <AgendamentoData>
                <SelectedDates>
                  <SelectedTimes>
                    <ScreenSelect>
                      <RouterProvider router={router}/>
                    </ScreenSelect>
                  </SelectedTimes>
                </SelectedDates>
            </AgendamentoData>
          </CheckoutProvider>
        </SelectedProvider>  
      </UserProvider>
      
    </HelmetProvider>
  </React.StrictMode>,
)
