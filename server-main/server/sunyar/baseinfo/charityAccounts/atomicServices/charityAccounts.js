
const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');


const CharityAccounts = db.tblCharityAccounts;


const loadCharityAccounts = async (context) => {
    try {
      
        return await setContextOutput(context, await CharityAccounts.findAll(
           { where : context.input , 
            include : {
                  model: db.tblCommonBaseData,
                  required:true,
                  include: [
                    {
                      model: db.tblCommonBaseType,
                      where : {"baseTypeTitle" : "بانک"},
                      required:true
                    }
                  ]
                }
             } ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createCharityAccounts = async (context) => {
    try {

        return setContextOutput(context, await CharityAccounts.create({
           
        bankId : context.input.bankId, 
        branchName : context.input.branchName,
        ownerName : context.input.ownerName,
        cardNumber :  context.input.cardNumber,
        accountNumber : context.input.accountNumber,
        accountName : context.input.accountName
           
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }

}

const updateCharityAccounts = async (context) => {

    try {
     
        let updateResult = await CharityAccounts.update({

            bankId : context.input.bankId, 
            branchName : context.input.branchName,
            ownerName : context.input.ownerName,
            cardNumber :  context.input.cardNumber,
            accountNumber : context.input.accountNumber,
            accountName : context.input.accountName
           

        }, { where: { charityAccountId : context.input.charityAccountId } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await CharityAccounts.findByPk(context.input.charityAccountId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteCharityAccounts = async (context) => {
    try {
        return await setContextOutput(context, await CharityAccounts.destroy({ where: { charityAccountId : context.input.charityAccountId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = {loadCharityAccounts , createCharityAccounts , updateCharityAccounts , deleteCharityAccounts };



