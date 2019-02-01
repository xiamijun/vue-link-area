/** @format */

import axios from 'axios';

import { AXIOS_DEFAULT_CONFIG } from '@/config';

let axiosInstance = {};
axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG);

export default axiosInstance;
