const { charityConfig } = require("../../config/network/charityConfig");
const { createError } = require("../error/errorHandling");
const { GlobalExceptions } = require("../error/exceptions");

const requestBuilder = (charityConfig) => {
  return {
    inbound(response) {
      //  response.data.log = {time: new Date(), status:response.status, headers:response.headers, data: response.data}
      //handle errors here? don't
      let data = response.response.data;
      if (data.message?.includes("error")) { //data?.r?.includes("Failed") || data?.message?.includes("No valid responses from any peers")
        console.log("[CHAINCODE ERROR]", data);
        throw createError(GlobalExceptions.middleware);
      }
      console.log("[CHAINCODE RESPONSE]", data);
      return data;
    },
    outbound(message) {
      return {
        orgMSP: charityConfig.orgMSP,
        userId: charityConfig.userId,
        channelName: charityConfig.channelName,
        chaincodeName: message.data.chaincodeName,
        data: { function: message.data.function, ...message.data.args },
      };
    },
  };
};

const morteza_test = () => {
  return {
    inbound(response) {
      //  response.data.log = {time: new Date(), status:response.status, headers:response.headers, data: response.data}
      //handle errors here? don't
      console.log("RESPONSE", response.response.data);
      if(response.response.data?.httpStatusCode == 400 || response.response.data?.httpStatusCode == "400") throw createError(response.response.data)
      if(response.response.data?.r?.includes("Failed")) throw createError(GlobalExceptions.middleware)
      return response.response.data;
    },
    outbound(message) {
      return {
        ...message.data.args,
        func: message.data.function,
      };
    },
  };
};




module.exports = { requestBuilder, morteza_test };
