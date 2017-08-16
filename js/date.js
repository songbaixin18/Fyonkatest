//替换字符串
function Replace(str, from, to) {
    return str.split(from).join(to);
}
function FormatDate(date) {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1).toString();
    let day = (date.getDate()).toString();
    if (month.length === 1) {
        month = "0" + month;
    }
    if (day.length === 1) {
        day = "0" + day;
    }
    let dateTime = year + "-" + month + "-" + day;
    return dateTime;
}
//js日期字符串转换成日期类型
function parseDate(dateStr) {
    return new Date(Replace(dateStr, "-", "/"));
}
//增加月
function AddMonths(date, value) {
    date.setMonth(date.getMonth() + value);
    return date;
}
//增加天
function AddDays(date, value) {
    date.setDate(date.getDate() + value);
    return date;
}

function addDate(date,days){
    let d=new Date(date);
    d.setDate(d.getDate()+days);
    let month=d.getMonth()+1;
    let day = d.getDate();
    if(month<10){
        month = "0"+month;
    }
    if(day<10){
        day = "0"+day;
    }
    return d.getFullYear()+""+month+""+day;
}

//增加时
function AddHours(date, value) {
    date.setHours(date.getHours() + value);
    return date;
}
//返回月份(两位数)
/**
 * @return {string}
 */
function GetFullMonth(date) {
    let v = date.getMonth() + 1;
    if (v > 9) return v.toString();
    return "0" + v;
}

//返回日(两位数)
/**
 * @return {string}
 */
function GetFullDate(date) {
    let v = date.getDate();
    if (v > 9) return v.toString();
    return "0" + v;
}
//返回时(两位数)
/**
 * @return {string}
 */
function GetFullHour(date) {
    let v = date.getHours();
    if (v > 9) return v.toString();
    return "0" + v;
}
//比较两个日期大小
function  compareDate(sDate1,sDate2){
    if(sDate1!==""&&sDate2!==""){
        let startDate=sDate1.replace(/-/g,"/");
        let endDate=sDate2.replace(/-/g,"/");
        let S_Date=new Date(Date.parse(startDate));
        let E_Date=new Date(Date.parse(endDate));
        return S_Date <= E_Date;
    }
}


//取得两个日期的差值
function exDateRange(sDate1,sDate2){
    let iDateRange;
    if(sDate1!==""&&sDate2!==""){
        let startDate=sDate1.replace(/-/g,"/");
        let endDate=sDate2.replace(/-/g,"/");
        let S_Date=new Date(Date.parse(startDate));
        let E_Date=new Date(Date.parse(endDate));
        iDateRange=(S_Date-E_Date)/86400000;
    }
}