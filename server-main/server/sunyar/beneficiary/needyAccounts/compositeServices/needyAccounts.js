const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
let fnCompare  = require("../../../../utility/fnCompareAccountNumber");
const { loadNeedyAccounts , createNeedyAccounts , updateNeedyAccounts , deleteNeedyAccounts } = require("../atomicServices/needyAccounts");



const wsLoadNeedyAccounts = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    context = await loadNeedyAccounts(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}


const  wsCreateNeedyAccounts = async (context) => {

    let loadUniques = await loadNeedyAccounts(setContextInput(context, {
        accountNumber : context.params.accountNumber,
        needyId : context.params.needyId,   
    }))
    if (loadUniques.output[0] != null){
        throw createError(GlobalExceptions.beneficiary.fieldsUniques) 
    }

    let loadShebaNumber = await loadNeedyAccounts(setContextInput(context, {
        shebaNumber : context.params.shebaNumber
    }))
    if (loadShebaNumber.output[0] != null){
        throw createError(GlobalExceptions.beneficiary.shebaNumberUnique) 
    }
    if (!fnCompare(context.params.shebaNumber,context.params.accountNumber)){
        throw createError(GlobalExceptions.beneficiary.compareAccountNumber) 
    }

    context = await createNeedyAccounts(setContextInput(context, {
        bankId : context.params.bankId, 
        needyId : context.params.needyId, 
        ownerName : context.params.ownerName,
        cardNumber :  context.params.cardNumber,
        accountNumber : context.params.accountNumber,
        accountName : context.params.accountName,
        shebaNumber : context.params.shebaNumber
    }))
    context.result = {
        needyAccountId : context.output.needyAccountId,
    };
    return context;
}

const wsUpdateNeedyAccounts = async (context) => {

    let loadUniques = await loadNeedyAccounts(setContextInput(context, {
        accountNumber : context.params.accountNumber,
        needyId : context.params.needyId,   
    }))
    if (loadUniques.output[0] != null &&  loadUniques.output[0].needyAccountId != context.params.needyAccountId){
        throw createError(GlobalExceptions.beneficiary.fieldsUniques) 
    }

    let loadShebaNumber = await loadNeedyAccounts(setContextInput(context, {
        shebaNumber : context.params.shebaNumber
    }))
    if (loadShebaNumber.output[0] != null &&  loadShebaNumber.output[0].needyAccountId != context.params.needyAccountId){
        throw createError(GlobalExceptions.beneficiary.shebaNumberUnique) 
    }    

    if (!fnCompare(context.params.shebaNumber,context.params.accountNumber)){
        throw createError(GlobalExceptions.beneficiary.compareAccountNumber) 
    }

    context = await updateNeedyAccounts(setContextInput(context, {
        needyAccountId : context.params.needyAccountId,
        bankId : context.params.bankId, 
        needyId : context.params.needyId, 
        ownerName : context.params.ownerName,
        cardNumber :  context.params.cardNumber,
        accountNumber : context.params.accountNumber,
        accountName : context.params.accountName,
        shebaNumber : context.params.shebaNumber
       
    }))
    context.result = context.output;
    
    return context;
}

const wsDeleteNeedyAccounts = async (context) => {
    context = await deleteNeedyAccounts(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    
    return context;
}



module.exports = { wsLoadNeedyAccounts , wsCreateNeedyAccounts , wsUpdateNeedyAccounts , wsDeleteNeedyAccounts };