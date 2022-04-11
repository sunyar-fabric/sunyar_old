const { loadPlan } = require("../../../../sunyar/plan/plan/atomicServices/plan");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");



const verifyRoles = (scope, role) => {
    
    if (role === '*' || role === 'ADMIN' || scope === role) {
        return true;
    }
    if(Array.isArray(scope)){ 
        for(s of scope){
            if(s === role) {
                return true;}
        }
    }
    return false;
};

const authorizeRequest = async (req, scope, next) => {
    try { 
        let bFlag = false;
        if (req.context.auth && req.context.auth.roles?.length > 0) {
            for (let role of req.context.auth.roles) {
                if (verifyRoles(scope, role)) {
                    bFlag = true;
                    break;
                }
            }
        }
        if (!bFlag) {
            throw createError(GlobalExceptions.jwt.Forbidden, req.context);
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = { authorizeRequest }
