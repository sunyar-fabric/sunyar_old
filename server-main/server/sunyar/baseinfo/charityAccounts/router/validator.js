const Joi = require('joi');
const  english_digit  = require('../../../../utility/fnChangeFarsiNumber');
const  preventSqlInjection  = require('../../../../utility/fnPreventSqlInjection').custom;


const validateLoadCharityAccounts = async (body, language) => { 

    var schema = Joi.object().keys({
        charityAccountId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه حساب خیریه صحیح نمیاشد`,
            'number.empty': `شناسه حساب خیریه اجباری است`,
            'any.required': `شناسه حساب خیریه اجباری است`
        }).allow("null",null),
        bankId: Joi.number().integer().messages({
            'number.base': `نوع ورودی شناسه مقادیر ثابت صحیح نمیاشد`,
        }).allow("null",null),
        branchName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام شعبه صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای شعبه از مقدار مجاز بیشتر است',

        }),
        ownerName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام صاحب حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام صاحب حساب از مقدار مجاز بیشتر است',
        }),
        cardNumber: Joi.string()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).custom((value, helper) => {
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
            }).allow(null,"null"),
        validateIranianSheba: Joi.string()
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
            }).allow(null,"null"),
        accountNumber: Joi.string().min(1).max(10)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',

        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',

        }).allow(null,""),
    });
    var schemaEn = Joi.object().keys({
        charityAccountId: Joi.number().integer().allow("null",null),
        bankId: Joi.number().integer().allow("null",null),
        branchName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        ownerName: Joi.string().min(1).max(1000)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }),
        cardNumber: Joi.string()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("Invalid characters are not allowed");}
        }).custom((value, helper) => {
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
            }).allow(null,"null"),
        validateIranianSheba: Joi.string()
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
            }).allow(null,"null"),
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
        }).allow(null,""),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateCreateCharityAccounts = async (body, language) => {
    var schema = Joi.object().keys({
        bankId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه بانک صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه بانک اجباری است`,
            'any.required': `ورودی  شناسه بانک اجباری است`
        }),
        branchName: Joi.string().required().min(1).max(500).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام شعبه صحیح نمیاشد`,
            'string.empty': `نام شعبه اجباری است`,
            'string.max': 'تعداد کارکترهای  نام شعبه از مقدار مجاز بیشتر است',
            'any.required': `نام شعبه اجباری است`
        }),

        ownerName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام صاحب حساب صحیح نمیاشد`,
            'string.empty': `نام صاحب حساب اجباری است`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
            'any.required': `نام صاحب حساب اجباری است`
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
            }).allow(null,""),
        validateIranianSheba: Joi.string().trim()
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
            }),
        accountNumber: Joi.string().required().min(1).max(10).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.empty': `شماره حساب اجباری است`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',
            'any.required': `شماره حساب اجباری است`
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام حساب استفاده نکنید");}
        }).allow(null,'').messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',
        }),
    });
    var schemaEn = Joi.object().keys({
        bankId: Joi.number().required().integer(),
        branchName: Joi.string().required().min(1).max(500).trim()
        ,
        ownerName: Joi.string().required().min(1).max(1000).trim()
        ,
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
            }).allow(null,""),
        validateIranianSheba: Joi.string().trim()
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
        accountNumber: Joi.string().required().min(1).max(10).trim()
        ,
        accountName: Joi.string().min(1).max(500).allow(null,''),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};

const validateUpdateCharityAccounts = async (body, language) => {

    var schema = Joi.object().keys({
        charityAccountId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه حساب بانک صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه حساب بانک اجباری است`,
            'any.required': `ورودی  شناسه حساب بانک اجباری است`
        }),
        bankId: Joi.number().required().integer().messages({
            'number.base': `نوع ورودی شناسه بانک صحیح نمیاشد`,
            'number.empty': `ورودی  شناسه بانک اجباری است`,
            'any.required': `ورودی  شناسه بانک اجباری است`
        }),
        branchName: Joi.string().required().min(1).max(500).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام شعبه استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام شعبه صحیح نمیاشد`,
            'string.empty': `نام شعبه اجباری است`,
            'string.max': 'تعداد کارکترهای  نام شعبه از مقدار مجاز بیشتر است',
            'any.required': `نام شعبه اجباری است`
        }),

        ownerName: Joi.string().required().min(1).max(1000).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در صاحب حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی نام صاحب حساب صحیح نمیاشد`,
            'string.empty': `نام صاحب حساب اجباری است`,
            'string.max': 'تعداد کارکترهای عنوان از مقدار مجاز بیشتر است',
            'any.required': `نام صاحب حساب اجباری است`
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
            }).allow(null,""),
        validateIranianSheba: Joi.string().trim()
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
            }),
        accountNumber: Joi.string().required().min(1).max(10).trim()
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در شماره حساب استفاده نکنید");}
        }).messages({
            'string.base': `نوع ورودی شماره حساب صحیح نمیاشد`,
            'string.empty': `شماره حساب اجباری است`,
            'string.max': 'تعداد کارکترهای شماره حساب از مقدار مجاز بیشتر است',
            'any.required': `شماره حساب اجباری است`
        }),
        accountName: Joi.string().min(1).max(500)
        .custom((value, helper)=>{
            if(preventSqlInjection(value)){
                 return true
            }else {return helper.message("از کاراکترهای غیر مجاز در نام حساب استفاده نکنید");}
        }).allow(null,'').messages({
            'string.base': `نوع ورودی نام حساب صحیح نمیاشد`,
            'string.max': 'تعداد کارکترهای نام حساب از مقدار مجاز بیشتر است',
        }),
    });
    var schemaEn = Joi.object().keys({
        charityAccountId: Joi.number().required().integer(),
        bankId: Joi.number().required().integer(),
        branchName: Joi.string().required().min(1).max(500).trim()
       ,
        ownerName: Joi.string().required().min(1).max(1000).trim()
    ,
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
            }).allow(null,""),
        validateIranianSheba: Joi.string().trim()
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
                    return helper.message("SHEBA");
                }
                return true;
            }),
        accountNumber: Joi.string().required().min(1).max(10).trim()
        ,
        accountName: Joi.string().min(1).max(500)
        .allow(null,''),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
};
const validateDeleteCharityAccounts = async (body, language) => {

    var schema = Joi.object().keys({
        charityAccountId: Joi.number().integer().required().messages({
            'number.base': `نوع ورودی شناسه شماره حساب صحیح نمیاشد`,
            'number.empty': `  شناسه شماره حساب اجباری است`,
            'any.required': ` شناسه شماره حساب اجباری است`
        }),
    });
    var schemaEn = Joi.object().keys({
        charityAccountId: Joi.number().integer().required(),
    });
    schema = language.en? schemaEn: schema; 
    return schema.validate(body);
}
module.exports = { 
    validateLoadCharityAccounts,
    validateCreateCharityAccounts,
    validateUpdateCharityAccounts,
    validateDeleteCharityAccounts
}