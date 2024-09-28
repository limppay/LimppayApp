'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import InputMask from "react-input-mask"
import axios from "axios"

const EditUserModal = ({ Open, SetOpen}) => {
  const [genero, setGenero] = useState('');
  const [outroGenero, setOutroGenero] = useState('');
  const [cepError, setCepError] = useState("")
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null)

  const handleGeneroChange = (event) => {
    const value = event.target.value;
    setGenero(value);
    setValue('genero', value); // Atualiza o valor no React Hook Form
    if (value !== 'Outro') {
      setOutroGenero('');
    }
  };

  const handleOutroGeneroChange = (event) => {
    const value = event.target.value;
    setOutroGenero(value);
    setValue('genero', value); // Atualiza o valor no React Hook Form
  };

  const voltarParaSelect = () => {
    setGenero('');
    setOutroGenero('');
    setValue('genero', ''); // Reseta o valor no React Hook Form
  };

  const estados = {
    "AC": "Acre",
    "AL": "Alagoas",
    "AP": "Amapá",
    "AM": "Amazonas",
    "BA": "Bahia",
    "CE": "Ceará",
    "DF": "Distrito Federal",
    "ES": "Espírito Santo",
    "GO": "Goiás",
    "MA": "Maranhão",
    "MT": "Mato Grosso",
    "MS": "Mato Grosso do Sul",
    "MG": "Minas Gerais",
    "PA": "Pará",
    "PB": "Paraíba",
    "PR": "Paraná",
    "PE": "Pernambuco",
    "PI": "Piauí",
    "RJ": "Rio de Janeiro",
    "RN": "Rio Grande do Norte",
    "RS": "Rio Grande do Sul",
    "RO": "Rondônia",
    "RR": "Roraima",
    "SC": "Santa Catarina",
    "SP": "São Paulo",
    "SE": "Sergipe",
    "TO": "Tocantins"
  };
  
  const handleCepChange = async (e) => {
    const cep = e.target.value.replace(/\D/g, ''); // Remove qualquer não numérico
    setCepError("")
  
    if (cep.length === 8) {
      try {
        setLoading(true);
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (!response.data.erro) {
          setValue("logradouro", response.data.logradouro);
          setValue("bairro", response.data.bairro);
          setValue("cidade", response.data.localidade);
  
          // Converter a sigla do estado para o nome completo
          const nomeEstado = estados[response.data.uf];
          setValue("estado", nomeEstado);
  
          setCepError("");
        } else {
          setCepError("CEP não encontrado");
        }
      } catch (error) {
        console.error('Erro ao buscar o CEP:', error);
        alert('Erro ao buscar o CEP.');
      } finally {
        setLoading(false);
      }
    }
  };


  const Genero = [
      {text: "Masculino"},
      {text: "Feminino"},
      {text: "Outro"},
  ]


  const EstadoCivil = [
      {text: "Solteiro(a)", value: 1},
      {text: "Casado(a)", value: 2},
      {text: "Divorciado(a)", value: 3},
      {text: "Viúvo(a)", value: 4},
      {text: "Separado(a)", value: 5},
  ]

  const Banco = [
    {text: "Santander", value: 1}

  ] 

    return (
      <Dialog open={Open} onClose={SetOpen} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />
      <div className="fixed inset-0 z-10 w-screen overflow-y-auto bg-prim bg-opacity-50 sm:p-5 md:p-5 lg:p-5">
        <div className="flex items-center justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:max-w-full data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
              <div className="sm:flex sm:items-start lg:justify-center">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <div className="mt-2">
                      <div className="flex flex-col  text-prim overflow-y-auto max-h-[75vh]">
                        <div className='flex flex-col gap-4 '>
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col lg:mt-0 lg:w-1/2 lg:p-0 lg:mb-10 max-w-full">
                              <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                              <textarea  
                              id="biografia"
                              className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-40 focus:outline-ter text-prim lg:max-w-full max-h-1"></textarea>
                          </div>

                          <div className="p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="name" className="text-prim">Nome</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="name"
                              type="text" 
                              placeholder="Nome"                         
                              />
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                            <div className="flex gap-2 justify-between">
                                <label htmlFor="Genero" className="text-prim">Gênero</label>

                                {genero === 'Outro' ? (
                                    <>
                                        <p onClick={voltarParaSelect} className="cursor-pointer text-prim">Voltar para seleção</p>
                                    </>
                                ) : (
                                    <span>
                                        
                                    </span>
                                )}
                            </div>
                            
                            {genero === 'Outro' ? (
                                <>
                                    <input
                                    type="text"
                                    id="outroGenero"
                                    name="outroGenero"
                                    value={outroGenero}
                                    onChange={handleOutroGeneroChange}
                                    placeholder="Especifique seu gênero"
                                    className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim"
                                    />
                                </>
                            ) : (
                                <select
                                id="Genero"
                                value={genero}
                                onChange={handleGeneroChange}
                                className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim w-full">
                                    <option value="">Selecione</option>
                                    {Genero.map((options, index) => (
                                        <option key={index} value={options.text}>{options.text}</option>
                                    ))}                            
                                </select>
                            )}
                          </div>
                            
                          <div className="p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="email" className="text-prim">Email</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="email"
                              type="text" 
                              placeholder="Email"                         
                              />
                          </div>

                          <div className="p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="telefone" className="text-prim">Telefone</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="telefone"
                              type="text" 
                              placeholder="Nome"                         
                              />
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                              <label htmlFor="EstadoCivil" className="text-prim">Estado Civil</label>
                              <select  
                              id="EstadoCivil"
                              className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                                  <option defaultValue='0' >Selecione</option>
                                  {EstadoCivil.map((options, index) => (
                                      <option key={index} value={options.value}>{options.text}</option>
                                  ))}
                              </select>                               
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                              <label htmlFor="banco" className="text-prim">Banco</label>
                              <select  
                              id="banco"
                              className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                                  <option value="" >Selecione</option>
                                  {Banco.map((options, index) => (
                                      <option key={index} value={options.value}>{options.text}</option>
                                  ))}
                              </select>
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="agencia" className="text-prim">Agência</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="agencia" 
                              type="text" 
                              placeholder="Somente números"                            
                              />                          
                          </div>
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="conta" className="text-prim">Conta</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="conta" 
                              type="text" 
                              placeholder="Somente números"                 
                              />      
                          </div>
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="pix" className="text-prim">Pix</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="pix" 
                              type="text" 
                              placeholder="Digite sua chave pix" 
                              />                          
                          </div>


                          <div className="mt-7 pt-0 pb-0 flex flex-col">
                              <h3 className="text-xl text-desSec">Disponibilidade e serviços</h3>
                          </div>

                          {/* Ajustar */}
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col text-prim">
                              <p><b>Dias disponíveis para trabalhar</b></p>
                              <div className="mt-2">
                                  <input id="selectDays" type="button" value="Selecionar todos os dias" className="p-2 border border-bord rounded-md cursor-pointer"/>
                              </div>
                              <div className="flex justify-between">
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="domingo" 
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="domingo">Domingo</label>
                                  </div>
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="segunda" 
                                      
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="segunda">Segunda</label>
                                  </div>
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="terca" 
                                      
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="terca">Terça</label>
                                  </div>
                              </div>
                              <div className="flex justify-between">
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="quarta" 
                                      
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="quarta">Quarta</label>
                                  </div>
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="quinta" 
                                      
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="quinta">Quinta</label>
                                  </div>
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="sexta" 
                                      
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="sexta">Sexta</label>
                                  </div>
                              </div>
                              <div className="flex justify-between">
                                  <div className="m-3 mb-0 ml-0 flex gap-2">
                                      <input 
                                      type="checkbox" 
                                      id="sabado" 
                                     
                                      className="days cursor-pointer"
                                      />
                                      <label htmlFor="sabado">Sábado</label>
                                  </div>
                              </div>
                          </div>

                          <div className="mt-7 p-5 pt-0 pb-0 flex flex-col">
                              <h2 className="text-2xl text-desSec">Endereço</h2>
                          </div>

                          <div className="lg:flex lg:justify-between">
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="cep" className="text-prim">CEP</label>
                                  <InputMask 
                                  ref={inputRef}
                                  mask="99999-999"
                                  maskChar={null}
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="cep" 
                                  type="text" 
                                  placeholder="Somente números" 
                                  onChange={handleCepChange}
                                  />

                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="logradouro" 
                                  type="text" 
                                  placeholder="" 

                                  readOnly
                                  />

                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="numero" className="text-prim">Número</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="numero" 
                                  type="text" 
                                  placeholder="" 

                                  />

                              </div>
                          </div>
                          <div className="lg:flex lg:justify-between">
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="complemento" className="text-prim">Complemento</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="complemento" 
                                  type="text" 
                                  placeholder="Casa, apt, bloco, etc"
                                  maxLength="100" 
                                  />
                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="pontoRef" className="text-prim">Ponto de Referência</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="pontoRef" 
                                  type="text" 
                                  placeholder="" 
                                  maxLength="150"

                                  />
                                 
                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="bairro" className="text-prim">Bairro</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="bairro" 
                                  type="text" 
                                  placeholder="" 

                                  readOnly
                                  />

                              </div>
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="cidade" className="text-prim">Cidade</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="cidade" 
                              type="text" 
                              placeholder="" 

                              readOnly
                              />

                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="estado" className="text-prim">Estado</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="estado" 
                              type="text" 
                              placeholder=""
                              readOnly
                              />
                          </div>
                      </div>                       
                    </div>           
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 lg:gap-10 flex flex-row-reverse gap-5">
              <button className="text-center w-full lg:w-2/12  bg-des rounded-md text-white p-2 hover:bg-sec transition-all duration-100 ">Editar</button>
              <button
                type="button"
                data-autofocus
                onClick={() => SetOpen(false)}
                className="text-center w-full lg:w-2/12 bg-white rounded-md text-prim p-2 hover:text-sec transition-all duration-100 border border-bord "
              >
                Cancelar
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
    );
};

export default EditUserModal;
