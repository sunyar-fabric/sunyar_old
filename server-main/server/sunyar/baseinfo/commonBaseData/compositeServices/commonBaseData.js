const { setContextInput } = require("../../../../utility/logging");
const { loadBaseData , createBaseData , updateBaseData , deleteBaseData , loadBaseBank} = require("../atomicServices/commonBaseData");
const { loadCharityAccounts } = require("../../charityAccounts/atomicServices/charityAccounts");
const { loadNeedyAccounts } = require("../../../beneficiary/needyAccounts/atomicServices/needyAccounts");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");


const wsLoadBaseData = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    context = await loadBaseData(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}

const wsLoadBaseBank = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    context = await loadBaseBank(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}

const  wsCreateBaseData = async (context) => {

    let loadUniqFields = await loadBaseData(setContextInput(context, {
        commonBaseTypeId : context.params.commonBaseTypeId,
        baseValue : context.params.baseValue

            }))
    if (loadUniqFields.output[0] != null){
        throw createError(GlobalExceptions.baseInfo.baseDataUnique) 
    }
    
    context = await createBaseData(setContextInput(context, {
        baseValue : context.params.baseValue, 
        commonBaseTypeId : context.params.commonBaseTypeId,
        baseCode : context.params.baseCode
    }))
    context.result = {
        commonBaseDataId : context.output.commonBaseDataId,
    };
    return context;
}

const wsUpdateBaseData = async (context) => {
    
    let loadUniqFields = await loadBaseData(setContextInput(context, {
        commonBaseTypeId : context.params.commonBaseTypeId,
        baseValue : context.params.baseValue

            }))
    if ( loadUniqFields.output[0] != null && loadUniqFields.output[0].commonBaseDataId != context.params.commonBaseDataId){
        throw createError(GlobalExceptions.baseInfo.baseDataUnique) 
    }

    context = await updateBaseData(setContextInput(context, {
        commonBaseDataId : context.params.commonBaseDataId,
        baseValue : context.params.baseValue, 
        commonBaseTypeId : context.params.commonBaseTypeId
    }))
    context.result = context.output;
    
    return context;
}

const wsDeleteBaseData = async (context) => {

    context = await loadCharityAccounts(setContextInput(context, { bankId: context.params.commonBaseDataId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.baseInfo.commonBaseDataIdUseAsFK)
    }

    context = await loadNeedyAccounts(setContextInput(context, { bankId: context.params.commonBaseDataId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.baseInfo.commonBaseDataIdUseAsFK)
    }
   
    context = await deleteBaseData(setContextInput(context, 
       context.params
    ))
    if (context.output === 0) {
        throw createError(GlobalExceptions.baseInfo.commonBaseDataIdNotFound)
    }
    context.result = context.output;
    
    return context;
}



module.exports = { wsLoadBaseData ,  wsCreateBaseData , wsUpdateBaseData , wsDeleteBaseData , wsLoadBaseBank };