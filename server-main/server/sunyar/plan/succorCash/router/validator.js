const Joi = require('joi');

const validateCreateSuccorCash = async (body) => {
    const schema = Joi.object().keys({
        assignNeedyPlanId: Joi.number().integer().messages({
            'number.base': `نوع ورودی اختصاص شناسه به طرح صحیح نمیاشد`,
            'number.empty': ` اختصاص نیازمند به طرح اجباری است`,
            'any.required': `اختصاص نیازمند به طرح اجباری است`
        }).allow(null,""),
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه طرح صحیح نمیاشد`,
            'number.empty': `انتخاب طرح اجباری است`,
            'any.required': `انتخاب طرح اجباری است`
        }),
        neededPrice: Joi.number().required().messages({
            'number.base': `نوع ورودی مبلغ مورد نیاز صحیح نمیاشد`,
            'number.empty': ` مبلغ مورد نیاز اجباری است`,
            'any.required': `مبلغ مورد نیازاجباری است`
        }),
        minPrice: Joi.number().required().messages({
            'number.base': `نوع ورودی حداقل مبلغ مورد نیاز صحیح نمیاشد`,
            'number.empty': ` حداقل مبلغ اجباری است`,
            'any.required': `حداقل مبلغ اجباری است`
        }),
        description: Joi.string().allow(null,'').messages({
            'string.base': `نوع ورودی توضیحات صحیح نمیاشد`,
            'string.empty': ` توضیحات اجباری است`,

        })

    });
    return schema.validate(body);
};
const validateUpdateSuccorCash = async (body) => {
    const schema = Joi.object().keys({
        cashAssistanceDetailId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه جزییات کمک نقدی صحیح نمیاشد`,
            'number.empty': ` انتخاب جزییات پرداخت نقدی اجباری است  `,
            'any.required': ` انتخاب جزییات پرداخت نقدی اجباری است`
        }),
        assignNeedyPlanId: Joi.number().integer().messages({
            'number.base': `نوع ورودی اختصاص شناسه به طرح صحیح نمیاشد`,
            'number.empty': ` اختصاص نیازمند به طرح اجباری است`,
            'any.required': `اختصاص نیازمند به طرح اجباری است`
        }).allow(null,""),
        planId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه طرح صحیح نمیاشد`,
            'number.empty': `انتخاب طرح اجباری است`,
            'any.required': `انتخاب طرح اجباری است`
        }),
        neededPrice: Joi.number().required().messages({
            'number.base': `نوع ورودی مبلغ مورد نیاز صحیح نمیاشد`,
            'number.empty': ` مبلغ مورد نیاز اجباری است`,
            'any.required': `مبلغ مورد نیازاجباری است`
        }),
        minPrice: Joi.number().required().messages({
            'number.base': `نوع ورودی حداقل مبلغ مورد نیاز صحیح نمیاشد`,
            'number.empty': ` حداقل مبلغ اجباری است`,
            'any.required': `حداقل مبلغ اجباری است`
        }),
        description: Joi.string().allow(null,'').messages({
            'string.base': `نوع ورودی توضیحات صحیح نمیاشد`,
        })
    });
    return schema.validate(body);
};
const validateLoadSuccorCash = async (body) => {
    const schema = Joi.object().keys({
        cashAssistanceDetailId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه جزییات کمک نقدی صحیح نمیاشد`,
        }).allow("null",null),
        assignNeedyPlanId: Joi.number().integer().messages({
            'number.base': `نوع ورودی اختصاص شناسه به طرح صحیح نمیاشد`,
        }).allow("null",null),
        planId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه طرح صحیح نمیاشد`,
        }).allow("null",null),
        neededPrice: Joi.number().messages({
            'number.base': `نوع ورودی مبلغ مورد نیاز صحیح نمیاشد`,
        }).allow("null",null),
        minPrice: Joi.number().messages({
            'number.base': `نوع ورودی حداقل مبلغ مورد نیاز صحیح نمیاشد`,
        }).allow("null",null),
        description: Joi.string().messages({
            'string.base': `نوع ورودی توضیحات صحیح نمیاشد`,
        }).allow("null",null)
    });
    return schema.validate(body);
};

const validateDeleteSuccorCash = async (body) => {
    const schema = Joi.object().keys({
        cashAssistanceDetailId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه جزییات کمک نقدی صحیح نمیاشد`,
            'number.empty': ` انتخاب جزییات پرداخت نقدی اجباری است  `,
            'any.required': ` انتخاب جزییات پرداخت نقدی اجباری است`
        })
    });
    return schema.validate(body);
};

module.exports = {
     validateLoadSuccorCash
    , validateCreateSuccorCash
    , validateDeleteSuccorCash
    , validateUpdateSuccorCash
};