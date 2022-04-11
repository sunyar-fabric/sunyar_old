import moment from "jalali-moment";

export const persianToTimestamp = (year, month, day) => {
    let m = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
    return new Date(m._d).getTime()
}

export const timestampToPersian = (timestamp) => {
    let date = new Date(timestamp)
    return moment(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');;

}