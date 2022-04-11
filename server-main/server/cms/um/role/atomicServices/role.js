const Op = require('sequelize').Op;
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require("../../../../utility/error/dbError");
const { setContextOutput } = require("../../../../utility/logging");

const Role = db.tblRole;

const createRole = async (context) => {
    try {
        return setContextOutput(context, await Role.create({
            faName: context.input.faName,
            enName: context.input.enName,
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const updateRole = async (context) => {
    try {
        let role = await Role.update({
            faName: context.input.faName,
            enName: context.input.enName,

        }, { where: { roleId: context.input.roleId } });
        if (role[0] == [1]) {
            return setContextOutput(context, await Role.findByPk(context.input.roleId))
        }
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


const loadRole = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.faName) query.faName = { [Op.like]: `%${input.faName}%` };
        if (input.enName) query.enName = { [Op.like]: `%${input.enName}%` };
        if (input.roleId) query.roleId = input.roleId;

        return setContextOutput(context, await Role.findAll({ where: query }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const deleteRole = async (context) => {
    try {
        return setContextOutput(context, await Role.destroy({ where: { roleId: context.input.roleId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


const getRoleById = async (context) => {
    try {
        return setContextOutput(context, await Role.findAll({ where: { roleId: context.input.roleId } }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}



module.exports = { createRole, updateRole, loadRole, deleteRole, getRoleById };