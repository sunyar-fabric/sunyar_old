const Joi = require('joi');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;

const validateLoadBaseData = async (body, language) => {
    var schema = Joi.object().keys({
        commonBaseDataId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه مقادیر ثابت صحیح نمیاشد`,
        }).allow('null', null),
        baseValue: Joi.string().min(1).max(800)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در عنوان استفاده نکنید")}
        }).messages({
            'string.base': `نوع ورودی عنوان مقادیر ثابت صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
        }),
        baseCode: Joi.string().min(6).max(6)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در عنوان استفاده نکنید")}
        }).messages({
            'string.max': 'شناسه ثابت وارد شده باید 6 رقمی باشد',
            'string.min': 'شناسه ثابت وارد شده باید 6 رقمی باشد',

        }).allow('null', null),
        commonBaseTypeId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه مقادیر ثابت صحیح نمیاشد`,
        }).allow('null', null),
    });
    var schemaEn = Joi.object().keys({
        commonBaseDataId: Joi.number().integer().allow('null', null),
        baseValue: Joi.string().min(1).max(800)
        ,
        baseCode: Joi.string().min(6).max(6)
        .allow('null', null),
        commonBaseTypeId: Joi.number().integer().allow('null', null),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};
 
const validateCreateBaseData = async (body, language) => {
    var schema = Joi.object().keys({
        commonBaseTypeId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه ثابت صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه نوع ثابت اجباری است`,
            'any.required': `ورودی  شناسه نوع ثابت اجباری است`
        }),
        baseValue: Joi.string().required().min(1).max(800).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در عنوان استفاده نکنید")}
        }).messages({
            'string.base': `نوع ورودی عنوان مقادیر ثابت صحیح نمیاشد`,
            'string.empty': `ورودی  عنوان اجباری است`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
            'any.required': `ورودی عنوان اجباری است`
        }),
    });
    var schemaEn = Joi.object().keys({
        commonBaseTypeId: Joi.number().required().integer(),
        baseValue: Joi.string().required().min(1).max(800).trim()
        ,
    });
  
    schema = language.en? schemaEn: schema; 

    return schema.validate(body);
};

const validateUpdateBaseData = async (body, language) => {
    var schema = Joi.object().keys({
        commonBaseDataId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه مقادیر ثابت صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه مقادیر ثابت اجباری است`,
            'any.required': `ورودی  شناسه مقادیر ثابت اجباری است`
        }),
        baseValue: Joi.string().required().min(1).max(800).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در عنوان استفاده نکنید")}
        }).messages({
            'string.base': `نوع ورودی صحیح نمیاشد`,
            'string.empty': `ورودی  عنوان اجباری است`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
            'any.required': `ورودی عنوان اجباری است`
        }),
        commonBaseTypeId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی  شناسه ثابت صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه ثابت اجباری است`,
            'any.required': `ورودی  شناسه ثابت اجباری است`
        }),
    });
    var schemaEn = Joi.object().keys({
        commonBaseDataId: Joi.number().required().integer(),
        baseValue: Joi.string().required().min(1).max(800).trim()
        ,
        commonBaseTypeId: Joi.number().required().integer(),
    });
    schema = language.en? schemaEn: schema; 

    return schema.validate(body);
};
const validateDeleteBaseData = async (body, language) => {

    var schema = Joi.object().keys({
        commonBaseDataId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی مقادیر ثابت باید عدد باشد `,
            'number.empty': `ورودی  شناسه مقدار ثابت اجباری است`,
            'any.required': `ورودی  شناسه مقدار ثابت اجباری است`
        }).allow("null"),
    });
    var schemaEn = Joi.object().keys({
        commonBaseDataId: Joi.number().integer().required().allow("null"),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

module.exports = {
    validateLoadBaseData,
    validateCreateBaseData,
    validateUpdateBaseData,
    validateDeleteBaseData
}