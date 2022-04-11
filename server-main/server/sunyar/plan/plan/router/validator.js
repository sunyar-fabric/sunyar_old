const Joi = require('joi');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;
const  preventSqlInjectionV2  = require('../../../../utility/fnPreventSqlInjection').customInjection;


const validateCreatePlan = async (body) => {
    const schema = Joi.object().keys({
        planName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام طرح استفاده نکنید");}
        }).messages({
            'string.base': `نوع نام طرح صحیح نمی‌باشد`,
            'string.empty': `نام طرح اجباری است`,
            'any.required': `نام طرح اجباری است`
        }),
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
    });
    return schema.validate(body);
};
const validateUpdatePlan = async (body, planId) => {
    body.planId = planId;
    const schema = Joi.object().keys({
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`,
            'number.empty': `شناسه طرح اجباری است`,
            'any.required': `شناسه طرح اجباری است`
        }),
        planName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام طرح استفاده نکنید");}
        }).messages({
            'string.base': `نوع نام طرح صحیح نمی‌باشد`,
            'string.empty': `نام طرح اجباری است`,
            'any.required': `نام طرح اجباری است`
        }),
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
    });
    return schema.validate(body);
};
const validateLoadPlan = async (body) => {
    const schema = Joi.object().keys({
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
    return schema.validate(body);
};

const validateLoadPlanPaginate = async (body) => {
    const schema = Joi.object().keys({
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
        neededLogin: Joi.boolean().messages({
            'boolean.base': `نوع ورودی صحیح نمی‌باشد`,
        }).allow(null,"")
    });
    return schema.validate(body);
};

const validateDeletePlan = async (body) => {
    const schema = Joi.object().keys({
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع شناسه طرح صحیح نمی‌باشد`,
            'number.empty': `شناسه طرح اجباری است`,
            'any.required': `شناسه طرح اجباری است`
        })
    });
    return schema.validate(body);
};

module.exports = {
    validateCreatePlan,
    validateUpdatePlan,
    validateLoadPlan,
    validateLoadPlanPaginate,
    validateDeletePlan
}