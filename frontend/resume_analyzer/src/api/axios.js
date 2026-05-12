import axios from 'axios';

const api = axios.create({
    baseURL: 'https://resume-analyzer-xvc9.onrender.com/api',
    withCredentials: true,
})

export default api;