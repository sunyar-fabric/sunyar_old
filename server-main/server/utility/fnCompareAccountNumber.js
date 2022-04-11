const fnCompare = (sheba , account) => {
    let shebaNumber = sheba.replace(/\s+/g, '')
    let accountNumber = account.replace(/\s+/g, '')
   
    if(shebaNumber.slice(16,26) != accountNumber ){
        return false
    }else{
        return true
    }

}
module.exports = fnCompare