var bcrypt = require('bcryptjs');
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require('../../../../utility/error/exceptions');
const { setContextInput } = require("../../../../utility/logging");
const { createToken, verifyRefreshToken } = require('../../jwt/compositeServices/jwt');
const { loadAssignRoleToUser } = require("../../role/atomicServices/assignRoleToUser");
const { createUser, updateUser, loadUser, deleteUser, loadUserPaginate, isUserExistsByUsername, countFailedTries, deactivateUser } = require("../atomicServices/user");
const {getPersonInfo} = require("../../personal/atomicServices/personal");
const {loadUserRoles} = require("../../role/atomicServices/assignRoleToUser");
const {loadRole} = require("../../role/atomicServices/role");

//----- Must be checked PersonId-----------------------------------------
// PersonId have been checked in usertbl as fK 

// context = await isPersonExistsById(setContextInput(context, { personId: context.params.personId }));

// if dose not exists, dbError will create Error

// if (context.output) {
//     throw createError(GlobalExceptions.user.PersonNotFound, context);
// }

//--------------------------------------

const wsCreateUser = async (context) => {
    context = await createUser(setContextInput(context, {
        personId: context.params.personId,
        username: context.params.username,
        password: context.params.password,
        expireDate: context.params.expireDate,
        active: context.params.active
    }))
    context.result = {
        userId: context.output.userId,
    };
    return context;
}

const wsUpdateUser = async (context) => {
    context = await updateUser(setContextInput(context, {
        userId: context.params.userId,
        personId: context.params.personId,
        username: context.params.username,
        password: context.params.password,
        expireDate: context.params.expireDate,
        active: context.params.active
    }))
    if (!context) {
        throw createError(GlobalExceptions.user.UserNotFound)
    }
    let user = context.output;
    context.result = {
        userId: user.userId,
        personId: user.personId,
        username: user.username,
        password: user.password, 
        expireDate: user.expireDate,
        active: user.active
    };
    return context;
}

const wsLoadUser = async (context) => {
    context = await loadUser(setContextInput(context,
        {
            userId: context.params.userId,
            personId: context.params.personId,
            username: context.params.username,
            expireDate: context.params.expireDate,
            active: context.params.active
        }
    ));

    context.result = context.output
    return context;
}

const wsLoadUserPaginate = async (context) => {
    context = await loadUserPaginate(setContextInput(context,
        {
            page: context.params.page,
            userId: context.params.userId,
            personId: context.params.personId,
            username: context.params.username,
            expireDate: context.params.expireDate,
            active: context.params.active
        }
    ));

    try{
        context.output.rows.map(async (u) =>{
            const nowTime = new Date();
            if (new Date(u.expireDate) < nowTime) {
                context = await deactivateUser(setContextInput(context, { username: u.username }))
            }
        })
    }
    catch(e){
        console.log(e);
    }
    context.result = context.output.rows.map(u => {
        return {
            userId: u.userId,
            personId: u.personId,
            username: u.username,
            expireDate: u.expireDate,
            active: u.active,
            tblPersonal: u.tblPersonal
        };
    });;
    context.count = context.output.count;
    return context;
}

const wsDeleteUser = async (context) => {
    context = await loadAssignRoleToUser(setContextInput(context, { userId: context.params.userId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.user.UserUseAsFK)
    }
    context = await deleteUser(setContextInput(context, { userId: context.params.userId }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.user.PersonNotFound)
    }
    return context;
}

const wsLogin = async (context) => {
    context = await isUserExistsByUsername(setContextInput(context, { username: context.params.username }));
    if (context.output === null) {
        throw createError(GlobalExceptions.user.UserNotFound, context)
    }
    const user = context.output;

    if (user.active === false && !user.bannedTime) {
        throw createError(GlobalExceptions.user.UserExpired, context);
    }
    let nowTime = new Date(); 
    const minutes = 1;
    let resetBanned = false;
    let waitingTime=null;
    if(user.bannedTime){
        waitingTime = new Date(new Date(user.bannedTime).getTime() + minutes * 60000);
    }
    if(waitingTime && waitingTime > nowTime){
        throw createError(GlobalExceptions.auth.waiting, context);
    }else if(waitingTime && waitingTime < nowTime){ 
        resetBanned = true;
    }
    if (new Date(user.expireDate) < nowTime) {
        context = await deactivateUser(setContextInput(context, { username: user.username }))
        throw createError(GlobalExceptions.user.UserExpired, context);
    }
    if (context.params.password) {
        if (!await bcrypt.compare(context.params.password, user.password)) {
            context = await countFailedTries(setContextInput(context, { username: user.username, bFlag: true, resetBanned:resetBanned }));
            throw createError(GlobalExceptions.user.WrongCredential, context)
        } else {
            context = await countFailedTries(setContextInput(context, { username: user.username, bFlag: false, resetBanned:resetBanned}));
        }
    } else if (context.params.refreshToken) {
        context = await verifyRefreshToken(setContextInput(context, {
            username: user.username,
            refreshToken: context.params.refreshToken
        }));

    } else {
        throw createError(GlobalExceptions.user.WrongCredential, context)
    }
    const authorize = await createToken(setContextInput(context, {
        username: user.username,
        userId: user.userId
    }));
    context.token = authorize.token;
    context.refreshToken = authorize.refreshToken;
    const resultPerson = await getPersonInfo(setContextInput(context, {personId: user.personId})); 
    const resultRole = await loadUserRoles(setContextInput(context, {
        userId: user.userId
    }));
    let roles = "null";
    if(resultRole.outputs[3] && resultRole.outputs[3].length > 0){
        roles = resultRole.outputs[3].map(r => r.roleId);
    } 
    const personType = resultPerson.outputs[2].personType;
    const name = resultPerson.outputs[2].name;
    const family = resultPerson.outputs[2].family;

    context.result = {
        username: user.username,
        personId:user.personId,
        userId: user.userId,
        roles: roles,
        personType: personType,
        name: name,
        family: family,
    }
    return context;
}

const wsProfile = async (context)=>{
    context = await isUserExistsByUsername(setContextInput(context, { username: context.params.username }));
    if (context.output === null) {
        throw createError(GlobalExceptions.user.profilesNotFound, context)
    }
    let roles = "null";
    const resultUser = await loadUser(setContextInput(context, context.params.username));
    const user = resultUser.outputs[0];
    const resultPerson = await getPersonInfo(setContextInput(context, user.personId)); 
    const resultRole = await loadUserRoles(setContextInput(context, {
        userId: user.userId
    }));
    if(resultRole.outputs[3]){
        roles = resultRole.outputs[3].map(r => r.roleId);
    }
    const personType = resultPerson.outputs[2].personType;
    const name = resultPerson.outputs[2].name;
    const family = resultPerson.outputs[2].family;

    context.result = {
        username: user.username,
        personId:user.personId,
        userId: user.userId,
        roles: roles,
        personType: personType,
        name: name,
        family: family,
    }
    return context;
}

module.exports = { wsCreateUser, wsUpdateUser, wsLoadUser,
     wsDeleteUser, wsLoadUserPaginate, wsLogin,
     wsProfile };