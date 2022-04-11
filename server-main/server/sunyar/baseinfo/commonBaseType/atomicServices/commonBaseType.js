const db = require('../../../../config/dbIndex');
const { dbErrorHandling } = require('../../../../utility/error/dbError');
const { setContextOutput } = require('../../../../utility/logging');

const CommonBaseType = db.tblCommonBaseType;


const loadBaseType = async (context) => {
    try {
        return await setContextOutput(context, await CommonBaseType.findAll({ where: context.input }))
    } catch (error) {

        await dbErrorHandling(error, context);

    }

}

const createBaseType = async (context) => {
    try {

        return setContextOutput(context, await CommonBaseType.create({
            baseTypeTitle: context.input.baseTypeTitle,
            baseTypeCode: context.input.baseTypeCode,
           
        }));
    } catch (error) {
        await dbErrorHandling(error, context);
    }

}

const updateBaseType = async (context) => {

    try {
     
        let updateResult = await CommonBaseType.update({

           
            baseTypeTitle: context.input.baseTypeTitle

        }, { where: { commonBaseTypeId : context.input.commonBaseTypeId } })
        if (updateResult[0] == 1) {
            return await setContextOutput(context, await CommonBaseType.findByPk(context.input.commonBaseTypeId))
        }

    } catch (error) {
        await dbErrorHandling(error, context);
    }

}


const deleteBaseType = async (context) => {
    try {
        return await setContextOutput(context, await CommonBaseType.destroy({ where: { commonBaseTypeId : context.input.commonBaseTypeId } }))
    } catch (error) {
        await dbErrorHandling(error, context);
    }
}

module.exports = {loadBaseType , createBaseType , updateBaseType , deleteBaseType };


