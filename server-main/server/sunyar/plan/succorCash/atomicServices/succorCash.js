
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const SuccorCash = db.tblCashAssistanceDetail;


const loadSuccorCash = async (context) => {
    try {
      
        return await setContextOutput(context, await SuccorCash.findAll(
        { where : context.input ,
            include : [{
                model: db.tblAssignNeedyToPlan,
                required:false,
                include :[ {
                    model: db.tblPersonal,
                    required:true,
                    attributes: {
                        exclude: ["personPhoto"] 
                    } 
            
                },{
                    model: db.tblPlan,
                    required:true,  
                }]
            }]
                           
            } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createSuccorCash = async (context) => {
    try {
        return setContextOutput(context, await SuccorCash.create({
          
            assignNeedyPlanId : context.input.assignNeedyPlanId, 
            planId : context.input.planId, 
            neededPrice : context.input.neededPrice, 
            minPrice : context.input.minPrice,
            description : context.input.description,
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }
        return context;
}

const updateSuccorCash = async (context) => {

    try {
     
        let updateResult = await SuccorCash.update({

          
            assignNeedyPlanId : context.input.assignNeedyPlanId, 
            planId : context.input.planId, 
            neededPrice : context.input.neededPrice, 
            minPrice : context.input.minPrice,
            description : context.input.description,

        }, { where: { cashAssistanceDetailId : context.input.cashAssistanceDetailId, } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await SuccorCash.findByPk(context.input.cashAssistanceDetailId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteSuccorCash = async (context) => {
    try {
        return await setContextOutput(context, await SuccorCash.destroy({ where: { cashAssistanceDetailId : context.input.cashAssistanceDetailId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = {loadSuccorCash , createSuccorCash , updateSuccorCash , deleteSuccorCash };



