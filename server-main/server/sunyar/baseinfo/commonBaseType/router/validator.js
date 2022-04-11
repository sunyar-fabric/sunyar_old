const Joi = require('joi');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;

const validateLoadBaseType = async (body) => {
    const schema = Joi.object().keys({
        commonBaseTypeId: Joi.number().integer().messages({
            'number.base': `نوع شناسه صحیح نمیاشد`,
        }),
        baseTypeCode: Joi.string().min(3).max(3)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز استفاده نکنید");}
        }).messages({
            'string.max': 'شناسه ثابت وارد شده باید سه رقمی باشد',
            'string.min': 'شناسه ثابت وارد شده باید سه رقمی باشد',
        }),
        baseTypeTitle: Joi.string().min(1).max(800)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در عنوان استفاده نکنید");}
        }).messages({
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
        }),
    });
    return schema.validate(body);
};

const validateCreateBaseType = async (body) => {
    const schema = Joi.object().keys({
            baseTypeTitle: Joi.string().required().min(1).max(800).trim()
            .custom((value, helper)=>{
                if(preventSqlInjection(value)){
                    return true
                }else {return helper.message("از کارکترهای غیر مجاز در عنوان استفاده نکنید");}
            }).messages({
                'string.base': `نوع ورودی عنوان به صورت کاراکتر باشد`,
                'string.empty': `ورودی  عنوان اجباری است`,
                'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
                'any.required': `ورودی عنوان اجباری است`
            }),
            baseTypeCode: Joi.string().required().min(3).max(3).trim()
            .custom((value, helper)=>{
                if(preventSqlInjection(value)){
                    return true
                }else {return helper.message("از کارکترهای غیر مجاز استفاده نکنید");}
            }).messages({
                'string.max': 'شناسه ثابت ساخته شده باید سه رقمی باشد',
                'string.min': 'شناسه ثابت ساخته شده باید سه رقمی باشد',

            }),

    });
    return schema.validate(body);
};

const validateUpdateBaseType = async (body) => {
    const schema = Joi.object().keys({
        commonBaseTypeId: Joi.number().required().integer().messages({
            'number.base': ` نوع ورودی شناسه ثابت به صورت عدد باشد`,
            'number.empty': `  شناسه ثابت اجباری است`,
            'any.required': ` شناسه ثابت اجباری است`
        }),
        baseTypeTitle: Joi.string().required().min(1).max(800).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در عنوان استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی عنوان به صورت کاراکتر باشد`,
            'string.empty': `ورودی  عنوان اجباری است`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
            'any.required': `ورودی عنوان اجباری است`
        }),
    });
    return schema.validate(body);
};
const validateDeleteBaseType = async (body) => {

    const schema = Joi.object().keys({
        commonBaseTypeId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه ثابت به صورت عدد باشد`,
            'number.empty': `ورودی  شناسه ثابت اجباری است`,
            'any.required': `ورودی  شناسه ثابت اجباری است`
        }),
    });

    return schema.validate(body);
};

module.exports = {validateLoadBaseType,
    validateCreateBaseType,
    validateUpdateBaseType,
    validateDeleteBaseType
}