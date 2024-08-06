
export default function ContatosForm() {
    return (
        <div className="contatos-form">
            <form>
                <div className="name">
                    <p>Nome</p>
                    <input type="text" placeholder="Nome" />
                </div>
                <div className="email-telefone">
                    <div className="email">
                        <p>Email</p>
                        <input type="email" name="email" id="email" placeholder="Email" />
                    </div>
                    <div className="telefone">
                        <p>Telefone</p>
                        <input type="text" name="telefone" id="telefone" placeholder="Telefone" />
                    </div>
                </div>
                <div className="mensagem">
                    <p>Mensagem</p>
                    <textarea name="mensagem" id="mensagem" placeholder="Mensagem" style={{ resize: 'none' }}></textarea>
                </div>
            </form>
        </div>
    );
}

