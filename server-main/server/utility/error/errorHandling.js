const { GlobalExceptions } = require("./exceptions");
const { GlobalExceptionsEn } = require("./exceptionsEn");

const createError = (error, context) => {
  error.isApplicationException = true;
  error.context = context;
  return Object.assign(new Error(), error);
};

const findErrorByCode = (obj, code) => {
  const keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    if (obj[keys[i]].code && obj[keys[i]].code === code) {
      return obj[keys[i]];
    }
  }
};

const exploreExceptions = (globalException, code) => {
  const keys = Object.keys(globalException);
  for (var i = 0; i < keys.length; i++) {
    if (
      globalException[keys[i]].code &&
      globalException[keys[i]].code === code
    ) {
      return globalException[keys[i]];
    }
    const error = findErrorByCode(globalException[keys[i]], code);
    if (error) return error;
  }
};

const errorHandling = (error, _req, res, next) => {
  const language = _req.headers['language'];
  const exploredError = exploreExceptions(GlobalExceptionsEn, error.code)
  if(exploredError && error.code != 1){
    switch (language) {
      case "en":
        error.message = exploredError.message;
    }
  }
  if (error.isApplicationException) { 
    console.log("FUCKING HELL", error);
    res
    .status(error.httpStatusCode)
      .json({ code: error.code, message: error.message });
  } 
  else {
    if(language == "en") {
      res
      .status(GlobalExceptionsEn.ServiceError.httpStatusCode).
      json({
        code: GlobalExceptionsEn.ServiceError.code,
        message: GlobalExceptionsEn.ServiceError.message,
      }); 
    }
    else{
      res.status(GlobalExceptions.ServiceError.httpStatusCode).json({
        code: GlobalExceptions.ServiceError.code,
        message: GlobalExceptions.ServiceError.message,
      }); 
    }
    
  }
  console.log(error);
  next();
};

module.exports = { createError, errorHandling };
