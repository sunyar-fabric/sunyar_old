const { isUserExistsByUsername } = require('../user/atomicServices/user');
const { createError } = require('../../../utility/error/errorHandling');
const { GlobalExceptions } = require('../../../utility/error/exceptions');
const {getPersonInfo} = require('../personal/atomicServices/personal');
const { getUserRoleByUserId } = require('../role/compositeServices/assignRoleToUser');
const {setContextInput} = require('../../../utility/logging');

const verifyUser = async (context) => {
        const {authUsername, authNationalCode} = context.params;
        context = await isUserExistsByUsername(setContextInput(context, { username: authUsername }));
        const user = context.output
        if (user === null) {
            throw createError(GlobalExceptions.forgetMyPass.NotAuthorized)
        }
        const person = await getPersonInfo(setContextInput(context, user.personId)); 
        if(authNationalCode != person.output.nationalCode){
            throw createError(GlobalExceptions.forgetMyPass.NotAuthorized)
        }
        const personType = person.output.personType;
        context = await getUserRoleByUserId(setContextInput(context, { userId: user.userId }))
        const roles = context.result;
        context.result = { user, roles, personType}
        return context;
}

const forgetMyPass = async (req, _, next) => {
    try{
        const authUsername = req.header('x-auth-username');
        const authNationalCode = req.header('x-auth-nationalCode');
        if(authUsername && authNationalCode){
            req.context.params = {authUsername, authNationalCode};
            const context = await verifyUser(req.context);
            req.context.auth = context.result;    
    }
    next();
}
    catch(error){
        next(error)
    }
}

module.exports = {forgetMyPass}