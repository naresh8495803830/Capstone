import axios from "axios";
import Cookies from "js-cookie";

const api = axios.create();

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Token from localstorage: ', token)
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

const authMethod = async (url, endpoint, data) => {
  try {
    // const response = await axios.post(`${url}/${endpoint}`, data);
    const response = await api.post(`${url}/${endpoint}`, data);
    let jwtToken = null;
    if (response.status === 200) {
      jwtToken = response?.data?.jwtToken;
    }
    return { statusCode: response.status, token: jwtToken };
  } catch (error) {
    console.log(error);
    console.error("Something went wrong in post request");
    return null;
  }
};
const credentials = {
  headers:{
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
  },
  withCredentials: true,
};
const postMethod = async (url, data) => {
  try {
    console.log(Cookies.get("token"))
    // const response = await axios.post(url, data, credentials);
    const response = await api.post(url, data, credentials);
    return response;
  } catch (error) {
    console.error("Something went wrong in post request");
    return null;
  }
};
const putMethod = async (url, data) => {
  try {
    // const response = await axios.put(url, data, credentials);
    const response = await api.put(url, data, credentials);

    return response;
  } catch (error) {
    console.error("Something went wrong in post request");
    return null;
  }
};

const getMethod = async (url) => {
  try {
    console.log(Cookies.get("token"))
    // const response = await axios.get(url, credentials);
    const response = await api.get(url, credentials);
    return response;
  } catch (error) {
    console.error("Something went wrong in get request");
    return null;
  }
};



export { authMethod, postMethod, putMethod, getMethod };
