import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', //fastapi zaten localde runlıyoruz şimdilik portu bu
});

export default api;