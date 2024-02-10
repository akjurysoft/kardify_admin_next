import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:4040/',
    // baseURL: 'http://192.168.0.113:4040/',
    headers: {
        post: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
        get: {
            "Accept": 'application/json',
            "Content-Type": "application/json",
        },
    },
    withCredentials: false,
})

export default instance;
