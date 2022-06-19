const axios = require("axios");
const { createError } = require("../error/errorHandling");
const { GlobalExceptions } = require("../error/exceptions");
    
const initSocket = async (ip, options) => {
    let socket = axios.create(options);
    socket = {axios: socket}
    socket.send = async function (path, finalMessage){
            // console.log("SENDING to...","http://"+ ip + "/" + path);
            console.log("[FINAL MSG]", finalMessage); 
            
            await socket.axios.post(ip,finalMessage); //+ "/" + path //http://82.115.16.137:3000/api/  http://localhost:8085/api/league/plan  "http://185.110.190.190:4000/"
            return;
 }
    // socket.get = async function (path,query){
    //     return await socket.get(path,query)
    // } 

    return socket;
}

module.exports = {initSocket}