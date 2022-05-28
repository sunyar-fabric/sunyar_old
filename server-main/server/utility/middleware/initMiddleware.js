const { GlobalExceptions } = require("../error/exceptions");
const { initSocket } = require("../socket.js/initSocket");
const { requestBuilder, morteza_test } = require("./middlewares");
const { SunyarMiddlwareManager } = require("./sunyarMiddlewareMangaer");
const fs = require("fs");
const { createError } = require("../error/errorHandling");

const initMiddleware = async function (req, res, next) {
  const charityConfig = req.charityConfig;
  const socket = await initSocket(charityConfig.ip, {});
  const sunyarMidManager = new SunyarMiddlwareManager(socket);
  // sunyarMidManager.use(requestBuilder(charityConfig));
  sunyarMidManager.use(requestBuilder(charityConfig)); 
  req.context.sunyarMidManager = sunyarMidManager;
  req.context.charityConfig = charityConfig;
  req.context.socket = socket;
  next();
};

const loadMiddleware = (context, chaincodeName, path, functionName, args) => {
  try {
    chaincodeName = context.charityConfig.chaincodeNames[chaincodeName];
    context.input.middleware = {
      path,
      _function: functionName,
      chaincodeName,
      args,
    };
    context.inputs.push(context.input.middleware);
    return context;
  } catch (e) {
    console.log(e);
  }
};

module.exports = { initMiddleware, loadMiddleware };
