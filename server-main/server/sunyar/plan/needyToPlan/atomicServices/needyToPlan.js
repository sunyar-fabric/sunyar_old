
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const NeedyToPlan = db.tblAssignNeedyToPlan;


const loadNeedyToPlan = async (context) => {
    try {
      
        return await setContextOutput(context, await NeedyToPlan.findAll(
           { where : context.input ,
            include :[ {
                model: db.tblPersonal,
                required:true,
                attributes:{
                    exclude: ["personPhoto"]
                }  
            },{
                model: db.tblPlan,
                required : true,
                   
                }]
            } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createNeedyToPlan = async (context) => {
    try {

        let bulkNeedyToPlan=[] 
        for(let i = 0; i < context.input.needyId.length ; i++) {
            bulkNeedyToPlan[i] ={
                planId : context.input.planId, 
                needyId : context.input.needyId[i],
                fDate : context.input.fDate,
                tDate : context.input.tDate

            }
            
        }
       

        return setContextOutput(context, await NeedyToPlan.bulkCreate(
            bulkNeedyToPlan
        ));
    } catch (error) {
        await dbErrorHandling(error, context);
    }

}

const updateNeedyToPlan = async (context) => {

    try {
     
        let updateResult = await NeedyToPlan.update({

            
            planId : context.input.planId, 
            needyId : context.input.needyId,
            fDate : context.input.fDate,
            tDate : context.input.tDate
           

        }, { where: { assignNeedyPlanId : context.input.assignNeedyPlanId, } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await NeedyToPlan.findByPk(context.input.assignNeedyPlanId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteNeedyToPlan = async (context) => {
    try {
        return await setContextOutput(context, await NeedyToPlan.destroy({ where: { assignNeedyPlanId : context.input.assignNeedyPlanId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = {loadNeedyToPlan , createNeedyToPlan, updateNeedyToPlan , deleteNeedyToPlan };



