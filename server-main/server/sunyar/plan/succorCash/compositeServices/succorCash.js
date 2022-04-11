const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { loadSuccorCash , createSuccorCash , updateSuccorCash , deleteSuccorCash } = require("../atomicServices/succorCash");
const { loadPayment } = require("../../../operation/payment/atomicServices/payment");


const wsLoadSuccorCash = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    context = await loadSuccorCash(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}


const  wsCreateSuccorCash = async (context) => {

    let loadUniqueKeys = await loadSuccorCash(setContextInput(context, {
        assignNeedyPlanId : context.params.assignNeedyPlanId,
        planId : context.params.planId
    }))
    if (loadUniqueKeys.output[0] != null){
        throw createError(GlobalExceptions.plan.succorUnique) 
    }
  

    if(Number(context.params.minPrice) >Number(context.params.neededPrice)){
        throw createError(GlobalExceptions.plan.overMinPrice)
    }
    context = await createSuccorCash(setContextInput(context, {
        assignNeedyPlanId : context.params.assignNeedyPlanId, 
        planId : context.params.planId, 
        neededPrice : context.params.neededPrice,
        minPrice : context.params.minPrice,
        description : context.params.description,
    }))
    context.result = {
        cashAssistanceDetailId : context.output.cashAssistanceDetailId
    };
    return context;
}

const wsUpdateSuccorCash = async (context) => {
    let loadUniqueKeys = await loadSuccorCash(setContextInput(context, {
        assignNeedyPlanId : context.params.assignNeedyPlanId,
        planId : context.params.planId
    }))
    if (loadUniqueKeys.output[0] != null && loadUniqueKeys.output[0].cashAssistanceDetailId != context.params.cashAssistanceDetailId){
        throw createError(GlobalExceptions.plan.succorUnique) 
    }

    if(Number(context.params.minPrice) >Number(context.params.neededPrice)){
        throw createError(GlobalExceptions.plan.overMinPrice)
    }
    context = await updateSuccorCash(setContextInput(context, {
        cashAssistanceDetailId : context.params.cashAssistanceDetailId, 
        assignNeedyPlanId : context.params.assignNeedyPlanId, 
        planId : context.params.planId, 
        neededPrice : context.params.neededPrice, 
        minPrice : context.params.minPrice,
        description : context.params.description,
       
    }))
    context.result = context.output;
    
    return context;
}

const wsDeleteSuccorCash = async (context) => {
    context = await loadPayment(setContextInput(context, { cashAssistanceDetailId : context.params.cashAssistanceDetailId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.dependecyError)
    }
   
    context = await deleteSuccorCash(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    
    return context;
}



module.exports = { wsCreateSuccorCash, wsUpdateSuccorCash, wsLoadSuccorCash, wsDeleteSuccorCash  };