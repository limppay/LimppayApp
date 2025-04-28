import React, { Children } from 'react'
import { StatusBar, Style } from '@capacitor/status-bar';

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
import { PrestadorProvider } from './context/PrestadorProvider';

// 3 - rotas

const router = createBrowserRouter([
    {
      path: "/",
      element: <ContrateOnline/>,
      errorElement: <Error404/>
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
        <AreaCliente/>
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


if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker registrado com sucesso:', registration);
    })
    .catch(error => {
      console.error('Erro ao registrar Service Worker:', error);
    });
}

useEffect(() => {
  const configureStatusBar = async () => {
    try {
      // Define o estilo da barra de status (Light para fundo claro, Dark para fundo escuro)
      await StatusBar.setStyle({ style: Style.Light });
      // Impede que a barra de status sobreponha o conteúdo
      await StatusBar.setOverlaysWebView({ overlay: false });
    } catch (error) {
      console.error('Erro ao configurar StatusBar:', error);
    }
  };

  configureStatusBar();
}, []); // Array vazio garante que o efeito rode apenas uma vez, na montagem


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <PrestadorProvider>
        <UserProvider>
          <WebSocketProvider>
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
          </WebSocketProvider>
        </UserProvider>
      </PrestadorProvider>
    </HelmetProvider>
  </React.StrictMode>,
)
