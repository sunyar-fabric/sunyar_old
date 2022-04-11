
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');
const { Op } = require('sequelize');

const Payment = db.tblPayment;


const loadPayment = async (context) => {   
    try {
      
        return await setContextOutput(context, await Payment.findAll(
        { where : context.input ,
            include : [{
                model: db.tblCashAssistanceDetail,
                required: true ,
                include : [{
                    model: db.tblPlan,
                    required: true ,
                }]
            } ,{
                model: db.tblCharityAccounts,
                required:false,  
            },{
                model: db.tblPersonal,
                required:false,
                as : "donator"
            },
            {
                model: db.tblPersonal,
                required:false,
                as : "needy"
            }]
                           
            } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const loadSettelment = async (context) => {   
    try {
        context.input.charityAccountId = {
            [Op.not]: null,
        }
        return await setContextOutput(context, await Payment.findAll(
        { where : context.input ,
            include : [{
                model: db.tblCashAssistanceDetail,
                required: true ,
                include : [{
                    model: db.tblPlan,
                    required: true ,
                }]
            } ,{
                model: db.tblCharityAccounts,
                required:false,  
            },{
                model: db.tblPersonal,
                required:false,
                as : "donator"
            },
            {
                model: db.tblPersonal,
                required:false,
                as : "needy"
            }]
                           
            } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const loadSumPayment = async (context) => {
    try {

        return await setContextOutput(context, await Payment.findAll(
        { where : context.input,
             attributes: [
            [db.sequelize.fn('SUM', db.sequelize.col('paymentPrice')),'totalPaymentPrice']]                
            } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createPayment = async (context) => {
    try {
        return setContextOutput(context, await Payment.create({
          
            donatorId : context.input.donatorId,
            cashAssistanceDetailId : context.input.cashAssistanceDetailId,
            paymentPrice : context.input.paymentPrice,
            paymentGatewayId : context.input.paymentGatewayId,
            paymentDate : context.input.paymentDate,
            paymentTime : context.input.paymentTime,
            paymentStatus : context.input.paymentStatus,
            sourceAccoutNumber : context.input.sourceAccoutNumber,
            targetAccountNumber : context.input.targetAccountNumber,
            charityAccountId : context.input.charityAccountId,
            followCode : context.input.followCode,
            needyId : context.input.needyId,
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
        return context;
}






module.exports = {loadPayment , createPayment ,loadSumPayment , loadSettelment };



