const Joi = require('joi');

const validateCreateNeedyToPlan = async (body, language) => {
    var schema = Joi.object().keys({
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه طرح صحیح نمیاشد`,
            'number.empty':  `شناسه  طرح اجباری است`,
            'any.required': `شناسه  طرح اجباری است`
        }),
        needyId: Joi.array().items(Joi.number()).required().messages({
            'array.base': `نوع ورودی شناسه نیازمند صحیح نمیاشد`,
        }),
        fDate: Joi.date().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
        }),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')),
        // benHashes: Joi.array().messages({
        //     'array.base': `هش کد نیازمندان ضروری است`,
        //     'array.emtpty': `هش کد نیازمندان ضروری است`,
        // })
    });
    var schemaEn = Joi.object().keys({
        planId: Joi.number().integer().required(),
        needyId: Joi.array().items(Joi.number()).required(),
        fDate: Joi.date(),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')),
        benHashes: Joi.exist()
    });
    // console.log("THIS", language);
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateUpdateNeedyToPlan = async (body, language) => {
    var schema = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی صحیح نمیاشد`,
            'number.empty': `ورودی اختصاص نیازمند به طرح اجباری است`,
            'any.required': `ورودی اختصاص نیازمند به طرح اجباری است`
        }),
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی صحیح نمیاشد`,
            'number.empty': `ورودی  طرح اجباری است`,
            'any.required': `ورودی  طرح اجباری است`
        }),
        needyId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی نیازمند صحیح نمیاشد`,
            'number.empty': `ورودی  نیازمند اجباری است`,
            'any.required': `ورودی  نیازمند اجباری است`
        }),
        fDate: Joi.date().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
        }),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`
        }),
    });
    var schemaEn = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().required(),
        planId: Joi.number().integer().required(),
        needyId: Joi.number().integer().required(),
        fDate: Joi.date().timestamp(),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateLoadNeedyToPlan = async (body, language) => {
    var schema = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه اختصاص نیازمند به طرح صحیح نمیاشد`,
        }).allow(null,"null"),
        planId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه طرح صحیح نمیاشد`,
        }).allow(null,"null"),
        needyId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه نیازمند صحیح نمیاشد`,
        }).allow(null,"null"),
        fDate: Joi.date().timestamp().messages({
            'date.base': `زمان شروع طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`
        }).allow(null,"null"),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).messages({
            'date.base': `زمان پایان طرح واردشده صحیح نمی‌باشد`,
            'date.date': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.timestamp': `نوع ورودی باید تایم‌استمپ باشد`,
            'date.greater': `زمان پایان طرح باید بزرگتر از زمان شروع باشد`
        }).allow(null,"null"),
        planHashCode: Joi.allow(),
        planName: Joi.allow(),
        ownerOrgName: Joi.allow(),
        beneficiaryHashCode: Joi.allow(),
    });
    var schemaEn = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().allow(null,"null"),
        planId: Joi.number().integer().allow(null,"null"),
        needyId: Joi.number().integer().allow(null,"null"),
        fDate: Joi.date().timestamp().allow(null,"null"),
        tDate: Joi.date().timestamp().greater(Joi.ref('fDate')).allow(null,"null"),
        planHashCode: Joi.allow(),

    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateDeleteNeedyToPlan = async (body, language) => {
    var schema = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().required().messages({
            'number.base': `نوع شناسه اختصاص نیازمند به طرح صحیح نمی‌باشد`,
            'number.empty': `شناسه اختصاص نیازمند به طرح اجباری است`,
            'any.required': `شناسه اختصاص نیازمند به طرح اجباری است`
        })
    });
    var schemaEn = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().required()
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

module.exports = {
    validateCreateNeedyToPlan,
    validateUpdateNeedyToPlan,
    validateLoadNeedyToPlan,
    validateDeleteNeedyToPlan
}