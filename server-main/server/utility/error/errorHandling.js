const { GlobalExceptions } = require("./exceptions");

const createError = (error, context) => {
    error.isApplicationException = true;
    error.context = context;
    return Object.assign(new Error(), error);
};

const errorHandling = (error, _req, res, next) => {
    console.log(error);
    if (error.isApplicationException) {
        res.status(error.httpStatusCode).json({ code: error.code, message: error.message });
    } else {
        res.status(GlobalExceptions.ServiceError.httpStatusCode).json({ code: GlobalExceptions.ServiceError.code, message: GlobalExceptions.ServiceError.message });
    }
    next();
}

module.exports = { createError, errorHandling }