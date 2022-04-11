const { setContextInput } = require("../../../../utility/logging");
const { createError } = require("../../../../utility/error/errorHandling");
const { loadBaseType, createBaseType, updateBaseType, deleteBaseType } = require("../atomicServices/commonBaseType");
const { loadBaseData } = require("../../commonBaseData/atomicServices/commonBaseData");
const { GlobalExceptions } = require("../../../../utility/error/exceptions");

const wsLoadBaseType = async (context) => {
    for (x in context.params) {
        if (context.params[x] == 'null') {
            context.params[x] = null
        }
    }
    context = await loadBaseType(setContextInput(context,
        context.params
    ))
    context.result = context.output;
    return context;
}


const wsCreateBaseType = async (context) => {
    switch (true) {
    case (context.params. baseTypeTitle != null):
        let loadBaseTypeTitle = await loadBaseType(setContextInput(context, {
            baseTypeTitle : context.params.baseTypeTitle
                }))
          if (loadBaseTypeTitle.output[0] != null){
             throw createError(GlobalExceptions.baseInfo.baseTypeTitleUnique) 
          }
        break;
    case (context.params.baseTypeCode != null):
        let loadBaseTypeCode = await loadBaseType(setContextInput(context, {
            baseTypeCode : context.params.baseTypeCode
                }))
            if (loadBaseTypeCode.output[0] != null){
                throw createError(GlobalExceptions.baseInfo.baseTypeCodeUnique) 
            }
   
        break;
    }

    
    context = await createBaseType(setContextInput(context, {
        baseTypeTitle: context.params.baseTypeTitle,
        baseTypeCode: context.params.baseTypeCode
    }))
    context.result = {
        commonBaseTypeId: context.output.commonBaseTypeId,
    };
    return context;
}

const wsUpdateBaseType = async (context) => {

    switch (true) {
        case (context.params. baseTypeTitle != null):
            let loadBaseTypeTitle = await loadBaseType(setContextInput(context, {
                baseTypeTitle : context.params.baseTypeTitle
                    }))
              if (loadBaseTypeTitle.output[0] != null  && loadBaseTypeTitle.output[0].commonBaseTypeId != context.params.commonBaseTypeId && loadBaseTypeTitle.output[0] != null){
                 throw createError(GlobalExceptions.baseInfo.baseTypeTitleUnique) 
              }
            break;
        case (context.params.baseTypeCode != null):
            let loadBaseTypeCode = await loadBaseType(setContextInput(context, {
                baseTypeCode : context.params.baseTypeCode
                    }))
                if (loadBaseTypeCode.output[0] != null && loadBaseTypeCode.output[0].commonBaseTypeId != context.params.commonBaseTypeId && loadBaseTypeCode.output[0] != null){
                    throw createError(GlobalExceptions.baseInfo.baseTypeCodeUnique) 
                }
            break;
    }

    context = await updateBaseType(setContextInput(context, {
        commonBaseTypeId: context.params.commonBaseTypeId,
        baseTypeTitle: context.params.baseTypeTitle,

    }))
    context.result = context.output;

    return context;
}

const wsDeleteBaseType = async (context) => {

    context = await loadBaseData(setContextInput(context, { commonBaseTypeId: context.params.commonBaseTypeId }))
    if (context.output[0]) {
        throw createError(GlobalExceptions.baseInfo.commonBaseTypeIdUseAsFK)
    }

    context = await deleteBaseType(setContextInput(context, context.params))
    if (context.output === 0) {
        throw createError(GlobalExceptions.baseInfo.commonBaseTypeIdNotFound)
    }
    context.result = context.output;

    return context;
}



module.exports = { wsLoadBaseType, wsCreateBaseType, wsUpdateBaseType, wsDeleteBaseType };