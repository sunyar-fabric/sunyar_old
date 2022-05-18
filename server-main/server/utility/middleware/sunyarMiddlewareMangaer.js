const { createError } = require("../error/errorHandling");
const { GlobalExceptions } = require("../error/exceptions");
class SunyarMiddlwareManager {
  constructor(socket) {
    this.socket = socket;
    this.inboundMiddleware = [];
    this.outboundMiddleware = [];
    this.response;
    this.handleIncomingMessages();
  }

  async handleIncomingMessages(){
    try{
      await this.socket.axios.interceptors.response.use(async (response)=>{
        const finalReponse = await this.excecuteMiddleware(this.inboundMiddleware, { response })
        this.setResponse(finalReponse);
        return;
    });
  }
    catch(e){
      console.log("ERROR INCOMING MESSAGE", e);
    }
  }   

  async send(context) {
    try{
      const {path, _function, chaincodeName, args} =  context.input.middleware;
      const data = {function: _function, chaincodeName, args};
      var message = { data };
      const finalMessage = await this.excecuteMiddleware(this.outboundMiddleware, message);
      return await this.socket.send(path,finalMessage);
    }
    catch(e){
      console.log(e.message);
      throw createError(GlobalExceptions.middleware)
    }
  }

  use(middleware){
    if(middleware.inbound) this.inboundMiddleware.push(middleware.inbound);
    if(middleware.outbound) this.outboundMiddleware.unshift(middleware.outbound);
  }
  
  async excecuteMiddleware(middlewares, initialMessage){
    let message = initialMessage;
    for await (const middlewareFun of middlewares){
      message = await middlewareFun.call(this, message);
    }
    return message;
  }

  setResponse(response){
    this.response = response;
    console.log("XXX-response", response);
  }

}

module.exports = {SunyarMiddlwareManager};
