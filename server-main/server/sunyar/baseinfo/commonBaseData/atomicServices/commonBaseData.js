const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const CommonBaseData = db.tblCommonBaseData;


const loadBaseBank = async (context) => {
    try {
        return await setContextOutput(context, await CommonBaseData.findAll({ where : context.input ,
            include : [{
                model: db.tblCommonBaseType,
                required:true,
                where : { baseTypeTitle : "بانک"},
            }]
                           
        }))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const loadBaseData = async (context) => {
    try {
        return await setContextOutput(context, await CommonBaseData.findAll({ where: context.input }
            ))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}


const createBaseData = async (context) => {
    try {

        return setContextOutput(context, await CommonBaseData.create({
           
            baseValue :context.input.baseValue,
            baseCode :context.input.baseCode ,
            commonBaseTypeId :context.input.commonBaseTypeId
           
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }

}

const updateBaseData = async (context) => {

    try {
     
        let updateResult = await CommonBaseData.update({

            baseValue :context.input.baseValue,
            commonBaseTypeId :context.input.commonBaseTypeId
           

        }, { where: { commonBaseDataId : context.input.commonBaseDataId } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await CommonBaseData.findByPk(context.input.commonBaseDataId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteBaseData = async (context) => {
    try {
        return await setContextOutput(context, await CommonBaseData.destroy({ where: { commonBaseDataId : context.input.commonBaseDataId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = { loadBaseData ,createBaseData , updateBaseData , deleteBaseData , loadBaseBank };




// exports.getQuestionList = async (productId, page = 1, count = 5) => {
//     let result = await Product.findAndCountAll({})


//     return result
// };

