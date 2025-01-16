import Axios from 'axios';
import {API_DOMAIN} from "@/utils/constant";

const API = Axios.create({
  baseURL: API_DOMAIN,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default API;
