import React from 'react'
import { HeaderApp, Logo } from '../../componentes/imports'
import CustomDatePicker from '../../componentes/App/DatePicker'
import ServiceSelection from '../../componentes/App/ServiceSelection'

export default function ContrateOnline() {
    const buttons = [
        {link: "#quem-somos", text: "Quem somos"},
        {link: "#duvidas", text: "Dúvidas"},
    ]

    const btnAcess = [
    {   AcessPrim: "Criar Conta", 
        AcessSec: "Fazer Login",
        LinkPrim: "cadastro-cliente",
        LinkSec: "login-cliente"  
    },
    ]


  return (
    <>
        <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess} text1="Seja Bem-vindo!" text2="Entre ou cadastre-se" />
        <main>
            <CustomDatePicker/>



        </main>
    </>
  )
}
