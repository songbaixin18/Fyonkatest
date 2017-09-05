//js日期类型转换成字符串
function FormatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString();
    var day = (date.getDate()).toString();
    if(month.length === 1){
        month = '0' + month;
    }
    if(day.length === 1){
        day = '0' + day;
    }
    var dateTime = year + "-" + month + "-" + day;
    return dateTime;
}
//js日期字符串转换成日期类型
function parseDate(dateString) {
    if(dateString === null){
        return new Date('9999/01/01');
    }
    var SEPARATOR_BAR = "-";
    var SEPARATOR_SLASH = "/";
    var SEPARATOR_DOT = ".";
    var dateArray;
    if(dateString.indexOf(SEPARATOR_BAR) > -1){
        dateArray = dateString.split(SEPARATOR_BAR);
    }else if(dateString.indexOf(SEPARATOR_SLASH) > -1){
        dateArray = dateString.split(SEPARATOR_SLASH);
    }else{
        dateArray = dateString.split(SEPARATOR_DOT);
    }
    return new Date(dateArray[0], dateArray[1]-1, dateArray[2]);
}

//增加天
function AddDays(date, value) {
    date.setDate(date.getDate() + value);
    return date;
}
//增加月
function AddMonths(date, value) {
    date.setMonth(date.getMonth() + value);
    return date;
}
//计算两个日期之间的月差数
function Amount(date1, date2) {
    date1 = date1.getFullYear() * 12 + date1.getMonth()+1;
    date2 = date2.getFullYear() * 12 + date2.getMonth()+1;
    return Math.abs(date1 - date2);
}