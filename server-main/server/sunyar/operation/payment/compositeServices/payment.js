const { createError } = require("../../../../utility/error/errorHandling");
const { setContextInput } = require("../../../../utility/logging");
const { wsLoadSuccorCash } = require("../../../plan/succorCash/compositeServices/succorCash");
const { loadSuccorCash } = require("../../../plan/succorCash/atomicServices/succorCash");
const { loadPayment, createPayment, loadSumPayment , loadSettelment} = require("../atomicServices/payment");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");
const { Op } = require('sequelize');


const wsLoadPayment = async (context) => {
    for (x in context.params) {
        if (context.params[x] == 'null') {
            context.params[x] = null
            //delete context.params[x];
        }
    }
   switch (true) {
        case (context.params.fDate != null && context.params.tDate != null ):
            if (context.params.fDate == context.params.tDate){
                    context.params.paymentDate = {
                            [Op.gte]: Number(context.params.tDate) ,
                            [Op.lte]: Number(context.params.tDate) + 24*60*60*1000
                        }
            }
            else{
                context.params.paymentDate = {
                    [Op.gte]: Number(context.params.fDate) ,
                    [Op.lte]: Number(context.params.tDate) + 24*60*60*1000 ,
                }
            }
            break;
        case (context.params.fDate != null && context.params.tDate == null ):
            context.params.paymentDate = {
                [Op.gte]:Number(context.params.fDate) ,
            }
            break;
        case (context.params.fDate == null && context.params.tDate != null ):
            context.params.paymentDate = {
                [Op.lte]: Number(context.params.tDate) ,
            }
        break;
        default:
            context.params.paymentDate = {
                [Op.lte]: new Date().getTime() ,
            }
            break;
    }
    await delete context.params.fDate
    await delete context.params.tDate

    context = await loadPayment(setContextInput(context,
        context.params
    ))
    context.result = context.output;
    return context;
}

const wsLoadSettelment = async (context) => {
    for (x in context.params) {
        if (context.params[x] == 'null') {
            context.params[x] = null
        }
    }

   switch (true) {
        case (context.params.fDate != null && context.params.tDate != null ):
            context.params.paymentDate = {
                [Op.gte]: Number(context.params.fDate) ,
                [Op.lte]: Number(context.params.tDate) ,
            }
            break;
        case (context.params.fDate != null && context.params.tDate == null ):
            context.params.paymentDate = {
                [Op.gte]:Number(context.params.fDate) ,
            }
            break;
        case (context.params.fDate == null && context.params.tDate != null ):
            context.params.paymentDate = {
                [Op.lte]: Number(context.params.tDate) ,
            }
        break;
        default:
            context.params.paymentDate = {
                [Op.lte]: new Date().getTime() ,
            }
            break;
    }
    await delete context.params.fDate
    await delete context.params.tDate

    context = await loadSettelment(setContextInput(context,
        context.params
    ))
    context.result = context.output;
    return context;
}
  
    const  wsCreatePayment = async (context) => {
        let A,C
        C = await loadSuccorCash(setContextInput(context,{cashAssistanceDetailId : context.params.cashAssistanceDetailId}))
        C = C.output[0]. neededPrice

            if ( context.params.paymentStatus == "success" &&  context.params.charityAccountId == null ){
                A = await loadSumPayment(setContextInput(context,{
                    paymentStatus : "success",
                    charityAccountId : null,
                    cashAssistanceDetailId : context.params.cashAssistanceDetailId
                }))
                A = A.output[0].totalPaymentPrice
            }
            if (Number(A) + Number(context.params.paymentPrice) > Number(C)){
                throw createError(GlobalExceptions.operation.overPayment)  
            }
        context = await createPayment(setContextInput(context, {
       
            donatorId : context.params.donatorId,
            cashAssistanceDetailId : context.params.cashAssistanceDetailId,
            paymentPrice : context.params.paymentPrice,
            paymentGatewayId : context.params.paymentGatewayId,
            paymentDate : context.params.paymentDate,
            paymentTime : context.params.paymentTime,
            paymentStatus : context.params.paymentStatus,
            sourceAccoutNumber : context.params.sourceAccoutNumber,
            targetAccountNumber : context.params.targetAccountNumber,
            charityAccountId : context.params.charityAccountId,
            followCode : context.params.followCode,
            needyId : context.params.needyId,
        }))
        context.result = {
            paymentId : context.output.paymentId,
            payPrice : Number(A) + Number(context.params.paymentPrice)
        };
        return context;
}







module.exports = { wsCreatePayment, wsLoadPayment , wsLoadSettelment };