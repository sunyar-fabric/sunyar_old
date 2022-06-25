const { charityConfig } = require("../../config/network/charityConfig");
const { createError } = require("../error/errorHandling");
const { GlobalExceptions } = require("../error/exceptions");

const requestBuilder = (charityConfig) => {
  return {
    inbound(response) {
      //  response.data.log = {time: new Date(), status:response.status, headers:response.headers, data: response.data}
      //handle errors here? don't
      let data = response.response.data
      if (data?.r?.includes("Failed")) {
        console.log("[CHAINCODE ERROR]",data.r);
        throw createError(GlobalExceptions.middleware);
      }
      console.log("[CHAINCODE RESPONSE]",data);
      return data;
    },
    outbound(message) {
      return {
        orgMSP: charityConfig.orgMSP,
        userId: charityConfig.userId,
        channelName: charityConfig.channelName,
        chaincodeName: message.data.chaincodeName,
        data: { func: message.data.function, ...message.data.args },
      };
    },
  };
};

const morteza_test = () => {
  return {
    inbound(response) {
      //  response.data.log = {time: new Date(), status:response.status, headers:response.headers, data: response.data}
      //handle errors here? don't
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
