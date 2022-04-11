const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { setContextInput } = require("../../../../utility/logging");
const { loadUser } = require("../../user/atomicServices/user");
const { assignRoleToUser, loadAssignRoleToUser, deleteRolesFromUser, getAssignRoleToUserByUserId } = require("../atomicServices/assignRoleToUser");
const { loadRole, getRoleById } = require("../atomicServices/role");
require("../../user/atomicServices/user")



// for bulkCreate----------------------------------------------------
const wsAssignRoleToUser = async (context) => {
    const donators = [];
    for(const r of context.params.role){
        const user = await loadUser(setContextInput(context, {userId: r.userId}));
        if(user.output.tblPersonal && user.output.tblPersonal.personType == '3'){
            throw createError(GlobalExceptions.assignRole.iamDonator)
        }
    }

    context = await assignRoleToUser(setContextInput(context, {
        role: context.params.role,
    }))
    context.result = {
        assignRoleToUserId: context.output.map(a => a.assignRoleToUserId)
    };
    return context;
}
///--------- for each-------------------------------------------------
// const wsAssignRoleToUser = async (context) => {
//     context = await assignRoleToUser(setContextInput(context, {
//         userId: context.params.userId,
//         roleId: context.params.roleId
//     }))
//     context.result = {
//         assignRoleToUserId: context.output.assignRoleToUserId,
//     };
//     return context;
// }

const wsLoadAssignRoleToUser = async (context) => {
    context = await loadAssignRoleToUser(setContextInput(context,
        {
            assignRoleToUserId: context.params.assignRoleToUserId,
            userId: context.params.userId,
            roleId: context.params.roleId
        }
    ));
    context.result = context.output.map(a => {
        return {
            assignRoleToUserId: a.assignRoleToUserId,
            userId: a.userId,
            roleId: a.roleId,
            tblUser: a.tblUser,
            tblRole: a.tblRole
        };
    });
    return context;
}

const wsDeleteRolesFromUser = async (context) => {
    context = await deleteRolesFromUser(setContextInput(context, { assignRoleToUserId: context.params.assignRoleToUserId }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.role.AssignRoleToUserNotFound)
    }
    return context;
}

const getUserRoleByUserId = async (context) => {
    const scopes=[];
    context = await getAssignRoleToUserByUserId(setContextInput(context, { userId: context.input.userId }));
    const assignRoleToUser = context.output;
    if (assignRoleToUser === null) {
        context.auth = scopes;
        return context;
    }
    for (let i = 0; i < assignRoleToUser.length; i++) {
        context = await getRoleById(setContextInput(context, { roleId: assignRoleToUser[i].roleId }));
        const role = context.output;
        if (role === null) {
            context.auth = scopes;
            return context;
        }
        const roleName = role.map(r => r.enName)
        scopes.push(...roleName)
    }
    context.result = scopes
    return context;
}



module.exports = { wsAssignRoleToUser, wsLoadAssignRoleToUser, wsDeleteRolesFromUser, getUserRoleByUserId };