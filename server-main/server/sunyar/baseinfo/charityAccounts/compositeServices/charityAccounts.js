const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { loadCharityAccounts , createCharityAccounts , updateCharityAccounts , deleteCharityAccounts } = require("../atomicServices/charityAccounts");
const { loadPayment } = require("../../../operation/payment/atomicServices/payment");


const wsLoadCharityAccounts = async (context) => {
    for (x in context.params){
        if (context.params[x] == 'null'){
            context.params[x] = null
        }
    }
    context = await loadCharityAccounts(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    return context;
}


const  wsCreateCharityAccounts = async (context) => {
    if(context.params.cardNumber){
    let loadCardNumber = await loadCharityAccounts(setContextInput(context, {
                cardNumber : context.params.cardNumber
            }))
        if (loadCardNumber.output[0] != null){
            throw createError(GlobalExceptions.baseInfo.charityAccountCardNumber) 
        }
    }

    let loadAccountNumber = await loadCharityAccounts(setContextInput(context, {
        accountNumber : context.params.accountNumber
    }))
    if (loadAccountNumber.output[0] != null){
        throw createError(GlobalExceptions.baseInfo.charityAccountAccountNumber) 
    }

    context = await createCharityAccounts(setContextInput(context, {
        bankId : context.params.bankId, 
        branchName : context.params.branchName,
        ownerName : context.params.ownerName,
        cardNumber :  context.params.cardNumber,
        accountNumber : context.params.accountNumber,
        accountName : context.params.accountName
    }))
    context.result = {
        charityAccountId : context.output.charityAccountId,
    };
    return context;
}

const wsUpdateCharityAccounts = async (context) => {

    if(context.params.cardNumber){
        let loadCardNumber = await loadCharityAccounts(setContextInput(context, {
                 cardNumber : context.params.cardNumber
             }))
        
          if (loadCardNumber.output[0] != null && loadCardNumber.output[0].charityAccountId != context.params.charityAccountId){
             throw createError(GlobalExceptions.baseInfo.charityAccountCardNumber) 
          }
     }

     let loadAccountNumber = await loadCharityAccounts(setContextInput(context, {
        accountNumber : context.params.accountNumber
    }))
    if (loadAccountNumber.output[0] != null && loadAccountNumber.output[0].charityAccountId != context.params.charityAccountId){
        throw createError(GlobalExceptions.baseInfo.charityAccountAccountNumber) 
    }
    context = await updateCharityAccounts(setContextInput(context, {
        charityAccountId : context.params.charityAccountId,
        bankId : context.params.bankId, 
        branchName : context.params.branchName,
        ownerName : context.params.ownerName,
        cardNumber :  context.params.cardNumber,
        accountNumber : context.params.accountNumber,
        accountName : context.params.accountName
       
    }))
    context.result = context.output;
    
    return context;
}

const wsDeleteCharityAccounts = async (context) => {

    context = await loadPayment(setContextInput(context, { charityAccountId: context.params.charityAccountId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.baseInfo.charityAccountIdUseAsFK)
    }
    context = await deleteCharityAccounts(setContextInput(context, 
       context.params
    ))
    context.result = context.output;
    
    return context;
}



module.exports = { wsLoadCharityAccounts , wsCreateCharityAccounts , wsUpdateCharityAccounts , wsDeleteCharityAccounts };