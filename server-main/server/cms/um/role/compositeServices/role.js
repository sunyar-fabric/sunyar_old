const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { setContextInput } = require("../../../../utility/logging");
const { loadPermission } = require("../../accessPermission/atomicServices/assignRoleToSystemForm");
const { loadAssignRoleToUser } = require("../atomicServices/assignRoleToUser");
const { createRole, updateRole, loadRole, deleteRole } = require("../atomicServices/role");

const wsCreateRole = async (context) => {

    context = await createRole(setContextInput(context, {
        faName: context.params.faName,
        enName: context.params.enName,
    }))
    context.result = {
        roleId: context.output.roleId,
    };
    return context;
}


const wsUpdateRole = async (context) => {
    context = await updateRole(setContextInput(context, {
        roleId: context.params.roleId,
        faName: context.params.faName,
        enName: context.params.enName,
    }))
    if (!context) {
        throw createError(GlobalExceptions.role.RoleNotFound)
    }
    let role = context.output;
    context.result = {
        roleId: role.roleId,
        faName: role.faName,
        enName: role.enName,
    };
    return context;
}

const wsLoadRole = async (context) => {
    context = await loadRole(setContextInput(context,
        {
            roleId: context.params.roleId,
            faName: context.params.faName,
            enName: context.params.enName,
        }
    ));
    context.result = context.output.map(r => {
        return {
            roleId: r.roleId,
            faName: r.faName,
            enName: r.enName,
        };
    });
    return context;
}

const wsDeleteRole = async (context) => {

    context = await loadAssignRoleToUser(setContextInput(context, { roleId: context.params.roleId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.role.RoleUseAsFK)
    }
    
    context = await loadPermission(setContextInput(context, { roleId: context.params.roleId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.role.RoleUseAsFK)
    }

    context = await deleteRole(setContextInput(context, { roleId: context.params.roleId }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.role.RoleNotFound)
    }
    return context;
}

module.exports = { wsCreateRole, wsUpdateRole, wsLoadRole, wsDeleteRole };