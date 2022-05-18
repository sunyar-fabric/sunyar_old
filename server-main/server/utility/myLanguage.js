const myLanguage = (req, res, next) => {
    try{ 
        // console.log("FOOLAN", req.headers["accept-language"]);
        const language = req.headers["language"];
        req.language = {default:"per"};
        if(language == "en") req.language = {en:true};
        if(language == "per") req.language = {per:true};
        next();
    }
    catch(error){
        next(error);
    } 
}
module.exports = {myLanguage}