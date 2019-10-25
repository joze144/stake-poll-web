import axios from 'axios';

export const getInstance = () => {
  const instance = axios.create({
    baseURL: 'http://localhost:4000/',
  });
  instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  return instance;
};

export const getInstanceWithJWT = (jwt: string) => {
  const instance = axios.create({
    baseURL: 'http://localhost:4000/',
  });
  instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  instance.defaults.headers.common['Authorization'] = jwt;
  return instance;
};
