
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const NeedyAccounts = db.tblNeedyAccounts;


const loadNeedyAccounts = async (context) => {
    try {
      
        return await setContextOutput(context, await NeedyAccounts.findAll(
           { where : context.input ,
            include :[ {
                model: db.tblPersonal,
                required:true,  
           
            },{
                    model: db.tblCommonBaseData,
                    required:true,
                    include: [
                      {
                        model: db.tblCommonBaseType,
                        where : {"baseTypeTitle" : "بانک"},
                        required:true
                      }
                    ]
                   }]
             } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createNeedyAccounts = async (context) => {
    try {

        return setContextOutput(context, await NeedyAccounts.create({
          
            bankId : context.input.bankId, 
            needyId : context.input.needyId, 
            ownerName : context.input.ownerName,
            cardNumber :  context.input.cardNumber,
            accountNumber : context.input.accountNumber,
            accountName : context.input.accountName,
            shebaNumber : context.input.shebaNumber
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }

}

const updateNeedyAccounts = async (context) => {

    try {
     
        let updateResult = await NeedyAccounts.update({

            needyAccountId : context.input.needyAccountId,
            bankId : context.input.bankId, 
            needyId : context.input.needyId, 
            ownerName : context.input.ownerName,
            cardNumber :  context.input.cardNumber,
            accountNumber : context.input.accountNumber,
            accountName : context.input.accountName,
            shebaNumber : context.input.shebaNumber
           

        }, { where: { needyAccountId : context.input.needyAccountId, } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await NeedyAccounts.findByPk(context.input.needyAccountId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteNeedyAccounts = async (context) => {
    try {
        return await setContextOutput(context, await NeedyAccounts.destroy({ where: { needyAccountId : context.input.needyAccountId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = {loadNeedyAccounts , createNeedyAccounts, updateNeedyAccounts , deleteNeedyAccounts };



