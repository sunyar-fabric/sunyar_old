const { createError } = require("./errorHandling");
const { GlobalExceptions } = require("./exceptions");

const authErrorHandling = async (error, context) => {
    if (error.name == "TokenExpiredError") {
        throw createError(GlobalExceptions.auth.TokenExpired, context)
    } else if (error.name == "JsonWebTokenError") {
        throw createError(GlobalExceptions.auth.WrongAccessToken, context)
    } else {
        throw createError(GlobalExceptions.auth.AccessTokenError, context)
    }
}


module.exports = { authErrorHandling }