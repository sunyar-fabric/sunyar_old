import moment from "jalali-moment";

export const persianToTimestamp = (year, month, day) => {
    let m = moment(`${year}/${month}/${day}`, 'jYYYY/jMM/jDD');
    return new Date(m._d).getTime()
}

export const timestampToPersian = (timestamp) => {
    let date = new Date(timestamp)
    return moment(`${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`, 'YYYY/MM/DD').locale('fa').format('YYYY/MM/DD');;

}

export const convertDate = (mDate) => {
    let year = 0;
    let mYear = mDate.getFullYear();
    let differential = 0;
    if (mDate.getMonth() < 3 && mDate.getDay() < 20) {
        year = mYear - 622;
        differential = -1;
    } else {
        year = mYear - 621;
    }
    let firstDayOfYear = new Date(mYear + differential, 2, 20);
    let daysFromFirstYear = Math.ceil(
        (mDate - firstDayOfYear) / (1000 * 3600 * 24)
    );
    let month = 0;
    let day = 0;
    if (daysFromFirstYear <= 186) {
        month = Math.floor(daysFromFirstYear / 31);
        day = daysFromFirstYear - month * 31;
    } else {
        let y = daysFromFirstYear - 186;
        month = Math.floor(y / 30);
        day = y - month * 30;
    }
    let days = [];
    if (month <= 6) {
        for (let b = 1; b <= 31; b++) {
            days.push(b);
        }
    } else if (month >= 7 && month <= 11) {
        for (let b = 1; b <= 30; b++) {
            days.push(b);
        }
    } else {
        for (let b = 1; b <= 29; b++) {
            days.push(b);
        }
    }
    if (day === 0) {
        day = 31;
        month = month - 1;
    }
    if (daysFromFirstYear > 186 && month <= 5) {
        month = month + 6;
    }
    if (month == '12' && day == '31') {
        day = '30'
    }
    return (
        year +
        '/' +
        (month + 1 < 10 ? '0' + (month + 1) : month + 1) +
        '/' +
        (day < 10 ? '0' + day : day)
    );
};
export const getDateTimeString = (timestamp) => {
    let mDate = new Date(timestamp);
    let year = 0;
    let mYear = mDate.getFullYear();
    let differential = 0;
    if (mDate.getMonth() < 3 && mDate.getDay() < 20) {
        year = mYear - 622;
        differential = -1;
    } else {
        year = mYear - 621;
    }
    let firstDayOfYear = new Date(mYear + differential, 2, 20);
    let daysFromFirstYear = Math.ceil(
        (mDate - firstDayOfYear) / (1000 * 3600 * 24)
    );
    let month = 0;
    let day = 0;
    if (daysFromFirstYear <= 186) {
        month = Math.floor(daysFromFirstYear / 31);
        day = daysFromFirstYear - month * 31;
    } else {
        let y = daysFromFirstYear - 186;
        month = Math.floor(y / 30);
        day = y - month * 30;
    }

    if (day === 0) {
        day = 31;
        month = month - 1;
    }
    if (daysFromFirstYear > 186 && month <= 5) {
        month = month + 6;
    }
    return (
        mDate.getHours() +
        ':' +
        (mDate.getMinutes() < 10
            ? '0' + mDate.getMinutes()
            : mDate.getMinutes()) +
        ':' +
        (mDate.getSeconds() < 10
            ? '0' + mDate.getSeconds()
            : mDate.getSeconds()) +
        ' - ' +
        year +
        '/' +
        (month + 1 < 10 ? '0' + (month + 1) : month + 1) +
        '/' +
        (day < 10 ? '0' + day : day)
    );
};


const ceil = (double1, double2) => {
    return double1 - double2 * Math.floor(double1 / double2);
};

var
    persianNumbers = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g],
    arabicNumbers = [/٠/g, /١/g, /٢/g, /٣/g, /٤/g, /٥/g, /٦/g, /٧/g, /٨/g, /٩/g]
export const fixNumbers = function (str) {
    if (typeof str === 'string') {
        for (var i = 0; i < 10; i++) {
            str = str.replace(persianNumbers[i], i).replace(arabicNumbers[i], i);
        }
    }
    return str;
};