
import axios from 'axios'

export default() => {
  return axios.create({
    // baseURL: `http://192.168.56.101:8001/api`,
    // baseURL: `http://192.168.5.103:8091/api`,
   
    // baseURL: `http://192.168.35.229:8091/api`,
    // baseURL: `http://172.20.10.2:8091/api`,
    // baseURL: `http://localhost:8091/api`,
   baseURL: `http://localhost:8001/api`,
  })
}
