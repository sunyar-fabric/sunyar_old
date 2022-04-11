const Op = require('sequelize').Op;
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const SystemForm = db.tblSystemForm;


const createSystemForm = async (context) => {

    try {
        return setContextOutput(context, await SystemForm.create({
            faForm: context.input.faForm,
            enForm: context.input.enForm,
            sysKind: context.input.sysKind,
            sysParentId: context.input.sysParentId
        }));
    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const updateSystemForm = async (context) => {

    try {
        let form = await SystemForm.update({
            faForm: context.input.faForm,
            enForm: context.input.enForm,
            sysKind: context.input.sysKind,
            sysParentId: context.input.sysParentId
        }, { where: { systemFormId: context.input.systemFormId } });

        if (form[0] == [1]) {
            return setContextOutput(context, await SystemForm.findByPk(context.input.systemFormId))
        }

    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const loadSystemForm = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.systemFormId) query.systemFormId = input.systemFormId;
        if (input.faForm) query.faForm = { [Op.like]: `%${input.faForm}%` }
        if (input.enForm) query.enForm = { [Op.like]: `%${input.enForm}%` };
        if (input.sysKind) query.sysKind = input.sysKind;
        if (input.sysParentId) query.sysParentId = input.sysParentId;

        return setContextOutput(context, await SystemForm.findAll({
            where: query,
            include: {
                model: SystemForm,
                all: true,
                required: true
            }
        }))

    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

const deleteSystemForm = async (context) => {
    try {
        return setContextOutput(context, await SystemForm.destroy({ where: { systemFormId: context.input.systemFormId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

///--For Checked as FK -----------------------------------
const isSystemFormUseAsSysParent = async (context) => {
    try {
        return setContextOutput(context, await SystemForm.findAll({
            where: { sysParentId: context.input.systemFormId }
        }));
    } catch (error) {
        await dbErrorHandling(error, context)
    }
}

module.exports = { createSystemForm, updateSystemForm, loadSystemForm, deleteSystemForm, isSystemFormUseAsSysParent }