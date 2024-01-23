import axios from "axios";

// let custom_axios = axios.create({
//   baseURL: import.meta.env.VITE_BASE_URL,
//   headers: {
//     Accept: "*/*",
//     "Content-Type": "application/json",
//   },
//   timeout: 5000,
// });

 export function getAuthToken() {
  // Replace 'yourAuthTokenStorageKey' with the actual key used to store the token
  return localStorage.getItem("token");
}

let custom_axios = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Accept: "*/*",
    "Content-Type": "application/json",
  },
  // timeout: 5000,
});

// Add an interceptor to include the authentication token in the headers for each request
custom_axios.interceptors.request.use((config) => {
  const authToken = getAuthToken(); // Get the authentication token
  if (authToken) {
    config.headers["Authorization"] = `Bearer ${authToken}`;
  }
  return config;
});


export default custom_axios;

