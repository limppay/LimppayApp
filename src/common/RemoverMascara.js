export const removerMascara = (valor) => {
    return valor.replace(/\D/g, ''); // Remove todos os caracteres que não são números
};