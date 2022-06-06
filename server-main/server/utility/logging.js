const { v4: UUID } = require("uuid");
const fs = require("fs");

const setContextInput = (context, input) => {
  context.input = input;
  context.inputs.push(input);
  return context;
};
const setContextOutput = (context, output) => {
  context.output = JSON.parse(JSON.stringify(output));
  context.outputs.push(context.output);
  return context;
};
const createContext = () => {
  return { requestId: UUID(), inputs: [], outputs: [], time: new Date() };
};

const logging = async (req, res, next) => {
  let context = createContext();
  context.request = {
    body: req.body,
    url: req.url,
    headers: req.headers,
  };
  req.context = context;
  return context;
};

const saveLog = async (req, res, context, next) => {
  res.on("finish", () => {
    context.response = {
      body: res.body,
      headers: res.getHeaders(),
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
    };
  });
  const data = {
    requestId: context.requestId,
    time: context.time,
    request: {
      body: context.request.body,
      url: context.request.url,
      host: context.request.host,
    },
    outputs: context.outputs,
    error: context.error,
  };
  // console.log(context);
  const date = new Date();
  let newDate =  
    date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
  const fileName = `log-${newDate}.txt`;
  const dir = "../log";
  if(!fs.existsSync(dir)){
    fs.mkdirSync(dir);}
  fs.stat(`../log/${fileName}`, function (err, stat) {
    if (err == null) {
    } else if (err.code === "ENOENT") {
      fs.writeFileSync(`../log/${fileName}`, "server-log\n");
    } else {
      console.log("log-file-error: ", err.code);
    }
    fs.appendFileSync(
      `../log/${fileName}`,
      JSON.stringify(data, null, 2) + "\n"
    );
  });
  next();
};


module.exports = {
  setContextInput,
  setContextOutput,
  createContext,
  saveLog,
  logging,
};
