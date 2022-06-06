const Joi = require('joi');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;
const  preventSqlInjectionV2  = require('../../../../utility/fnPreventSqlInjection').customInjection;


const validateCreatePlan = async (body, language) => {
    var schema = Joi.object().keys({
        planName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام طرح استفاده نکنید");}
        })
        .messages({
            'string.base': `نوع نام طرح صحیح نمی‌باشد`,
            'string.empty': `نام طرح اجباری است`,
            'any.required': `نام طرح اجباری است`
        })
        ,
        description: Joi.string().allow(null,'')
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در توضیحات استفاده نکنید");}
        }).messages({
            'string.base': `نوع توضیحات طرح صحیح نمی‌باشد`,
            'string.empty': `توضیحات طرح اجباری است`
        }),
        planNature: Joi.boolean().required().messages({
            'boolean.base': `نوع ماهیت طرح صحیح نمی‌باشد`,
            'any.required': `ماهیت طرح اجباری است`
        }),
        parentPlanId: Joi.number().integer().allow(null,"null").messages({
            'number.base': `نوع طرح پدر صحیح نمی‌باشد`
        }),
        ////-------------------- blob checked ----------------
        icon: Joi.allow(null,"null"),
        fDate: Joi.date().required().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
        }),
        tDate: Joi.date().required().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`,
        }),
        neededLogin: Joi.boolean().required().messages({
            'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
            'any.required': `ورودی اجباری است`,
            'number.empty' : `تاریخ شروع طرح  اجباری است`
        }),
        isFinal: Joi.boolean().required()
    });
    const schemaEn = Joi.object().keys({
        planName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed");}
        })
        ,
        description: Joi.string().allow(null,'')
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        planNature: Joi.boolean().required(),
        parentPlanId: Joi.number().integer().allow(null,"null"),
        ////-------------------- blob checked ----------------
        icon: Joi.allow(null,"null"),
        fDate: Joi.date().required().timestamp(),
        tDate: Joi.date().required().timestamp().greater(Joi.ref('fDate')),
        neededLogin: Joi.boolean().required(),
        isFinal: Joi.boolean().required()
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};
const validateUpdatePlan = async (body, planId, language) => {
    body.planId = planId;
    var schema = Joi.object().keys({
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`,
            'number.empty': `شناسه طرح اجباری است`,
            'any.required': `شناسه طرح اجباری است`
        }),
        planName: Joi.allow(),
        description: Joi.string().allow(null,"")
        .custom((value, helper)=>{
            if(preventSqlInjectionV2(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در توضیحات استفاده نکنید");}
        }).messages({
            'string.base': `نوع توضیحات طرح صحیح نمی‌باشد`,
            'string.empty': `توضیحات طرح اجباری است`
        }),
        planNature: Joi.boolean().required().messages({
            'boolean.base': `نوع ماهیت طرح صحیح نمی‌باشد`,
            'any.required': `ماهیت طرح اجباری است`
        }),
        parentPlanId: Joi.number().integer().messages({
            'number.base': `نوع طرح پدر صحیح نمی‌باشد`
        }).allow(null,"null"),
        icon: Joi.string().max(15).messages({
            'string.base': `نوع آیکون صحیح نمی‌باشد`
        }),
        fDate: Joi.date().required().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
        }),
        tDate: Joi.date().required().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`,
        }),
        neededLogin: Joi.boolean().required().messages({
            'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
            'any.required': `ورودی اجباری است`
        }),
        //isFinal: Joi.boolean().allow(),
    });
    const schemaEn = Joi.object().keys({
        planId: Joi.number().integer().required(),
        planName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        description: Joi.string().allow(null,"")
        .custom((value, helper)=>{
            if(preventSqlInjectionV2(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        planNature: Joi.boolean().required(),
        parentPlanId: Joi.number().integer().allow(null,"null"),
        icon: Joi.string().max(15),
        fDate: Joi.date().required().timestamp(),
        tDate: Joi.date().required().timestamp().greater(Joi.ref('fDate')),
        neededLogin: Joi.boolean().required(),
        //isFinal: Joi.boolean().allow(null,"null"),

    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body, );
};
const validateLoadPlan = async (body, language) => {
    var schema = Joi.object().keys({
        planId: Joi.number().integer().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`
        }).allow(null,""),
        planName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام طرح استفاده نکنید");}
        }).messages({
            'string.base': `نوع نام طرح صحیح نمی‌باشد`
        }).allow(null,""),
        planNature: Joi.boolean().messages({
            'boolean.base': `نوع ماهیت طرح صحیح نمی‌باشد`
        }).allow(null,""),
        parentPlanId: Joi.allow(null,"").messages({
            'number.base': `نوع طرح پدر صحیح نمی‌باشد`
        }).allow(null,""),
        fDate: Joi.date().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
        }).allow(null,""),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'data.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`
        }).allow(null,""),
        neededLogin: Joi.boolean().messages({
            'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
        }).allow(null,"")
    });
    var schemaEn = Joi.object().keys({
        planId: Joi.number().integer().allow(null,""),
        planName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed")}
        }).allow(null,""),
        planNature: Joi.boolean().allow(null,""),
        parentPlanId: Joi.allow(null,"").allow(null,""),
        fDate: Joi.date().timestamp().allow(null,""),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).allow(null,""),
        neededLogin: Joi.boolean().allow(null,"")
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateLoadPlanPaginate = async (body, language) => {
    var schema = Joi.object().keys({
        page: Joi.number().integer().required().messages({
            'number.base': `ورودی صفحه صحیح نمی‌باشد`,
            'any.required': `ورودی صفحه اجباری است`
        }).allow(null,""),
        planId: Joi.number().integer().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`
        }).allow(null,""),
        planName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام طرح استفاده نکنید");}
        }).messages({
            'string.base': `نوع نام طرح صحیح نمی‌باشد`
        }).allow(null,""),
        planNature: Joi.boolean().messages({
            'boolean.base': `نوع ماهیت طرح صحیح نمی‌باشد`
        }).allow(null,""),
        parentPlanId: Joi.number().integer().messages({
            'number.base': `نوع طرح پدر صحیح نمی‌باشد`
        }).allow(null,""),
        fDate: Joi.date().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
        }).allow(null,""),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'data.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`
        }).allow(null,""),
        neededLogin: Joi.boolean().allow(null,"")
    });
    var schemaEn = Joi.object().keys({
        page: Joi.number().integer().required().allow(null,""),
        planId: Joi.number().integer().allow(null,""),
        planName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("Invalid characters are not allowed");}
        }).allow(null,""),
        planNature: Joi.boolean().allow(null,""),
        parentPlanId: Joi.number().integer().allow(null,""),
        fDate: Joi.date().timestamp().allow(null,""),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).allow(null,""),
        neededLogin: Joi.boolean().allow(null,"")
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateDeletePlan = async (body, language) => {
    var schema = Joi.object().keys({
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`,
            'number.empty': `شناسه طرح اجباری است`,
            'any.required': `شناسه طرح اجباری است`
        })
    });
    var schemaEn = Joi.object().keys({
        planId: Joi.number().integer().required()
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};
 
module.exports = {
    validateCreatePlan,
    validateUpdatePlan,
    validateLoadPlan,
    validateLoadPlanPaginate,
    validateDeletePlan
}