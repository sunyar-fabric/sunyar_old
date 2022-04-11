const Op = require('sequelize').Op;
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const Plan = db.tblPlan;


const createPlan = async (context) => {
    try {
        return setContextOutput(context, await Plan.create({
            planName: context.input.planName,
            description: context.input.description,
            planNature: context.input.planNature,
            parentPlanId: context.input.parentPlanId,
            icon: context.input.icon,
            fDate: context.input.fDate,
            tDate: context.input.tDate,
            neededLogin: context.input.neededLogin
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const updatePlan = async (context) => {
    try {
        let plan = await Plan.update({
            planName: context.input.planName,
            description: context.input.description,
            planNature: context.input.planNature,
            parentPlanId: context.input.parentPlanId,
            icon: context.input.icon,
            fDate: context.input.fDate,
            tDate: context.input.tDate,
            neededLogin: context.input.neededLogin
        }, { where: { planId: context.input.planId } });

        if (plan[0] == [1]) {
            return setContextOutput(context, await Plan.findByPk(context.input.planId))
        }
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const loadPlan = async (context) => {
    try {
        let input = context.input;
        let query = {};
        if (input.planId) query.planId = input.planId;
        if (input.planName) query.planName = { [Op.like]: `%${input.planName}%` };
        if (input.planNature) query.planNature = input.planNature;
        if (input.parentPlanId === 'null') {
            query.parentPlanId = null
        } else if (input.parentPlanId) query.parentPlanId = input.parentPlanId;
        if (input.fDate) query.fDate = input.fDate;
        if (input.tDate) query.tDate = input.tDate;
        if (input.neededLogin) query.neededLogin = input.neededLogin;

        return setContextOutput(context, await Plan.findAll({
            where: query,
            include: {
                model: Plan,
                all: true,
                // required: true,
                include: {
                    model: Plan,
                    all: true,
                    // required: true,
                }
            }
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const loadPlanPaginate = async (context) => {
    try {
        let input = context.input;
        let offset = 20 * input.page;
        let query = {};
        if (input.planId) query.planId = input.planId;
        if (input.planName) query.planName = { [Op.like]: `%${input.planName}%` };
        if (input.planNature) query.planNature = input.planNature;
        if (input.parentPlanId) query.parentPlanId = input.parentPlanId;
        if (input.fDate) query.fDate = input.fDate;
        if (input.tDate) query.tDate = input.tDate;
        if (input.neededLogin) query.neededLogin = input.neededLogin;

        return setContextOutput(context, await Plan.findAndCountAll({
            where: query,
            include: {
                model: Plan,
                required: true,
                all: true,
                include: {
                    model: Plan,
                    required: true,
                    all: true,
                }
            },
            limit: 20,
            skip: offset
        }));

    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const loadPlanTree = async (context) => {
    try {
        let result = await db.sequelize.query(`WITH data AS( select array_to_json(array_agg(row_to_json(t))) as data from (SELECT "planId","description","parentPlanId", "planName","tDate", "fDate","neededLogin", COALESCE("PM".get_children("planId"), '[]') as children from "PM"."tblPlans" order by "planId" asc) t) SELECT "PM".get_tree(data) from data`)
        return setContextOutput(context, result[0]);
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const getPlanByParentPlan = async (context) => {
    try {
        return setContextOutput(context, await Plan.findOne({ where: { parentPlanId: context.input.planId } }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

const deletePlan = async (context) => {
    try {
        return setContextOutput(context, await Plan.destroy({ where: { planId: context.input.planId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}


module.exports = { createPlan, updatePlan, loadPlan, loadPlanPaginate, deletePlan, loadPlanTree, getPlanByParentPlan };