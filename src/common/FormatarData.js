export const formatarData = (dataISO) => {
    const [ano, mes, dia] = dataISO.split("-"); // Divide "aaaa-mm-dd"
    return `${dia}/${mes}/${ano}`; // Retorna no formato "dd/mm/aaaa"
}