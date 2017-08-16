addEventListener("message", function(event){
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "../data/data.json"); //'/period/get_period_info?unionId=1&currentMonth=2017-08-13'
    xhr.onload = function(){
        postMessage(xhr.responseText);
    };
    xhr.send();
},false);