const { createError } = require("./errorHandling");
const { GlobalExceptions } = require("./exceptions");

const dbErrorHandling = async (error, context) => {
    const { parent } = error;
    let dbCode = parent.code;
    let dbDetail = parent.detail;
    context.error = { dbErrorCode: dbCode, dbErrorDetail: dbDetail }
    switch (dbCode) {
        case '23505':
            throw createError(GlobalExceptions.db.InputsNotUnique, context);
        case '22P02':
            throw createError(GlobalExceptions.db.InputNotValide, context);
        case '23503':
            throw createError(GlobalExceptions.db.PrimaryKeyNotFound, context);    
        default:
            console.log("dbError", error);
            throw createError(GlobalExceptions.db.DataBaseError, context);
    }
}

module.exports = { dbErrorHandling }
