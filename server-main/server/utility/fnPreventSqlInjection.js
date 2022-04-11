const { createError } = require("./error/errorHandling");
const { GlobalExceptions } = require("./error/exceptions");


const custom = (value) => {
    if (value.includes('!')
    || value.includes('@')
    || value.includes('$')
    || value.includes('#')
    || value.includes('%')
    || value.includes('^')
    || value.includes('&')
    || value.includes('*')
    || value.includes('(')
    || value.includes(')') 
    || value.includes('"')
    || value.includes('{')
    || value.includes('}')
    || value.includes("'")
    || value.includes(';')) {
        //'#','$','%','^','&','*','(',')','"','{','}',"'"
        return false
    }else{
        return true;
    }    
}

const customInjection = (value) => {
    value = value.toString()
    if (value.includes('!')
    || value.includes('@')
    || value.includes('$')
    || value.includes('#')
    || value.includes('%')
    || value.includes('^')
    || value.includes('&')
    || value.includes('*')
    || value.includes('"')
    || value.includes('{')
    || value.includes('}')
    || value.includes("'")
    || value.includes(';')) {
        //'#','$','%','^','&','*','(',')','"','{','}',"'"
        return false
    }else{
        return true;
    }
    
}


const dontInjectMe = (req, res, next) => {
    try{
        let myBody = {...req.body, ...req.query};
        const keys = Object.keys(myBody);
        for (const key of keys){
            if(typeof myBody[key] === "string" && key != "password" && key != "personPhoto"){
                if (!customInjection(myBody[key])) throw createError(GlobalExceptions.sqlInjection)
            }
        }
        next();
    }
    catch(error){
        next(error);
    } 
}


module.exports = {
    custom,
    customInjection,
    dontInjectMe
} 