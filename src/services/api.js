import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:3000"
})

export const createUser = async (userData) => {
    const response = await api.post('/users', userData);
    return response.data;
}