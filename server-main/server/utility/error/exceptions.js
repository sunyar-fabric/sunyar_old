const GlobalExceptions = {
    ServiceError: {
        code: 1, message: 'خطایی سمت سرور رخ داده‌است', httpStatusCode: 500,

    },
    dependecyError: {
        code: 42, message: 'به ‌دلیل وابستگی امکان حذف وجود ندارد', httpStatusCode: 500

    },
    //-- dbExceptions---
    db: {
        InputsNotUnique: {
            code: 2, message: 'مقادیر ورودی یکتا نیستند', httpStatusCode: 409
        },
        InputNotValide: {
            code: 3, message: 'تایپ مقادیر ورودی صحیح نمی باشد', httpStatusCode: 409
        },
        PrimaryKeyNotFound: {
            code: 4, message: 'شناسه خارجی موجود نمی باشد', httpStatusCode: 404
        },
        DataBaseError: {
            code: 5, message: 'خطای دیتابیس', httpStatusCode: 409
        }
    },
    //-- authExceptions---
    auth: {
        TokenExpired: {
            code: 6, message: 'مجددا وارد شوید', httpStatusCode: 401, httpStatusMessage: 'Unauthorized'
        },
        WrongAccessToken: {
            code: 7, message: 'اطلاعات وارد شده اشتباه است', httpStatusCode: 401, httpStatusMessage: 'Unauthorized'
        },
        AccessTokenError: {
            code: 8, message: 'خطای احراز', httpStatusCode: 401, httpStatusMessage: 'Unauthorized'
        },
        waiting:{
            code: 8, message: 'کاربر گرامی بعد از چند دقیقه دیگر برای لاگین اقدام کنید', httpStatusCode: 404, httpStatusMessage: 'Unauthorized'
        }
    },
    //-- accessPermissionExceptions---
    accessPermission: {
        FormNotFound: {
            code: 9, message: 'فرمی با این مشخصات یافت نشد', httpStatusCode: 404
        },
        FormUseAsSysParent: {
            code: 10, message: 'به‌دلیل وابستگی به عنوان فرم پدر، امکان حذف وجود ندارد', httpStatusCode: 404
        },
        FormUseAsFK: {
            code: 11, message: 'به‌دلیل وابستگی فرم در مجوز دسترسی، امکان حذف وجود ندارد', httpStatusCode: 404
        },
        PermissionNotFound: {
            code: 12, message: 'مجوز دسترسی‌ای با این مشخصات یافت نشد', httpStatusCode: 404
        }
    },
    //-- jwtExceptions---
    jwt: {
        NotAuthorized: {
            code: 13, message: 'دسترسی موجود نمی‌باشد', httpStatusCode: 401
        },
        WrongCredential: {
            code: 14, message: 'رمز وارد شده صحیح نمی باشد', httpStatusCode: 401
        },
        invalidAuthorizationHeader: {
            code: 5, message: 'Invalid Authorization Header', httpStatusCode: 400
        },
        Forbidden:{ 
            code: 5, message: 'دسترسی مجاز نمی باشد', httpStatusCode: 403

        },
        YouAID:{ 
            code: 5, message: 'شما مددکار هستید و نیتوانید به جز نیازمند شخصی اضافه کنید ', httpStatusCode: 403

        }

    },
    //-- roleExceptions---
    role: {
        RoleNotFound: {
            code: 15, message: 'نقشی با این مشخصات یافت نشد', httpStatusCode: 404
        },
        RoleUseAsFK: {
            code: 16, message: 'به دلیل وابستگی نقش، امکان حذف وجود ندارد', httpStatusCode: 409
        },
        AssignRoleToUserNotFound: {
            code: 17, message: 'نقش تخصیص داده‌شده‌ای به این کاربر یافت نشد', httpStatusCode: 404
        }
    },
    //-- userExceptions---
    user: {
        PersonNotFound: {
            code: 18, message: 'شخصی با این مشخصات یافت نشد', httpStatusCode: 404
        },
        UserNotFound: {
            code: 19, message: 'نام کاربري یا کلمه عبور وارد شده نادرست است', httpStatusCode: 404
        },
        UserUseAsFK: {
            code: 20, message: 'به‌دلیل وابستگی کاربر، امکان حذف وجود ندارد', httpStatusCode: 409
        },
        WrongCredential: {
            code: 21, message: 'نام کاربري یا کلمه عبور وارد شده نادرست است', httpStatusCode: 404
        },
        UserExpired: {
            code: 22, message: 'کاربر گرامی، اکانت شما غیرفعال شده‌است، با ادمین تماس بگیرید', httpStatusCode: 404
        },
        UserAlreadyExists: {
            code: 23, message: 'نام کاربری قبلا در سیستم ثبت شده است', httpStatusCode: 404
        },
        profilesNotFound:{
            code: 23, message: 'پروفایل پیدا نشد!', httpStatusCode: 404
        }
    },
    //-- baseInfoExceptions---
    baseInfo: {
        commonBaseTypeIdNotFound: {
            code: 23, message: 'شناسه ای با این مشخصات یافت نشد', httpStatusCode: 404
        },
        commonBaseTypeIdUseAsFK: {
            code: 24, message: 'به ‌دلیل وابستگی  امکان حذف وجود ندارد', httpStatusCode: 409
        },
        baseTypeTitleUnique: {
            code: 32, message: 'عنوان تکراری است', httpStatusCode: 409
        },
        baseTypeCodeUnique: {
            code: 33, message: 'کد تولید شده تکراری میباشد', httpStatusCode: 409
        }, 
        baseDataUnique : {
            code: 34, message: 'مقادیر ثابت یکتا نیستند', httpStatusCode: 409
        },
        commonBaseDataIdNotFound: {
            code: 35, message: 'شناسه ای با این مشخصات یافت نشد', httpStatusCode: 404
        },
        charityAccountCardNumber: {
            code: 31, message: 'شماره کارت تکراری میباشد', httpStatusCode: 409
        },
        charityAccountAccountNumber : {
            code: 36, message: 'شماره حساب تکراری است', httpStatusCode: 409
        },
        commonBaseDataIdUseAsFK : {
            code: 40, message: 'به ‌دلیل وابستگی امکان حذف وجود ندارد', httpStatusCode: 409
        },
        charityAccountIdUseAsFK : {
            code: 41, message: 'به ‌دلیل وابستگی امکان حذف وجود ندارد', httpStatusCode: 409
        }
        
    },

    //-- operationExceptions---
    operation: {
        overPayment: {
            code: 25, message: 'مقدار پرداختی از مقدار مورد نیاز بیشتر است', httpStatusCode: 400
        },
        wrongPayment: {
            code: 28, message: 'کمکی جهت تسویه وجود ندارد!', httpStatusCode: 400
        },
        wrongLoadDonator : {
            code: 29, message: 'نیازمند یا اهدا کننده مشخص نیست', httpStatusCode: 404
        },
        wrongLoadCharity : {
            code: 30, message: 'نیازمند  مشخص نیست', httpStatusCode: 404
        },
    },
    //-- planExceptions---
    beneficiary: {
        donatorError: {
            code: 36, message: 'خیری با این کد ملی ثبت شده است', httpStatusCode: 404
        },
        needyError: {
            code: 37, message: 'نیازمندی با این کد ملی ثبت شده است', httpStatusCode: 409
        },
        personalError: {
            code: 38, message: 'پرسنلی با این کدملی ثبت شده است', httpStatusCode: 409
        },
        personNotFound : {
            code: 39, message: 'چنین شخصی یافت نشد', httpStatusCode: 409
        },
        shebaNumberUnique : {
            code: 40, message: 'شماره شبا نیازمند تکراری میباشد', httpStatusCode: 409
        },
        fieldsUniques : {
            code: 41, message: ' شماره حساب  تخصیص یافته به نیازمند تکراری است ', httpStatusCode: 409
        },
        compareAccountNumber : {
            code: 42, message: ' شماره حساب وارد شده به شماره شبا ارتباطی ندارد ', httpStatusCode: 409
        }

    },
    //-- planExceptions---
    plan: {
        PlanNotFound: {
            code: 26, message: 'طرحی با این مشخصات یافت نشد', httpStatusCode: 404
        },
        PlanUseAsFK: {
            code: 27, message: 'به‌دلیل وابستگی طرح، امکان حذف وجود ندارد', httpStatusCode: 409
        },
        PlanFDateTDate: {
            code: 42, message: 'تاریخ اختصاص نیازمند به طرح باید در بازه تاریخ طرح باشد', httpStatusCode: 409
        },
        notFound: {
            code: 43, message: 'چنین رکوردی برای حذف موجود نیست', httpStatusCode: 409
        },
        overMinPrice: {
            code: 44, message: 'حداقل مبلغ از مبلغ مورد نیاز بیشتر است', httpStatusCode: 409
        },
        succorUnique : {
            code: 45, message: 'جزئیات پرداخت طرحی با چنین نیازمندی قبلا تعریف شده است ', httpStatusCode: 409
        }, 
    },
    sqlInjection:{
        code: 46, message: 'از کاراکتر های غیر مجاز استفاده نکنید! ', httpStatusCode: 401
        
    },
    forgetMyPass:{
        NotAuthorized:{code: 47, message: 'دسترسی مجاز ندارید ', httpStatusCode: 401}
    },
    bigBigFile:{
        code: 48, message: 'فایل ارسالی بزرگ است ', httpStatusCode: 401},   
    assignRole:{
        iamDonator:{
        code: 49, message: 'امکان اضافه کردن نقش به خیر وجود ندارد!', httpStatusCode: 401},   
        },
    parentTime:{
        code: 50, message: 'زمان تخصیص طرح باید بین بازه زمانی طرح پدر باشد!', httpStatusCode: 401},      
}     


module.exports = { GlobalExceptions }