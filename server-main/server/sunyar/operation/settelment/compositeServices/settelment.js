const { createError } = require("../../../../utility/error/errorHandling");
const { setContextInput } = require("../../../../utility/logging");
//const { wsLoadSuccorCash } = require("../../../plan/succorCash/compositeServices/succorCash");
//const { loadSuccorCash } = require("../../../plan/succorCash/atomicServices/succorCash");
//const { loadPayment, loadSumPayment } = require("../../payment/atomicServices/payment");
const { createSettelment , deleteSettelment, loadSettelment, loadSumSettelment  } = require("../atomicServices/settelment");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { Op } = require('sequelize');

const wsCreateSettelment = async (context) => {

    let A,B
    
    // A is sum of donators payments
    
    A = await loadSumSettelment(setContextInput(context, {
        paymentStatus: "success",
        charityAccountId: null,
        cashAssistanceDetailId: context.params.cashAssistanceDetailId
    }))
    A = A.output[0].totalPaymentPrice
    
    // B is sum of charities settelments
   
    B = await loadSumSettelment(setContextInput(context, {
        paymentStatus: "success",
        charityAccountId: context.params.charityAccountId,
        cashAssistanceDetailId: context.params.cashAssistanceDetailId
    }))
    B = B.output[0].totalPaymentPrice

   if ( Number(context.params.paymentPrice) + Number(B) > Number(A) ) {
    throw createError(GlobalExceptions.operation.wrongPayment)
}
 

    context = await createSettelment(setContextInput(context, {

        
        cashAssistanceDetailId: context.params.cashAssistanceDetailId,
        paymentPrice: context.params.paymentPrice,
        paymentGatewayId: context.params.paymentGatewayId,
        paymentDate: context.params.paymentDate,
        paymentTime: context.params.paymentTime,
        paymentStatus: context.params.paymentStatus,
        sourceAccoutNumber: context.params.sourceAccoutNumber,
        targetAccountNumber: context.params.targetAccountNumber,
        charityAccountId: context.params.charityAccountId,
        followCode: context.params.followCode,
        needyId: context.params.needyId,
    }))
    context.result = {
        paymentId: context.output.paymentId
    };
    return context;
}

const wsLoadDonatorSettelment = async (context) => {
    for (x in context.params) {
        if (context.params[x] == 'null') {
            context.params[x] = null
        }
    }
    let loadDonatorInput
    switch (true) {
        case (context.params.needyId == null && context.params.donatorId == null):
            loadDonatorInput = {
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : null
            }
            break;
        case (context.params.needyId == null && context.params.donatorId != null):
            loadDonatorInput = {
                donatorId : context.params.donatorId,
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : null
            }
            break;
        case (context.params.needyId != null && context.params.donatorId == null):
            loadDonatorInput = {
                needyId : context.params.needyId,
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : null
            }
            break;
    
        default:
            loadDonatorInput = {
                donatorId : context.params.donatorId,
                needyId : context.params.needyId,
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : null
            }
            break;
    }
 
    // fdate and tdate for report

    switch (true) {
        case (context.params.fDate != null && context.params.tDate != null ):
            loadDonatorInput.paymentDate = {
                [Op.gte]: Number(context.params.fDate) ,
                [Op.lte]: Number(context.params.tDate) ,
            }
            break;
        case (context.params.fDate != null && context.params.tDate == null ):
            loadDonatorInput.paymentDate = {
                [Op.gte]:Number(context.params.fDate) ,
            }
            break;
        case (context.params.fDate == null && context.params.tDate != null ):
            loadDonatorInput.paymentDate = {
                [Op.lte]: Number(context.params.tDate) ,
            }
        break;
        default:
            loadDonatorInput.paymentDate = {
                [Op.lte]: new Date().getTime() ,
            }
            break;
    }

    context = await loadSumSettelment(setContextInput(context,loadDonatorInput))
    if(context.output[0].totalPaymentPrice == null){
        context.output[0].totalPaymentPrice = 0 
    }
    context.result = context.output;
    return context;
}


const wsLoadCharitySettelment = async (context) => {
    for (x in context.params) {
        if (context.params[x] == 'null') {
            context.params[x] = null
        }
    }
    let loadCharityInput 
    switch (true) {
        case (context.params.needyId == null):
            loadCharityInput = {
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : context.params.charityAccountId,
            }
            break;
        default:
            loadCharityInput = {
               
                needyId : context.params.needyId,
                cashAssistanceDetailId : context.params.cashAssistanceDetailId,
                charityAccountId : context.params.charityAccountId,
            }
            break;
    }


    switch (true) {
        case (context.params.fDate != null && context.params.tDate != null ):
            loadCharityInput.paymentDate = {
                [Op.gte]: Number(context.params.fDate) ,
                [Op.lte]: Number(context.params.tDate) ,
            }
            break;
        case (context.params.fDate != null && context.params.tDate == null ):
            loadCharityInput.paymentDate = {
                [Op.gte]:Number(context.params.fDate) ,
            }
            break;
        case (context.params.fDate == null && context.params.tDate != null ):
            loadCharityInput.paymentDate = {
                [Op.lte]: Number(context.params.tDate) ,
            }
        break;
        default:
            loadCharityInput.paymentDate = {
                [Op.lte]: new Date().getTime() ,
            }
            break;
    }
    

    context = await loadSumSettelment(setContextInput(context,loadCharityInput))
    if(context.output[0].totalPaymentPrice == null){
        context.output[0].totalPaymentPrice = 0 
    }
    context.result = context.output;
    return context;
}




const wsDeleteSettelment = async (context) => {
    context = await deleteSettelment(setContextInput(context,
        context.params
    ))
    context.result = context.output;

    return context;
}





module.exports = { wsCreateSettelment, wsDeleteSettelment, wsLoadCharitySettelment, wsLoadDonatorSettelment  };