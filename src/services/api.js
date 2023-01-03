import axios from "axios";

const SOCKET_BASE_URL = "https://api.mymegaminds.com"
// const SOCKET_BASE_URL = "http://localhost:8080"


function getAccessToken(){
   const token = localStorage.getItem("access_token") || "" ;
   return token === "" ? null : `Bearer ${token}`
}

const api = axios.create({
//  baseURL: "http://localhost:8080/api",
 baseURL: "https://api.mymegaminds.com/api",
});

export default api 
export {
   getAccessToken,
   SOCKET_BASE_URL
}