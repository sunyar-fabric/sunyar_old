const jwt = require('jsonwebtoken');
const authConfig = require('../../../../config/authConfig');
const { authErrorHandling } = require('../../../../utility/error/authError');
const { createError } = require('../../../../utility/error/errorHandling');
const { GlobalExceptions } = require('../../../../utility/error/exceptions');
const { setContextInput } = require('../../../../utility/logging');
const { getUserRoleByUserId } = require('../../role/compositeServices/assignRoleToUser');
const { isUserExistsByUsername } = require('../../user/atomicServices/user');
const {getPersonInfo} = require("../../personal/atomicServices/personal");
const createToken = async (context) => {
    let data = {
        username: context.input.username,
        userId: context.input.userId
    }
    return {
        token: jwt.sign(data, authConfig.jwtPrivateKey, { expiresIn: '600m' }),
        refreshToken: jwt.sign(data, authConfig.jwtPrivateKey, { expiresIn: '1000m' })
    }
}

const verifyToken = async (context) => {
    try {
        const accessToken = context.params.authorization
        const decoded = jwt.verify(accessToken, authConfig.jwtPrivateKey);
        if (!decoded) {
            throw createError(GlobalExceptions.jwt.NotAuthorized)
        }
        context = await isUserExistsByUsername(setContextInput(context, { username: decoded.username }));
        const user = context.output
        if (user === null) {
            throw createError(GlobalExceptions.jwt.NotAuthorized)
        }
        context = await getUserRoleByUserId(setContextInput(context, { userId: user.userId }))
        const roles = context.result;
        const person = await getPersonInfo(setContextInput(context, {personId: user.personId})); 
        const personType = person.output.personType;
        context.result = { user, roles, personType}
        return context;
    } catch (error) {
        await authErrorHandling(error, context)
    }
}

const verifyRefreshToken = async (context) => {
    try {
        const refreshToken = context.input.refreshToken
        const decoded = jwt.verify(refreshToken, authConfig.jwtPrivateKey);
        if (!decoded) {
            throw createError(GlobalExceptions.jwt.NotAuthorized)
        }
        if (decoded.username !== context.input.username) {
            throw createError(GlobalExceptions.jwt.NotAuthorized)
        }
        return context;
    } catch (error) {
        await authErrorHandling(error, context)
    }
}

const authenticateByJWT = async (req, _, next) => {
    try {
        const authHeader = req.header('x-auth-token');
        if (authHeader && authHeader !="Bearernull") {
            if (authHeader.startsWith('Bearer')) {
                req.context.params = { authorization: authHeader.substring(6) };
                req.context = await verifyToken(req.context);
                req.context.auth = req.context.result;
            } else {
                throw createError(GlobalExceptions.jwt.invalidAuthorizationHeader);
            }
        }
        next();
    } catch (error) {
        next(error);
    }
}



module.exports = { createToken, authenticateByJWT, verifyRefreshToken }