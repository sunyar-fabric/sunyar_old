const Joi = require('joi');
const  english_digit  = require('../../../../utility/fnChangeFarsiNumber');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;
const  preventSqlInjectionV2  = require('../../../../utility/fnPreventSqlInjection').customInjection;


const validateLoadNeedyAccounts = async (body, language) => {
    var schema = Joi.object().keys({
        needyAccountId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه حساب نیازمند صحیح نمیاشد`,
        }).allow("null",null),
        bankId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه حساب بانک صحیح نمیاشد`,
        }).allow("null",null),
        needyId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه نیازمند صحیح نمیاشد`,
        }).allow("null",null),
        ownerName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی  صصاحب حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای صاحب حساب از مقدار مجاز بیشتر است',
        }),
        cardNumber: Joi.string()
            .custom((value, helper) => {
                value = english_digit(value)
                let L = value.length;
                if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                let c = parseInt(value.substr(15, 1), 10);
                let s = 0;
                let k, d;
                for (var i = 0; i < 16; i++) {
                    k = (i % 2 == 0) ? 2 : 1;
                    d = parseInt(value.substr(i, 1), 10) * k;
                    s += (d > 9) ? d - 9 : d;
                }
                if ((s % 10) == 0) return true;
                return helper.message("شماره کارت بانکی نادرست است");
            }),
        accountNumber: Joi.string().min(1).max(10)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',
        }),
        shebaNumber: Joi.string()
            .custom((value, helper) => {
                value = english_digit(value)
                let pattern = /IR[0-9]{24}/;
                if (value.length !== 26) {
                    return helper.message("شماره شبا نادرست است");
                }
                if (!pattern.test(value)) {
                    return helper.message("شماره شبا نادرست است");
                }
                let newStr = value.substr(4);
                let d1 = value.charCodeAt(0) - 65 + 10;
                let d2 = value.charCodeAt(1) - 65 + 10;
                newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                var remainder = newStr,
                    block;
                while (remainder.length > 2) {
                    block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                remainder = parseInt(remainder, 10) % 97;
                if (remainder !== 1) {
                    return helper.message("شماره شبا نادرست است");
                }
                return true;
            }).allow(null,"")
    });
    var schemaEn = Joi.object().keys({
        needyAccountId: Joi.number().integer().allow("null",null),
        bankId: Joi.number().integer().allow("null",null),
        needyId: Joi.number().integer().allow("null",null),
        ownerName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        cardNumber: Joi.string()
            .custom((value, helper) => {
                value = english_digit(value)
                let L = value.length;
                if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                let c = parseInt(value.substr(15, 1), 10);
                let s = 0;
                let k, d;
                for (var i = 0; i < 16; i++) {
                    k = (i % 2 == 0) ? 2 : 1;
                    d = parseInt(value.substr(i, 1), 10) * k;
                    s += (d > 9) ? d - 9 : d;
                }
                if ((s % 10) == 0) return true;
                return helper.message("Invalid card number");
            }),
        accountNumber: Joi.string().min(1).max(10)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        shebaNumber: Joi.string()
            .custom((value, helper) => {
                value = english_digit(value)
                let pattern = /IR[0-9]{24}/;
                if (value.length !== 26) {
                    return helper.message("Invalid SHEBA number");
                }
                if (!pattern.test(value)) {
                    return helper.message("Invalid SHEBA number");
                }
                let newStr = value.substr(4);
                let d1 = value.charCodeAt(0) - 65 + 10;
                let d2 = value.charCodeAt(1) - 65 + 10;
                newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                var remainder = newStr,
                    block;
                while (remainder.length > 2) {
                    block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                remainder = parseInt(remainder, 10) % 97;
                if (remainder !== 1) {
                    return helper.message("Invalid SHEBA number");
                }
                return true;
            }).allow(null,"")
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateCreateNeedyAccounts = async (body, language) => {

    var schema = Joi.object().keys({
        bankId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه حساب بانک صحیح نمیاشد`,
            'number.empty': `  شناسه حساب بانک اجباری است`,
            'any.required': `  شناسه حساب بانک اجباری است`
        }),
        needyId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه نیازمند صحیح نمیاشد`,
            'number.empty': `شناسه نیازمند اجباری است`,
            'any.required': `شناسه نیازمند اجباری است`
        }),

        ownerName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی  صصاحب حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای صاحب حساب از مقدار مجاز بیشتر است',
            'string.empty': ` صاحب حساب اجباری است`,
            'any.required': ` صاحب حساب اجباری است`
        }),
        cardNumber: Joi.string()
            .custom((value, helper) => {
                if (value) {
                    value = english_digit(value)
                    let L = value.length;
                    if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                    let c = parseInt(value.substr(15, 1), 10);
                    let s = 0;
                    let k, d;
                    for (var i = 0; i < 16; i++) {
                        k = (i % 2 == 0) ? 2 : 1;
                        d = parseInt(value.substr(i, 1), 10) * k;
                        s += (d > 9) ? d - 9 : d;
                    }
                    if ((s % 10) == 0) return true;
                    return helper.message("شماره کارت بانکی نادرست است");
                } else return true
            }).allow(""),
        accountNumber: Joi.string().required().min(1).max(10)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',
            'string.empty': `شماره حساب  اجباری است`,
            'any.required': `شماره حساب  اجباری است`
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',
            'string.empty': `نام حساب اجباری است`,
            'any.required': `نام حساب اجباری است`
        }),
        shebaNumber: Joi.string().required()
            .custom((value, helper) => {
                value = english_digit(value)
                let pattern = /IR[0-9]{24}/;
                if (value.length !== 26) {
                    return helper.message("شماره شبا نادرست است");
                }
                if (!pattern.test(value)) {
                    return helper.message("شماره شبا نادرست است");
                }
                let newStr = value.substr(4);
                let d1 = value.charCodeAt(0) - 65 + 10;
                let d2 = value.charCodeAt(1) - 65 + 10;
                newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                var remainder = newStr,
                    block;
                while (remainder.length > 2) {
                    block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                remainder = parseInt(remainder, 10) % 97;
                if (remainder !== 1) {
                    return helper.message("شماره شبا نادرست است");
                }
                return true;
            }).messages({
                'string.base': `نوع ورودی شماره شبا صحیح نمیاشد`,
                'string.max': 'تعداد کارکترهای شماره شبا از مقدار مجاز بیشتر است',
                'string.empty': `شماره شبا اجباری است`,
                'any.required': `شماره شبا اجباری است`
            }),
    });
    var schemaEn = Joi.object().keys({
        bankId: Joi.number().required().integer(),
        needyId: Joi.number().required().integer(),
        ownerName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid SHEBA number");}
        }),
        cardNumber: Joi.string()
            .custom((value, helper) => {
                if (value) {
                    value = english_digit(value)
                    let L = value.length;
                    if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                    let c = parseInt(value.substr(15, 1), 10);
                    let s = 0;
                    let k, d;
                    for (var i = 0; i < 16; i++) {
                        k = (i % 2 == 0) ? 2 : 1;
                        d = parseInt(value.substr(i, 1), 10) * k;
                        s += (d > 9) ? d - 9 : d;
                    }
                    if ((s % 10) == 0) return true;
                    return helper.message("Invalid card number");
                } else return true
            }).allow(""),
        accountNumber: Joi.string().required().min(1).max(10)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid SHEBA number");}
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid SHEBA number");}
        }),
        shebaNumber: Joi.string().required()
            .custom((value, helper) => {
                value = english_digit(value)
                let pattern = /IR[0-9]{24}/;
                if (value.length !== 26) {
                    return helper.message("Invalid SHEBA number");
                }
                if (!pattern.test(value)) {
                    return helper.message("Invalid SHEBA number");
                }
                let newStr = value.substr(4);
                let d1 = value.charCodeAt(0) - 65 + 10;
                let d2 = value.charCodeAt(1) - 65 + 10;
                newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                var remainder = newStr,
                    block;
                while (remainder.length > 2) {
                    block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                remainder = parseInt(remainder, 10) % 97;
                if (remainder !== 1) {
                    return helper.message("Invalid SHEBA number");
                }
                return true;
            }),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateUpdateNeedyAccounts = async (body, language) => {

    var schema = Joi.object().keys({
        needyAccountId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه حساب نیازمند صحیح نمیاشد`,
            'number.empty': ` شناسه حساب نیازمند اجباری است `,
            'any.required': `  شناسه حساب نیازمند اجباری است`
        }),
        bankId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه حساب بانک صحیح نمیاشد`,
            'number.empty': `  شناسه حساب بانک اجباری است`,
            'any.required': `  شناسه حساب بانک اجباری است`
        }),
        needyId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه نیازمند صحیح نمیاشد`,
            'number.empty': `شناسه نیازمند اجباری است`,
            'any.required': `شناسه نیازمند اجباری است`
        }),

        ownerName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی  صصاحب حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای صاحب حساب از مقدار مجاز بیشتر است',
            'string.empty': ` صاحب حساب اجباری است`,
            'any.required': ` صاحب حساب اجباری است`
        }),
        cardNumber: Joi.string()
            .custom((value, helper) => {
                if (value) {
                    value = english_digit(value)
                    let L = value.length;
                    if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                    let c = parseInt(value.substr(15, 1), 10);
                    let s = 0;
                    let k, d;
                    for (var i = 0; i < 16; i++) {
                        k = (i % 2 == 0) ? 2 : 1;
                        d = parseInt(value.substr(i, 1), 10) * k;
                        s += (d > 9) ? d - 9 : d;
                    }
                    if ((s % 10) == 0) return true;
                    return helper.message("شماره کارت بانکی نادرست است");
                } else return true
            }).allow(""),
        accountNumber: Joi.string().required().min(1).max(10).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',
            'string.empty': `شماره حساب  اجباری است`,
            'any.required': `شماره حساب  اجباری است`
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کارکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',
            'string.empty': `نام حساب اجباری است`,
            'any.required': `نام حساب اجباری است`
        }),
        shebaNumber: Joi.string().required()
            .custom((value, helper) => {
                value = english_digit(value)
                let pattern = /IR[0-9]{24}/;
                if (value.length !== 26) {
                    return helper.message("شماره شبا نادرست است");
                }
                if (!pattern.test(value)) {
                    return helper.message("شماره شبا نادرست است");
                }
                let newStr = value.substr(4);
                let d1 = value.charCodeAt(0) - 65 + 10;
                let d2 = value.charCodeAt(1) - 65 + 10;
                newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                var remainder = newStr,
                    block;
                while (remainder.length > 2) {
                    block = remainder.slice(0, 9);
                    remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                }
                remainder = parseInt(remainder, 10) % 97;
                if (remainder !== 1) {
                    return helper.message("شماره شبا نادرست است");
                }
                return true;
            }).messages({
                'string.base': `نوع ورودی شماره شبا صحیح نمیاشد`,
                'string.max': 'تعداد کارکترهای شماره شبا از مقدار مجاز بیشتر است',
                'string.empty': `شماره شبا اجباری است`,
                'any.required': `شماره شبا اجباری است`
            }),
        })
    var schemaEn = Joi.object().keys({
            needyAccountId: Joi.number().required().integer(),
            bankId: Joi.number().required().integer(),
            needyId: Joi.number().required().integer(),
    
            ownerName: Joi.string().required().min(1).max(1000).trim()
            .custom((value, helper)=>{
                if(preventSqlInjection(value)){
                     return true
                }else {return helper.message("Invalid characters are not aloowed");}
            }),
            cardNumber: Joi.string()
                .custom((value, helper) => {
                    if (value) {
                        value = english_digit(value)
                        let L = value.length;
                        if (value.length !== 16 || parseInt(value.substr(1, 10), 10) == 0 || parseInt(value.substr(10, 6), 10) == 0) return helper.message("شماره کارت بانکی نادرست است");
                        let c = parseInt(value.substr(15, 1), 10);
                        let s = 0;
                        let k, d;
                        for (var i = 0; i < 16; i++) {
                            k = (i % 2 == 0) ? 2 : 1;
                            d = parseInt(value.substr(i, 1), 10) * k;
                            s += (d > 9) ? d - 9 : d;
                        }
                        if ((s % 10) == 0) return true;
                        return helper.message("Invalid card number");
                    } else return true
                }).allow(""),
            accountNumber: Joi.string().required().min(1).max(10).trim()
            .custom((value, helper)=>{
                if(preventSqlInjection(value)){
                     return true
                }else {return helper.message("Invalid characters are not aloowed");}
            }),
            accountName: Joi.string().min(1).max(500)
            .custom((value, helper)=>{
                if(preventSqlInjection(value)){
                     return true
                }else {return helper.message("Invalid characters are not aloowed");}
            }),
            shebaNumber: Joi.string().required()
                .custom((value, helper) => {
                    value = english_digit(value)
                    let pattern = /IR[0-9]{24}/;
                    if (value.length !== 26) {
                        return helper.message("Invalid SHEBA number");
                    }
                    if (!pattern.test(value)) {
                        return helper.message("Invalid SHEBA number");
                    }
                    let newStr = value.substr(4);
                    let d1 = value.charCodeAt(0) - 65 + 10;
                    let d2 = value.charCodeAt(1) - 65 + 10;
                    newStr += d1.toString() + d2.toString() + value.substr(2, 2);
                    var remainder = newStr,
                        block;
                    while (remainder.length > 2) {
                        block = remainder.slice(0, 9);
                        remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
                    }
                    remainder = parseInt(remainder, 10) % 97;
                    if (remainder !== 1) {
                        return helper.message("Invalid SHEBA number");
                    }
                    return true;
                }),
            })
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateDeleteNeedyAccounts = async (body, language) => {

    const schema = Joi.object().keys({
        needyAccountId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه حساب نیازمند صحیح نمیاشد`,
            'number.empty': ` شناسه حساب نیازمند اجباری است `,
            'any.required': `  شناسه حساب نیازمند اجباری است`
        }),
    });
    const schemaEn = Joi.object().keys({
        needyAccountId: Joi.number().integer().required(),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
}
module.exports = {
    validateLoadNeedyAccounts,
    validateCreateNeedyAccounts,
    validateUpdateNeedyAccounts,
    validateDeleteNeedyAccounts

}