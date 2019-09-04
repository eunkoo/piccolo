
const axios = require( 'axios')

module.exports=  {
  base () {
     return axios.create({
    // baseURL: `http://192.168.56.101:8001/api`,
    // baseURL: `http://192.168.5.103:8091/api`,
   
    // baseURL: `http://192.168.35.229:8091/api`,
    // baseURL: `http://172.20.10.2:8091/api`,
    // baseURL: `http://localhost:8091/api`,
   baseURL: `http://localhost:8001/api`,
  // baseURL: `http://192.168.43.20:8001/api`,
  })
  }
}
// export default() => 
// // module.exports()
// {
//   return axios.create({
//     // baseURL: `http://192.168.56.101:8001/api`,
//     // baseURL: `http://192.168.5.103:8091/api`,
   
//     // baseURL: `http://192.168.35.229:8091/api`,
//     // baseURL: `http://172.20.10.2:8091/api`,
//     // baseURL: `http://localhost:8091/api`,
//    baseURL: `http://localhost:8001/api`,
//   // baseURL: `http://156.147.178.102:8001/api`,
//   })
// }
