const { charityConfig } = require("../../config/network/charityConfig");

const requestBuilder = (charityConfig) => {
  return {
    inbound(response) {
      //  response.data.log = {time: new Date(), status:response.status, headers:response.headers, data: response.data}
      //handle errors here? don't
      return response.response.data
    },
    outbound(message) {
      return{
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
      return response.response.data
    },
    outbound(message) {
      return{
        ...message.data.args
      };
    },
  };
};



module.exports = { requestBuilder, morteza_test };
