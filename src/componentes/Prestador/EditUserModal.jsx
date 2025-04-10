'use client'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { useState, useRef, useEffect } from 'react';
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import axios from "axios"
import { updateUser } from '../../services/api';

import InputMask from "react-input-mask"
import { Avatar, Button, Spinner } from '@nextui-org/react';
import { usePrestador } from '../../context/PrestadorProvider';


const EditUserModal = ({ Open, SetOpen, userInfo, Urls, onUserUpdated}) => {

  const schema = yup.object({
    name: yup.string().trim().required("Nome não pode ser vazio"),
    genero: yup.string().required("Gênero não pode ser vazio"),
    estadoCivil: yup.number().required("Estado civil não pode ser vazio").typeError("Estado Civil não pode ser vazio"),
    telefone: yup.string().trim().required("Telefone não pode ser vazio"),
    email: yup.string().trim().required("E-mail não pode ser vazio").email("Email inválido."),
    cep:  yup.string().trim().required("Os campos abaixo não podem ser vazios").min(8, "Digite um cep válido"),
    logradouro:  yup.string(),
    numero:  yup.string().trim().required("Número não pode ser vazio"),
    complemento:  yup.string(),
    bairro:  yup.string(),
    cidade:  yup.string(),
    estado: yup.string().typeError(""),
    banco: yup.number().required("Banco não pode ser vazio").typeError("Banco não pode ser vazio"),
    agencia:  yup.string().trim().required("Agência não pode ser vazio").matches(/^\d+$/, 'Apenas números'),
    conta:  yup.string().trim().required("Conta não pode ser vazio").matches(/^\d+$/, 'Apenas números'),
    pix: yup.string().trim().required("Pix não pode ser vazio"),
    sobre: yup.string().trim().required("Sobre mim não pode ser vazio"),
    referencia:  yup.string(),
  });


  const {
      register,
      handleSubmit,
      trigger,
      formState: { errors },
      reset,
      setValue, 
      getValues,
      setError, 
      watch,
      clearErrors
    } = useForm({
      resolver: yupResolver(schema),
      defaultValues: userInfo
  })

  // Efeito para resetar o formulário ao abrir o modal
  useEffect(() => {
    if (Open) {
      setImage(avatarUrl)
      reset(userInfo); // Restaura os valores padrão sempre que o modal é aberto
    }
  }, [Open, userInfo, reset]);


  // onSubmit do Forms
  const onSubmit = async (data) => {
      setLoading(true)

      const telefoneSemMascara = removerMascara(data.telefone);
      const cepSemMascara = removerMascara(data.cep);



      const formData = new FormData()
      formData.append('name', data.name)
      formData.append('genero', data.genero)
      formData.append('estadoCivil', data.estadoCivil)

      formData.append('telefone', telefoneSemMascara)

      formData.append('email', data.email)

      formData.append('cep', cepSemMascara)

      formData.append('logradouro', data.logradouro)
      formData.append('numero', data.numero)
      formData.append('complemento', data.complemento)
      formData.append('bairro', data.bairro)
      formData.append('cidade', data.cidade)
      formData.append('estado', data.estado)
      formData.append('banco', data.banco)
      formData.append('agencia', data.agencia)
      formData.append('conta', data.conta)
      formData.append('pix', data.pix)
      formData.append('sobre', data.sobre)
      formData.append('referencia', data.referencia)

      // Anexa o arquivo da foto de perfil ao FormData
      formData.append('arquivoFoto', file)

      for (let pair of formData.entries()) {
      }

      try {
        const updatedUser = await updateUser(userInfo?.id, formData)

        if (updatedUser) {
          SetOpen(false); // Fechar o modal após o sucesso
          onUserUpdated(updatedUser);
          setLoading(false)

        } else {
          console.error('Falha ao atualizar o usuário.');
          // Aqui você pode adicionar lógica para mostrar uma mensagem de erro
        }

      } catch (error) {
        console.error('Erro ao atualizar o usuário:', error);
      }

  };


  const [genero, setGenero] = useState('');
  const [outroGenero, setOutroGenero] = useState('');

  const [cepError, setCepError] = useState("")
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null)
  const avatarUrl = Urls
  const [image, setImage] = useState(avatarUrl)
  const [file, setFile] = useState(null);

  // função para validar se algum dia foi selecionado ou não
  useEffect(() => {
    const daysCheckboxes = document.querySelectorAll(".days")
    daysCheckboxes.forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const allDays = Array.from(daysCheckboxes).map(cb => cb.checked)
            if (allDays.some(day => day)) {
                clearErrors('diasSemana')
            } else {
                setError('diasSemana', { message: 'Selecione pelo menos um dia' })
            }
        });
    });

    return () => {
        daysCheckboxes.forEach((checkbox) => {
            checkbox.removeEventListener('change', () => {})
        });
    };
  }, [clearErrors, setError])

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFile(file); // Armazenando o arquivo diretamente no estado
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      trigger("arquivoFoto");
    }
  };

  // Carrega os dados do usuário
  useEffect(() => {
    if (userInfo) {
        if (userInfo.genero !== 'Masculino' && userInfo.genero !== 'Feminino') {
            setGenero('Outro');
            setOutroGenero(userInfo.genero);
        } else {
            setGenero(userInfo.genero);
            setOutroGenero('');
        }
    }
  }, [userInfo]);

  const handleGeneroChange = (event) => {
    const value = event.target.value;
    setGenero(value);  // Atualiza o estado do gênero
    if (value !== 'Outro') {
      setOutroGenero('');  // Limpa o valor de outro gênero se 'Outro' não for selecionado
      setValue('genero', value);  // Define o valor no formulário para 'Masculino' ou 'Feminino'
    }
  };
  
  const removerMascara = (valor) => {
    return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
  };
  
  // Lida com a mudança no input de gênero personalizado
  const handleOutroGeneroChange = (event) => {
    const value = event.target.value;
    setOutroGenero(value);
    setValue('genero', value);
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
    { text: "Masculino" },
    { text: "Feminino" },
    { text: "Outro" }, // Mantemos "Outro" como uma opção fixa
  ];


  const EstadoCivil = [
      {text: "Solteiro(a)", value: 1},
      {text: "Casado(a)", value: 2},
      {text: "Divorciado(a)", value: 3},
      {text: "Viúvo(a)", value: 4},
      {text: "Separado(a)", value: 5},
  ]

  const Banco = [
    { text: "Bradesco", value: 800 },
    { text: "Pagseguro", value: 801 },
    { text: "Caixa Econômica", value: 802 },
    { text: "Banco C6", value: 803 },
    { text: "Banco da Amazonia", value: 804 },
    { text: "Santander", value: 805 },
    { text: "Banco Original", value: 806 },
    { text: "Nubank", value: 807 },
    { text: "Banco do Brasil", value: 808 },
    { text: "Itaú", value: 809 },
    { text: "Inter", value: 811 },
    { text: "Banrisul", value: 812 },
    { text: "Sicredi", value: 813 },
    { text: "Sicoob", value: 814 },
    { text: "BRB", value: 815 },
    { text: "Via Credi", value: 816 },
    { text: "Neon", value: 817 },
    { text: "Votorantim", value: 818 },
    { text: "Safra", value: 819 },
    { text: "Modal", value: 820 },
    { text: "Banestes", value: 821 },
    { text: "Unicred", value: 822 },
    { text: "Money Plus", value: 823 },
    { text: "Mercantil do Brasil", value: 824 },
    { text: "JP Morgan", value: 825 },
    { text: "Gerencianet Pagamentos do Brasil", value: 826 },
    { text: "BS2", value: 827 },
    { text: "Banco Topazio", value: 828 },
    { text: "Uniprime", value: 829 },
    { text: "Stone", value: 830 },
    { text: "Banco Daycoval", value: 831 },
    { text: "Rendimento", value: 832 },
    { text: "Banco do Nordeste", value: 833 },
    { text: "Citibank", value: 834 },
    { text: "PJBank", value: 835 },
    { text: "Cooperativa Central de Credito Noroeste Brasileiro", value: 836 },
    { text: "Uniprime Norte do Paraná", value: 837 },
    { text: "Global SCM", value: 838 },
    { text: "Next", value: 839 },
    { text: "Cora", value: 840 },
    { text: "Mercado Pago", value: 841 },
    { text: "BNP Paribas Brasil", value: 842 },
    { text: "Juno", value: 843 },
    { text: "Cresol", value: 844 },
    { text: "BRL Trust DTVM", value: 845 },
    { text: "Banco Banese", value: 846 },
    { text: "Banco BTG Pactual", value: 847 },
    { text: "Banco Omni", value: 848 },
    { text: "Acesso Soluções de Pagamento", value: 849 },
    { text: "CCR de São Miguel do Oeste", value: 850 },
    { text: "Polocred", value: 851 },
    { text: "Ótimo", value: 852 }
  ];


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
          className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 w-[300vh] md:max-w-[100vh] lg:max-w-[150vh] data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
        >
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ">
            <div className="lg:justify-center">
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <div className="mt-2">
                    <div className="flex flex-col  text-prim">
                      <form className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}  >
                        <div className="overflow-y-auto max-h-[70vh] lg:max-h-[60vh]"> 

                          <div className='lg:flex-row flex flex-col items-center lg:justify-around'>

                          <label htmlFor="fotoPerfil" className="cursor-pointer flex justify-center flex-col items-center gap-1">
                                <Avatar src={image} 
                                  alt="foto de perfil" 
                                  className="transition-all duration-200 rounded-full w-60 h-60 hover:bg-ter shadow-md" 
                                />                  
                                <input 
                                    type="file" 
                                    id="fotoPerfil"
                                    accept="image/*"
                                    onChange={(e) => {
                                      handleImageChange(e);
                                    }}
                                    className="p-2 w-full hidden"
                                />                      
                            </label>

                            <div className="mt-4 p-5 pt-0 pb-0 flex flex-col lg:mt-0 lg:w-1/2 lg:p-0 lg:mb-10 w-full">
                                <label htmlFor="biografia" className="text-prim">Sobre mim</label>
                                <textarea  
                                id="biografia"
                                {...register("sobre")}
                                className="border rounded-md border-bord p-3 pt-1 pb-1 min-h-40 focus:outline-ter text-prim lg:max-w-full max-h-1"></textarea>
                                {errors.sobre && (
                                  <span className="text-error opacity-75">{errors.sobre.message}</span>
                                )}
                            </div>
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                            <div className="flex gap-2 justify-between">
                              <label htmlFor="Genero" className="text-prim">Gênero</label>
                              {genero === 'Outro' && (
                                <p onClick={() => setGenero('')} className="cursor-pointer text-prim">
                                  Voltar para seleção
                                </p>
                              )}
                            </div>

                            {/* Renderiza o campo de texto se o gênero for 'Outro', caso contrário exibe o select */}
                            {genero === 'Outro' ? (
                              <input
                                type="text"
                                id="outroGenero"
                                name="outroGenero"
                                value={outroGenero}
                                onChange={handleOutroGeneroChange}
                                placeholder="Especifique seu gênero"
                                className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim"
                              />                                
                            ) : (
                              <select
                                id="Genero"
                                value={genero}  // Garante que o estado correto seja atribuído ao select
                                onChange={handleGeneroChange}
                                className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim w-full"
                              >
                                <option value="">Selecione</option>
                                {Genero.map((option, index) => (
                                  <option key={index} value={option.text}>
                                    {option.text}
                                  </option>
                                ))}
                              </select>
                            )}
                            {errors.genero && (
                                <span className="text-error opacity-75">{errors.genero.message}</span>
                            )}
                          </div>

                            
                          <div className="p-5 pt-4 pb-0 flex flex-col">
                              <label htmlFor="email" className="text-prim">Email</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="email"
                              type="text" 
                              placeholder="Email"
                              {...register("email")}                         
                              />
                              {errors.email && (
                                <span className="text-error opacity-75">{errors.email.message}</span>
                              )}
                          </div>

                          <div className="p-5 pt-4 pb-0 flex flex-col">
                              <label htmlFor="telefone" className="text-prim">Telefone</label>
                              <InputMask
                              ref={inputRef}
                              mask="(99) 99999-9999" 
                              maskChar={null}
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="telefone" 
                              type="text" 
                              placeholder="(00) 00000-0000" 
                              {...register("telefone")}
                              />
                              {errors.telefone && 
                              <span className="text-error opacity-75">{errors.telefone?.message}</span>}
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                              <label htmlFor="EstadoCivil" className="text-prim">Estado Civil</label>
                              <select  
                              id="EstadoCivil"
                              {...register("estadoCivil")}
                              className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                                  <option defaultValue='0' >Selecione</option>
                                  {EstadoCivil.map((options, index) => (
                                      <option key={index} value={options.value}>{options.text}</option>
                                  ))}
                              </select>
                              {errors.estadoCivil && (
                                <span className="text-error opacity-75">{errors.estadoCivil.message}</span>
                              )}                               
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col w-full">
                              <label htmlFor="banco" className="text-prim">Banco</label>
                              <select  
                              id="banco"
                              {...register("banco")}
                              className="border border-bord rounded-md p-3 pt-2 pb-2 text-prim focus:outline-prim">
                                  <option value="" >Selecione</option>
                                  {Banco.map((options, index) => (
                                      <option key={index} value={options.value}>{options.text}</option>
                                  ))}
                              </select>
                              {errors.banco && (
                                <span className="text-error opacity-75">{errors.banco.message}</span>
                              )}  
                          </div>

                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="agencia" className="text-prim">Agência</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="agencia" 
                              type="text" 
                              placeholder="Somente números"
                              {...register("agencia")}                            
                              />
                              {errors.agencia && (
                                <span className="text-error opacity-75">{errors.agencia.message}</span>
                              )}                           
                          </div>
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="conta" className="text-prim">Conta</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="conta" 
                              type="text" 
                              placeholder="Somente números"
                              {...register("conta")}                 
                              />
                              {errors.conta && (
                                <span className="text-error opacity-75">{errors.conta.message}</span>
                              )}       
                          </div>
                          <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                              <label htmlFor="pix" className="text-prim">Pix</label>
                              <input 
                              className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                              id="pix" 
                              type="text" 
                              placeholder="Digite sua chave pix" 
                              {...register("pix")}
                              />
                              {errors.pix && (
                                <span className="text-error opacity-75">{errors.pix.message}</span>
                              )}                           
                          </div> 

                          <div className="mt-7 p-5 pt-0 pb-0 flex flex-col">
                              <h2 className="text-2xl text-desSec">Endereço</h2>
                              {errors.cep && (
                                <span className="text-error opacity-75">{errors.cep.message}</span>
                              )} 
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
                                  {...register("cep")}
                                  onChange={handleCepChange}
                                  />
                                  {cepError && <p className="text-error text-sm mt-1">{cepError}</p>}
                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="logradouro" className="text-prim">Logradouro</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="logradouro" 
                                  type="text" 
                                  placeholder="" 
                                  {...register("logradouro")}
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
                                  {...register("numero")}

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
                                  {...register("complemento")}
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
                                  {...register("referencia")}

                                  />
                                
                              </div>
                              <div className="mt-4 p-5 pt-0 pb-0 flex flex-col">
                                  <label htmlFor="bairro" className="text-prim">Bairro</label>
                                  <input 
                                  className="border rounded-md border-bord p-3 pt-2 pb-2 focus:outline-prim text-ter "
                                  id="bairro" 
                                  type="text" 
                                  placeholder="" 
                                  {...register("bairro")}
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
                              {...register("cidade")}
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
                              {...register("estado")}
                              />
                          </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-4 sm:flex sm:flex-row-reverse sm:px-6 lg:gap-10 flex flex-row-reverse gap-5">
                          <Button type='submit'  className="text-center w-full lg:w-2/12  bg-des text-white hover:bg-sec transition-all duration-100 " isDisabled={loading}>
                            {loading ? <Spinner/> : "Editar"}
                          </Button>
                          <Button
                            type="button"
                            data-autofocus
                            onPress={() => SetOpen(false)}
                            className="text-center w-full lg:w-2/12 bg-white  text-prim hover:text-sec transition-all duration-100 border border-bord "
                          >
                            Cancelar
                          </Button>
                        </div>
                    </form>
                  </div>           
                </div>
              </div>
            </div>
          </div>
        </DialogPanel>
      </div>
    </div>
  </Dialog>
  );
};

export default EditUserModal;
