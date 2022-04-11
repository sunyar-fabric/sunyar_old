
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { setContextInput } = require("../../../../utility/logging");
const { loadPermission } = require("../atomicServices/assignRoleToSystemForm");
const { createSystemForm, updateSystemForm, loadSystemForm, deleteSystemForm } = require("../atomicServices/systemForm");


const wsCreateSystemForm = async (context) => {

    context = await createSystemForm(setContextInput(context, {
        faForm: context.params.faForm,
        enForm: context.params.enForm,
        sysKind: context.params.sysKind,
        sysParentId: context.params.sysParentId
    }));

    context.result = {
        systemFormId: context.output.systemFormId
    }
    return context;
}


const wsUpdateSystemForm = async (context) => {

    context = await updateSystemForm(setContextInput(context, {
        systemFormId: context.params.systemFormId,
        faForm: context.params.faForm,
        enForm: context.params.enForm,
        sysKind: context.params.sysKind,
        sysParentId: context.params.sysParentId
    }));

    if (!context) {
        throw createError(GlobalExceptions.accessPermission.FormNotFound)
    }
    let form = context.output;
    context.result = {
        systemFormId: form.systemFormId,
        faForm: form.faForm,
        enForm: form.enForm,
        sysKind: form.sysKind,
        sysParentId: form.sysParentId
    };
    return context;
}

const wsLoadSystemForm = async (context) => {

    context = await loadSystemForm(setContextInput(context, {
        systemFormId: context.params.systemFormId,
        faForm: context.params.faForm,
        enForm: context.params.enForm,
        sysKind: context.params.sysKind,
        sysParentId: context.params.sysParentId
    }));

    if (!context) {
        throw createError(GlobalExceptions.accessPermission.FormNotFound)
    }
    context.result = context.output.map(f => {
        return {
            systemFormId: f.systemFormId,
            faForm: f.faForm,
            enForm: f.enForm,
            sysKind: f.sysKind,
            sysParentId: f.sysParentId,
            parent: f.parent
        }
    })
    return context;
};

const wsDeleteSystemForm = async (context) => {
    context = await loadSystemForm(setContextInput(context, { sysParentId: context.params.systemFormId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.accessPermission.FormUseAsSysParent)
    }
    //--- OR use isSystemFormUseAsSysParent ------------------------

    context = await loadPermission(setContextInput(context, { systemFormId: context.params.systemFormId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.accessPermission.FormUseAsFK)
    }

    context = await deleteSystemForm(setContextInput(context, { systemFormId: context.params.systemFormId }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.accessPermission.FormNotFound)
    }
    return context;
}



module.exports = { wsCreateSystemForm, wsUpdateSystemForm, wsLoadSystemForm, wsDeleteSystemForm }