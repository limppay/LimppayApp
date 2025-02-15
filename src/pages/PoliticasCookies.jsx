import React, { useState } from 'react';
import { HeaderApp } from '../componentes/imports';
import { Logo } from '../componentes/imports';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@nextui-org/react'; // Importe os componentes do modal

const CookiePolicy = () => {
    const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false); // Estado para controlar a abertura do modal

    const buttons = [
        { link: "#quem-somos", text: "Quem somos" },
        { link: "#servicos", text: "Serviços" },
        { link: "#duvidas", text: "Dúvidas" },
        { link: "#", text: "Blog" },
        { link: "#contatos", text: "Contato" },
    ];

    const btnAcess = [
        {
            AcessPrim: "Seja Diarista",
            AcessSec: "Contrate Online",
            LinkPrim: "seja-diarista",
            LinkSec: "contrate-online"
        },
    ];

    return (
        <>
            <HeaderApp img={Logo} alt={"limppay"} buttons={buttons} btnAcess={btnAcess} />
            <div className="max-w-3xl mx-auto pt-[12vh] p-10 container text-prim">
                <h1 className="text-3xl font-bold text-center mb-6 text-prim">Política de Cookies</h1>

                <p className="text-lg mb-4">
                    Esta página descreve como usamos os cookies no nosso site e por que eles são importantes para proporcionar uma experiência de navegação mais personalizada e eficiente.
                </p>

                <h2 className="text-2xl font-semibold mt-4 text-prim">O que são cookies?</h2>
                <p className="text-lg mb-4">
                    Cookies são pequenos arquivos de texto que são armazenados no seu dispositivo (computador, smartphone, etc.) quando você acessa sites na internet. Eles ajudam os sites a lembrar de suas preferências e atividades durante ou entre as visitas.
                </p>

                <h2 className="text-2xl font-semibold mt-4 text-prim">Como usamos cookies?</h2>
                <p className="text-lg mb-4">
                    Utilizamos cookies para:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li>Melhorar sua experiência de navegação e personalizar os conteúdos exibidos.</li>
                    <li>Manter você logado durante a navegação (cookies essenciais).</li>
                    <li>Coletar dados analíticos para melhorar a performance do site.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-4 text-prim">Tipos de cookies utilizados</h2>
                <p className="text-lg mb-4">
                    No nosso site, utilizamos diferentes tipos de cookies:
                </p>
                <ul className="list-disc pl-6 mb-4">
                    <li><strong>Cookies essenciais:</strong> Necessários para o funcionamento básico do site, como manter a sessão do usuário.</li>
                    <li><strong>Cookies de desempenho:</strong> Coletam dados sobre como os usuários interagem com o site para melhorar sua usabilidade.</li>
                    <li><strong>Cookies de funcionalidade:</strong> Usados para lembrar preferências do usuário e personalizar sua experiência.</li>
                </ul>

                <h2 className="text-2xl font-semibold mt-4 text-prim">Como gerenciar os cookies?</h2>
                <p className="text-lg mb-4">
                    Você pode gerenciar seus cookies diretamente nas configurações do seu navegador. A maioria dos navegadores permite que você bloqueie ou exclua cookies, mas isso pode afetar a funcionalidade de alguns sites.
                </p>

                <h2 className="text-2xl font-semibold mt-4 text-prim">Consentimento</h2>
                <p className="text-lg mb-4">
                    Ao continuar a usar nosso site, você concorda com o uso de cookies conforme descrito nesta política. Se você não aceitar o uso de cookies, pode optar por desativá-los nas configurações do seu navegador ou clicar em "Recusar" no banner de cookies.
                </p>

                <p className="text-lg mt-6">
                    Para mais informações sobre nossa política de privacidade, acesse nossa{' '}
                    <span
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() => setIsPrivacyModalOpen(true)} // Abre o modal ao clicar
                    >
                        Política de Privacidade
                    </span>.
                </p>
            </div>

            {/* Modal de Política de Privacidade */}
           <Modal 
               backdrop="opaque" 
               isOpen={isPrivacyModalOpen}
               onClose={() => setIsPrivacyModalOpen(false)}
               placement='center'
               classNames={{
                   backdrop: "bg-gradient-to-t from-zinc-900 to-zinc-900/10 backdrop-opacity-20"
               }}
               className="w-full h-full md:min-w-[50vw] md:max-w-[70vw] md:max-h-[90vh] md:rounded-lg" // Ajustes para mobile e desktop
           >
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1 text-desSec p-5">
                                Política de Privacidade
                            </ModalHeader>
                            <ModalBody className="overflow-y-auto">
                                <div className="bg-white sm:pb-4">
                                    <div className="sm:flex sm:items-start justify-center">
                                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                            <div className="mt-2 lg:flex h-1/2">
                                                <div className="sm:mx-auto sm:w-full sm:max-w-5xl flex flex-col justify-center p-2">
                                                    <div className='flex flex-col items-center text-justify gap-2'>
                                                        <p className="text-prim text-sm leading-5">
                                                            Os USUÁRIOS aceitam e concordam que as informações cadastradas na PLATAFORMA sejam publicadas
                                                            e/ou fornecidas de acordo com o previsto neste instrumento.
                                                            <br /><br />
                                                            Os USUÁRIOS aceitam e concordam que:
                                                            <br /><br />
                                                            • Qualquer informação fornecida seja guardada numa base de dados controlada pela LIMPPAY;
                                                            <br /><br />
                                                            • Essa base de dados possa ser armazenada em servidores não localizados no país onde o USUÁRIO
                                                            se encontra nem onde a LIMPPAY se encontra;
                                                            <br /><br />
                                                            • Os servidores sejam de propriedade e administrados por prestadoras de serviço contratados pela
                                                            LIMPPAY.
                                                            <br /><br />
                                                            Ainda que utilizando infraestrutura computacional administrada por terceiros, a LIMPPAY não
                                                            autoriza o uso das informações do USUÁRIO pela prestadora de serviço.
                                                            <br /><br />
                                                            A PLATAFORMA é nossa. O USUÁRIO pode usá-la de acordo com esse Termo de Uso, mas o código-fonte,
                                                            a marca, os elementos técnicos, de design, de processos, relatórios, e outros que nos ajudam a
                                                            caracterizar a PLATAFORMA são de nossa propriedade e não devem ser usados pelo USUÁRIO de
                                                            nenhuma forma que não seja previamente autorizada por escrito pela LIMPPAY.
                                                            <br /><br />
                                                            O USUÁRIO concorda que não vai fazer, tentar fazer, ou ajudar alguém a fazer nenhum tipo de
                                                            engenharia reversa ou tentativa de acesso ao código fonte e estrutura do banco de dados, em
                                                            relação a PLATAFORMA. Os comentários e sugestões dos USUÁRIOS são muito bem-vindos e podem gerar
                                                            inovações ou implementações que podem ser incorporadas à PLATAFORMA, mas isso não dará ao
                                                            USUÁRIO nenhuma espécie de direito sobre elas. O USUÁRIO não tem e não terá nenhuma propriedade,
                                                            titularidade ou participação direta ou indireta na PLATAFORMA ou na LIMPPAY.
                                                            <br /><br />
                                                            Ainda que a LIMPPAY escolha as prestadoras de serviço líderes mundiais em segurança de dados, a
                                                            LIMPPAY se exime de responsabilidade por qualquer possível atentado hacker ou falha das
                                                            tecnologias de segurança que possam levar essa informação a ser exposta.
                                                            <br /><br />
                                                            A LIMPPAY protege todos os dados pessoais do USUÁRIO utilizando padrões de cuidado técnica e
                                                            economicamente razoáveis considerando-se a tecnologia atual da Internet. O USUÁRIO reconhece que
                                                            não pode haver expectativa quanto a segurança total na Internet contra invasão de websites ou
                                                            outros atos irregulares.
                                                            <br /><br />
                                                            A LIMPPAY coleta dados pessoais com a finalidade de prestar seus serviços. Somos comprometidos a
                                                            preservar a privacidade e segurança de nossos usuários, com tal processamento de dados sendo
                                                            feito em estrita conformidade às leis e regulamentos aplicáveis, em particular com a Lei Geral
                                                            de Proteção de Dados (LGPD).
                                                            <br /><br />
                                                            É reservado o direito da LIMPPAY em fornecer os dados e informações do USUÁRIO, bem como de todo
                                                            o sistema utilizado na PLATAFORMA, para sua equipe técnica, podendo ser formada por funcionários
                                                            da LIMPPAY e/ou por empresa terceirizada, nos quais serão responsáveis por administrar a
                                                            segurança e confiabilidade da PLATAFORMA e dos dados dos USUÁRIOS.
                                                            <br /><br />
                                                            Todos os integrantes da equipe técnica, sejam funcionários ou empresa terceirizada, firmarão
                                                            termo de confidencialidade, declarando que se obrigam a manter sob absoluto sigilo todas as
                                                            informações comerciais, contábeis, administrativas, tecnológicas, infra estruturais, técnicas,
                                                            ou seja, quaisquer dados revelados mutuamente em decorrência da manutenção do funcionamento e
                                                            segurança da PLATAFORMA, abstendo-se de utilizá-las em proveito próprio ou de terceiros,
                                                            comprometendo-se a zelar para que seus sócios, funcionários com vínculo empregatício e terceiros
                                                            de sua confiança, informados dessa obrigação, também o façam.
                                                            <br /><br />
                                                            A LIMPPAY não está autorizada a fornecer os dados cadastrados pelo USUÁRIO à terceiros, a não
                                                            ser nas formas previstas neste instrumento e mediante seu expresso consentimento.
                                                            É de competência exclusiva da Justiça e órgãos legais do território brasileiro requerer
                                                            fundamentadamente a LIMPPAY o fornecimento de dados pessoais do USUÁRIO que comprovadamente
                                                            desrespeitar os termos e condições presentes neste instrumento e as disposições legais
                                                            aplicáveis à espécie, reservando-se a LIMPPAY no direito de fornecer à Justiça e órgãos legais
                                                            competentes os dados pessoais do USUÁRIO, quando fundamentadamente requeridos.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose} className="bg-desSec text-white">
                                    Fechar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default CookiePolicy;