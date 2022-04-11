const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { loadNeedyToPlan , createNeedyToPlan , updateNeedyToPlan , deleteNeedyToPlan } = require("../atomicServices/needyToPlan");
const { loadSuccorCash } = require("../../../plan/succorCash/atomicServices/succorCash");
const { loadPlan } = require("../../plan/atomicServices/plan");


const wsLoadNeedyToPlan = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    const plan = await loadPlan(setContextInput(context, context.params));
    console.log("boom", plan.outputs[0][0]?.neededLogin );
    console.log("THIS IS BOOM", context.auth);
    if(plan.outputs[0][0]?.neededLogin){
        if(!context.auth){
        throw createError(GlobalExceptions.jwt.Forbidden); 
        }
    }
    context = await loadNeedyToPlan(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}


const  wsCreateNeedyToPlan = async (context) => {

    let loadPlanDate = await loadPlan(setContextInput(context, { planId : context.params.planId }))
    if(  Date.parse(loadPlanDate.output[0].fDate) >  Date.parse(context.params.fDate) ||  Date.parse(loadPlanDate.output[0].tDate) <  Date.parse(context.params.tDate )){
        throw createError(GlobalExceptions.plan.PlanFDateTDate)
    }
      
    context = await createNeedyToPlan(setContextInput(context, {
        planId : context.params.planId, 
        needyId : context.params.needyId, 
        fDate : context.params.fDate,
        tDate : context.params.tDate,
    }))
    context.result = {
        assignNeedyPlanId: context.output.map(a => a.assignNeedyPlanId)
    };
    return context;
}

const wsUpdateNeedyToPlan = async (context) => {
    let loadPlanDate = await loadPlan(setContextInput(context, { planId : context.params.planId }))
    if(  Date.parse(loadPlanDate.output[0].fDate) >  Date.parse(context.params.fDate) ||  Date.parse(loadPlanDate.output[0].tDate) <  Date.parse(context.params.tDate )){
        throw createError(GlobalExceptions.plan.PlanFDateTDate)
    }
    context = await updateNeedyToPlan(setContextInput(context, {
        assignNeedyPlanId : context.params.assignNeedyPlanId,
        planId : context.params.planId, 
        needyId : context.params.needyId, 
        fDate : context.params.fDate,
        tDate : context.params.tDate,
       
    }))
    context.result = context.output;
    
    return context;
}

const wsDeleteNeedyToPlan = async (context) => {
    context = await loadSuccorCash(setContextInput(context, { assignNeedyPlanId : context.params.assignNeedyPlanId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.dependecyError)
    }
    context = await deleteNeedyToPlan(setContextInput(context, 
       context.params
    ))
    if (context.output === 0) {
        throw createError(GlobalExceptions.plan.notFound)
    }
    context.result = context.output;
    
    return context;
}



module.exports = { wsLoadNeedyToPlan , wsCreateNeedyToPlan , wsUpdateNeedyToPlan , wsDeleteNeedyToPlan };