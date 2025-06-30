import axios from 'axios';

const api = axios.create({
  baseURL: 'http://15.164.96.236:8080',
});

export default api;
