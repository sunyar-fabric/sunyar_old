const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { setContextInput } = require("../../../../utility/logging");
const { createPlan, updatePlan, loadPlan, deletePlan, loadPlanPaginate, loadPlanTree, getPlanByParentPlan } = require("../atomicServices/plan");
const { loadNeedyToPlan } = require("../../../plan/needyToPlan/atomicServices/needyToPlan");
const { loadSuccorCash } = require("../../../plan/succorCash/atomicServices/succorCash");

const wsCreatePlan = async (context) => {
    let loadUniques = await loadPlan(setContextInput(context, {
        planName: context.params.planName,
        planNature: context.params.planNature,
        parentPlanId: context.params.parentPlanId
    }))
    if (loadUniques.output[0] != null){
        throw createError(GlobalExceptions.db.InputsNotUnique) 
    }
    //get parent plan fdate and tdate
    const parentPlan = await loadPlan(setContextInput(context, {
        parentPlan: context.params.parentPlanId
    }));
    if(new Date(context.params.fDate) < new Date(parentPlan.output[0].fDate) || new Date(context.params.tDate) > new Date(parentPlan.output[0].tDate)){
        throw createError(GlobalExceptions.parentTime);
    }
    context = await createPlan(setContextInput(context, {
        planName: context.params.planName,
        description: context.params.description,
        planNature: context.params.planNature,
        parentPlanId: context.params.parentPlanId,
        icon: context.params.icon,
        fDate: context.params.fDate,
        tDate: context.params.tDate,
        neededLogin: context.params.neededLogin
    }));
    context.result = {
        planId: context.output.planId,
    };
    return context;
}

const wsUpdatePlan = async (context) => {
    let loadUniques = await loadPlan(setContextInput(context, {
        planName: context.params.planName,
        planNature: context.params.planNature,
        parentPlanId: context.params.parentPlanId
    }))
    if (loadUniques.output[0] != null && loadUniques.output[0].planId != context.params.planId){
        throw createError(GlobalExceptions.db.InputsNotUnique) 
    }
    context = await updatePlan(setContextInput(context, {
        planId: context.params.planId,
        planName: context.params.planName,
        description: context.params.description,
        planNature: context.params.planNature,
        parentPlanId: context.params.parentPlanId,
        icon: context.params.icon,
        fDate: context.params.fDate,
        tDate: context.params.tDate,
        neededLogin: context.params.neededLogin
    }))
    if (!context) {
        throw createError(GlobalExceptions.plan.PlanNotFound)
    }
    let plan = context.output;
    context.result = {
        planId: plan.palnId,
        planName: plan.planName,
        description: plan.description,
        planNature: plan.planNature,
        parentPlanId: plan.parentPlanId,
        icon: plan.icon,
        fDate: plan.fDate,
        tDate: plan.tDate,
        neededLogin: plan.neededLogin
    };
    return context;
}

const wsLoadPlan = async (context) => {
    context = await loadPlan(setContextInput(context,
        {
            planId: context.params.planId,
            planName: context.params.planName,
            planNature: context.params.planNature,
            parentPlanId: context.params.parentPlanId,
            fDate: context.params.fDate,
            tDate: context.params.tDate,
            neededLogin: context.params.neededLogin
        }
    ));
    context.result = context.output.map(p => {
        return {
            planId: p.planId,
            planName: p.planName,
            description: p.description,
            planNature: p.planNature,
            icon: p.icon,
            fDate: p.fDate,
            tDate: p.tDate,
            neededLogin: p.neededLogin,
            parentPlanId: p.parentPlanId,
            parent: p.parent
        };
    });

    return context;
}

const wsLoadPlanPaginate = async (context) => {
    context = await loadPlanPaginate(setContextInput(context,
        {
            planId: context.params.planId,
            planName: context.params.planName,
            planNature: context.params.planNature,
            parentPlanId: context.params.parentPlanId,
            fDate: context.params.fDate,
            tDate: context.params.tDate,
            neededLogin: context.params.neededLogin
        }
    ));
    context.result = context.output.rows.map(p => {
        return {
            planId: p.planId,
            planName: p.planName,
            description: p.description,
            planNature: p.planNature,
            icon: p.icon,
            fDate: p.fDate,
            tDate: p.tDate,
            neededLogin: p.neededLogin,
            parentPlanId: p.parentPlanId,
            parent: p.parent
        };
    });
    context.count = context.output.count;

    return context;
}


const wsLoadPlanTree = async (context) => {
    context = await loadPlanTree(setContextInput(context));
    context.result = context.output
    return context;
}

const wsDeletePlan = async (context) => {

    
    context = await loadNeedyToPlan(setContextInput(context, { planId : context.params.planId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.dependecyError)
    }
    context = await loadSuccorCash(setContextInput(context, { planId : context.params.planId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.dependecyError)
    }
    context = await getPlanByParentPlan(setContextInput(context, { planId: context.params.planId }));
    if (context.output !== null) {
        throw createError(GlobalExceptions.plan.PlanUseAsFK)
    }
    context = await deletePlan(setContextInput(context, { planId: context.params.planId }));
    if (context.output === 0) {
        throw createError(GlobalExceptions.plan.PlanNotFound)
    }
    return context;
}

module.exports = { wsCreatePlan, wsUpdatePlan, wsLoadPlan, wsLoadPlanPaginate, wsDeletePlan, wsLoadPlanTree };