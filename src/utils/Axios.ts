import axios from "axios";

const baseURL = process.env.REACT_APP_BASE_URL;

const instance = axios.create({
  baseURL,
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json'
  }
});

instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

instance.interceptors.response.use(
  (res) => {
    return Promise.resolve(res.data);
  },
  (err) => {
    return Promise.resolve(err);
  }
);


export default instance;
