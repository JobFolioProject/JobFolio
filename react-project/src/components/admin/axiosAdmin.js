import axios from "axios";

const instanceAdmin = axios.create({
  headers: { "Content-Type": "application/json"},
  timeout: 5000,
});

instanceAdmin.interceptors.request.use((config) => {
  const loginObj = JSON.parse(sessionStorage.getItem('loginUser') || '{}');
  const loginStatus = loginObj.status; // 올바르게 status에 접근
    if (loginStatus !== 'A') {
        window.location.href = "/emptyAdmin";  // 페이지 리로드
        return Promise.reject("Not logged in");  
      }
    return config;
},
(err) => {
    return Promise.reject(err);
});

export default instanceAdmin;