const moment = require('jalali-moment')

function persianToTimestamp(year, month, day){
    let m = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
    return new Date(m._d).getTime()
}

function timestampToPersian(timestamp){
    let date = new Date(timestamp)
    return moment(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');;

}

module.exports ={
    persianToTimestamp,
    timestampToPersian 
}