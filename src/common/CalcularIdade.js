export const calcularIdade = (data) =>{
    const hoje = new Date();
    const nascimento = new Date(data);
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();

    if(mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())){
        idade--;
    }

    return idade;
};