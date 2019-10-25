import axios from 'axios';
import { config } from '../config/config';

export const getInstance = () => {
  const instance = axios.create({
    baseURL: config.serviceUrl,
  });
  instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  return instance;
};

export const getInstanceWithJWT = (jwt: string) => {
  const instance = axios.create({
    baseURL: config.serviceUrl,
  });
  instance.defaults.headers.common['Content-Type'] = 'application/x-www-form-urlencoded';
  instance.defaults.headers.common['Authorization'] = jwt;
  return instance;
};
