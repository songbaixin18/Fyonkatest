/**
 * Created by CD on 2017/5/24.
 */
(function (window) {
    var apiUrl = 'http://107.150.100.209:8080/game_web/';
    // 获取用户ID
    var unionIdInfo = null;
    function getUnionId(deviceId) {
        $.ajax({
            async: false,
            url: apiUrl+'/period/jump_period?deviceId='+deviceId,
            //url:'/period/jump_period?deviceId=asdasdasdasdasdsad',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                unionIdInfo = data;
            }
        });
    }
    // 更新经期记录
    function inPeriodData(recordId,unionId,type,status,value) {
        $.ajax({
            async: false,
            url: apiUrl+'/period/deal_period_record?recordId='+recordId+'&unionId='+unionId+'&type='+type+'&status='+status+'&value='+value,
            //url:'/period/deal_period_record?recordId=0&unionId=1&type=1&status=1&value=2017-08-12',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                console.log(data);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    }
    // 添加修改痛经流量
    function inDealData(unionId,seletDate,type,value) {
        $.ajax({
            async: true,
            url: apiUrl+'/period/deal_period_data?unionId='+unionId+'&seletDate='+seletDate+'&type='+type+'&value='+value,
            //url:'/period/deal_period_data?unionId=1&seletDate=2017-08-14&type=1&value=4',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                console.log(data);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    }
    // 获取用户痛经流量数据
    var dysmenorrhea_data = null;
    var flow_data = null;
    function getDealData(unionId,currentMonth) {
        $.ajax({
            async: false,
            url: apiUrl+'/period/get_period_info?unionId='+unionId+'&currentMonth='+currentMonth,
            //url:'/period/get_period_info?unionId=1&currentMonth=2017-08-13',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                dysmenorrhea_data = data.dysmenorrhea;
                flow_data = data.flow;
                console.log(dysmenorrhea_data+";"+flow_data);
            },
            error:function(data) {
                alert('获取用户数据出错');
            }
        });
    }
    // 获取用户经期数据
    var periodInfo = null;
    var periodInfo_labeled = null;
    var start_labeled = null;
    var end_labeled = null;
    function getPeriodData(unionId,currentMonth) {
        $.ajax({
            async: false,
            url: apiUrl+'/period/get_period_info?unionId='+unionId+'&currentMonth='+currentMonth,
            //url:'/period/get_period_info?unionId=1&currentMonth=2017-08-13',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                periodInfo = data;
                start_labeled = AddMonths(parseDate(currentMonth), -2);
                end_labeled = AddMonths(parseDate(currentMonth), 2);
                periodInfo_labeled = data.recordBeans;
                console.log(data);
                console.log(periodInfo_labeled);
            },
            error:function(data) {
                alert('获取用户数据出错');
            }
        });
    }
    function perGetPeriodData(unionId,currentMonth) {
        $.ajax({
            async: true,
            url: apiUrl+'/period/get_period_info?unionId='+unionId+'&currentMonth='+currentMonth,
            //url:'/period/get_period_info?unionId=1&currentMonth=2017-08-13',
            type: 'GET',
            dataType: 'json',
            success: function(data) {
                periodInfo = data;
                if(periodInfo_labeled === null){
                    start_labeled = AddMonths(parseDate(currentMonth),-2);
                    end_labeled = AddMonths(parseDate(currentMonth),2);
                    periodInfo_labeled = data.recordBeans;
                } else if(parseDate(currentMonth)>end_labeled){
                    periodInfo_labeled.push.apply( periodInfo_labeled, data.recordBeans );
                    end_labeled = AddMonths(parseDate(currentMonth),2);
                }else if(parseDate(currentMonth)<start_labeled){
                    periodInfo_labeled.unshift.apply( periodInfo_labeled, data.recordBeans );
                    start_labeled = AddMonths(parseDate(currentMonth),-2)
                }
                console.log(data);
                console.log(periodInfo_labeled);
            },
            error:function(data) {
                alert('获取用户数据出错');
            }
        });
    }
    // 提交经期常规数据
    function inPeriodDataRule(unionId,periodism,duration,lastDay) {
        $.ajax({
            async: false,
            url: apiUrl+'/period/save_period_info?unionId='+unionId+'&periodism='+periodism+'&duration='+duration+'&lastDay='+lastDay,
            //url:'/period/save_period_info?unionId=1&periodism=28&duration=4&lastDay=2017-08-12',
            type: 'POST',
            dataType: 'json',
            success: function(data) {
                console.log(data);
            },
            error: function (msg) {
                console.log(msg);
            }
        });
    }

    window.onload = function () {
        // 日期计算相关函数
        var F = {
            //计算某年某月有多少天
            getDaysInMonth: function (year, month) {
                return new Date(year, month, 0).getDate();
            },
            //计算某月1号是星期几
            getWeekInMonth: function (year, month) {
                return new Date(year, month - 1, 1).getDay();
            },
            getMonth: function (m) {
                return ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'][m];
            },
            //计算年某月的最后一天日期
            getLastDayInMonth: function (year, month) {
                return new Date(year, month + 1, this.getDaysInMonth(year, month));
            },
            //计算某年某月的随后一天是周几
            getLastWeekInMonth: function (year, month) {
                return new Date(year, month - 1, this.getDaysInMonth(year, month)).getDay();
            }
        };

        // 日历
        var triggerCover = document.querySelector('#triggerCover');
        var days = document.querySelector('.days');//一个月多少天列表
        var today = document.querySelector('#today');
        var prev = document.querySelector('#prev');
        var next = document.querySelector('#next');
        var calendar = document.querySelector('.calendar');
        var triggers = triggerCover.children;
        // 日期选择
        var init_triggerCover = document.querySelector('#init_triggerCover');
        var init_days = document.querySelector('.init_days');//一个月多少天列表
        var init_today = document.querySelector('#init_today');
        var init_prev = document.querySelector('#init_prev');
        var init_next = document.querySelector('#init_next');
        var init_calendar = document.querySelector('.init_calendar');
        var init_triggers = init_triggerCover.children;
        // 页面中的年月标签
        var years = document.querySelector('#years');
        var months = document.querySelector('#months');
        // 操作列表开关
        var toDayOnOff = document.querySelector('#toDayOnOff');
        // 遮挡层1
        var close_one = document.querySelector('#close');
        var that_day = document.querySelector('#that_day');
        var selected = document.getElementById('selected');
        var selectedStartOnOff = document.querySelector('#selected_startOnOff');
        var selectedEndOnOff = document.querySelector('#selected_endOnOff');
        // 操作列表
        var toDayOnOff_li = document.querySelector('#toDayOnOff_li');
        var dysmenorrhea = document.querySelector('#dysmenorrhea');
        var flow = document.querySelector('#flow');
        // 遮挡层2
        var trigger_duration = document.querySelector('#trigger_duration');
        var duration = document.querySelector('#duration');
        var modelBox_ul2 = document.querySelector('.modelBox_ul2');
        var yes_duration = document.querySelector('#yes_duration');
        var modelBox_li2 = modelBox_ul2.children;
        // 遮挡层3
        var trigger_cycle = document.querySelector('#trigger_cycle');
        var cycle = document.querySelector('#cycle');
        var modelBox_ul3 = document.querySelector('.modelBox_ul3');
        var yes_cycle = document.querySelector('#yes_cycle');
        var modelBox_li3 = modelBox_ul3.children;
        // 初始化数据
        var initCover = document.querySelector('#initCover');
        var init_duration = document.querySelector('#init_duration');
        var init_cycle = document.querySelector('#init_cycle');
        var yes_calendar = document.querySelector('#yes_calendar');
        var init_enter = document.querySelector('#init_enter');
        var init_lastTime = document.querySelector('#init_lastTime');
        // 关闭遮挡层
        var close = document.querySelectorAll('.close');
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;

        years.innerText = year + '年';
        months.innerText = month + '月';

        // 固定数据
        // 排卵日与经期差值
        var ovulationDay = 14;
        // 易孕期与经期差值
        var easyPregnancyDayEnd = 10;
        var easyPregnancyDayStart = 19;
        // 月经最早开始时间
        var lastDate = null;
        // 月经最后开始时间
        var lastPeriodDateStart = null;
        // 经期周期
        var dataCycle;
        // 经期时长
        var dataTime;

        // 变量重赋值
        function resValue() {
            lastDate = periodInfo.lastDay;
            lastPeriodDateStart = periodInfo.lastTime;
            dataCycle = periodInfo.periodism;
            dataTime = periodInfo.duration - 1;
        }
        getUnionId('virtualDevice2');
        var unionId = unionIdInfo.unionId;

        // 初始数据
        if (unionIdInfo.flag === 0) {
            // 初始数据
            initCover.style.display = 'block';
            init_duration.addEventListener('click', function () {
                duration.style.display = 'block';
            });
            var init_duration_data;
            for (var i = 0; i < modelBox_li2.length; i++) {
                (function (i) {
                    modelBox_li2[i].addEventListener('click', function () {
                        for (var j = 0; j < modelBox_li2.length; j++) {
                            modelBox_li2[j].className = 'modelBox_li2';
                        }
                        this.className = "modelBox_li2 active";
                        yes_duration.addEventListener('click',yes_duration_click);
                        function yes_duration_click() {
                            init_duration_data = i + 1;
                            this.parentNode.parentNode.parentNode.style.display = 'none';
                            yes_duration.removeEventListener('click',yes_duration_click);
                        }
                    })
                })(i)
            }
            init_cycle.addEventListener('click', function () {
                cycle.style.display = 'block';
            });
            var init_cycle_data;
            for (var i = 0; i < modelBox_li3.length; i++) {
                (function (i) {
                    modelBox_li3[i].addEventListener('click', function () {
                        for (var j = 0; j < modelBox_li3.length; j++) {
                            modelBox_li3[j].className = 'modelBox_li2';
                        }
                        this.className = "modelBox_li2 active";
                        yes_cycle.addEventListener('click',yes_cycle_click);
                        function yes_cycle_click() {
                            init_cycle_data = i + 1;
                            this.parentNode.parentNode.parentNode.style.display = 'none';
                            yes_cycle.removeEventListener('click',yes_cycle_click);
                        }
                    })
                })(i)
            }
            init_lastTime.addEventListener('click',function(){
                init_calendar.style.display = 'block';
            });
            var init_lastTime_data;
            init_days.innerHTML = '';
            var firstDayOfWeek = F.getWeekInMonth(year, month);
            for (var i = 0; i < firstDayOfWeek; i++) {
                var li_none = document.createElement('li');
                init_days.appendChild(li_none)
            }
            var daysInMonth = F.getDaysInMonth(year, month);
            for (var i = 0; i < daysInMonth; i++) {
                var li_block = document.createElement('li');
                li_block.innerText = i + 1;
                init_days.appendChild(li_block);
            }
            var lastDayOfWeek = F.getLastWeekInMonth(year, month);
            for (var i = 0; i < (6 - lastDayOfWeek); i++) {
                var li_none = document.createElement('li');
                init_days.appendChild(li_none)
            }
            for (var i = 1; i <= F.getDaysInMonth(year, month); i++) {
                if (parseDate(year + "/" + month + "/" + i) <= new Date()) {
                    (function (arg) {
                        init_triggers[arg + firstDayOfWeek - 1].addEventListener('click', triggers_click);
                        function triggers_click() {
                            for (var j = 1; j <= F.getDaysInMonth(year, month); j++) {
                                init_triggers[j + firstDayOfWeek - 1].style.border = 'none';
                            }
                            this.style.border = '2px solid #FF4F73';
                            yes_calendar.addEventListener('click',yes_calendar_click);
                            function yes_calendar_click() {
                                init_lastTime_data = year + '-' + month + '-' + arg;
                                this.parentNode.parentNode.parentNode.style.display = 'none';
                                yes_calendar.removeEventListener('click',yes_calendar_click);
                            }
                        }
                    })(i);
                }
            }
            init_enter.addEventListener('click',yes_init_click);
            function yes_init_click() {
                if(typeof(init_lastTime_data&&init_cycle_data&&init_duration_data) === 'undefined'){
                    alert('请完整填写数据');
                }else{
                    //alert(unionId+"\n"+ init_cycle_data+"\n"+ init_duration_data+"\n"+ init_lastTime_data)
                    inPeriodDataRule(unionId, init_cycle_data, init_duration_data, FormatDate(parseDate(init_lastTime_data)));
                    inPeriodData(0, unionId, 1, 1, FormatDate(parseDate(init_lastTime_data)));
                    if (AddDays(parseDate(year + "/" + month + "/" + arg), init_duration_data) < new Date()) {
                        getPeriodData(unionId, FormatDate(parseDate(init_lastTime_data)));
                        inPeriodData(getRecordId(parseDate(init_lastTime_data)), unionId, 2, 1, FormatDate(AddDays(parseDate(year + "/" + month + "/" + arg), init_duration_data)));
                    }
                    yes_duration.removeEventListener('click', yes_duration_click);
                }

            }

            //关闭遮挡层
            for (var k = 0; k < close.length; k++) {
                close[k].addEventListener('click', function () {
                    this.parentNode.parentNode.parentNode.style.display = 'none';
                })
            }
        } else {
            getPeriodData(unionId, FormatDate(new Date()));
            resValue();
            // 获取日期对应的记录ID
            function getRecordId(date) {
                var recordid = 0;
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (periodInfo_labeled[i].endDay === '1997-01-01') {
                        if (parseDate(periodInfo_labeled[i].startDay) <= date) {
                            recordid = periodInfo_labeled[i].recordId;
                            return recordid;
                        }
                    }
                    if (parseDate(periodInfo_labeled[i].startDay) <= date && AddDays(parseDate(periodInfo_labeled[i].endDay), 1) > date) {
                        recordid = periodInfo_labeled[i].recordId;
                        return recordid;
                    }
                }
                return recordid;
            }

            // 获取日期对应的记录Index
            function getRecordIndex(date) {
                var i = 0;
                for (i = 0; i < periodInfo_labeled.length; i++) {
                    if (periodInfo_labeled[i].endDay === '1997-01-01') {
                        if (parseDate(periodInfo_labeled[i].startDay) <= date) {
                            return i;
                        }
                    }
                    if (parseDate(periodInfo_labeled[i].startDay) <= date && AddDays(parseDate(periodInfo_labeled[i].endDay), 1) > date) {
                        return i;
                    }
                }
                return -1;
            }

            // 获取日期之前最近的记录ID
            function getLastRecordId(date) {
                var recordid = 0;
                var temp = 0;
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (parseDate(periodInfo_labeled[i].startDay) <= date) {
                        temp = date - parseDate(periodInfo_labeled[i].startDay);
                        recordid = periodInfo_labeled[i].recordId;
                        if (date - parseDate(periodInfo_labeled[i].startDay) < temp) {
                            temp = date - parseDate(periodInfo_labeled[i].startDay);
                            recordid = periodInfo_labeled[i].recordId;
                        }
                    }
                }
                return recordid;
            }

            // 加载日历
            function render() {
                days.innerHTML = '';
                var firstDayOfWeek = F.getWeekInMonth(year, month);
                for (var i = 0; i < firstDayOfWeek; i++) {
                    var li_none = document.createElement('li');
                    days.appendChild(li_none)
                }
                var daysInMonth = F.getDaysInMonth(year, month);
                for (var i = 0; i < daysInMonth; i++) {
                    var li_block = document.createElement('li');
                    li_block.innerText = i + 1;
                    days.appendChild(li_block);
                }
                var lastDayOfWeek = F.getLastWeekInMonth(year, month);
                for (var i = 0; i < (6 - lastDayOfWeek); i++) {
                    var li_none = document.createElement('li');
                    days.appendChild(li_none)
                }
                var thisMonthMaxDate = F.getLastDayInMonth(year, month);
                AddDays(thisMonthMaxDate, dataCycle);
                var lastPeriodDateStartTemp;
                // 预测经期处理显示
                // 预测安全期
                for (var i = 1; i <= F.getDaysInMonth(year, month); i++) {
                    if (parseDate(year + "/" + month + "/" + i) >= parseDate(lastPeriodDateStart)) {
                        triggers[i + firstDayOfWeek - 1].className = 'SafePeriod';
                    }
                }
                // 预测易孕期
                for (lastPeriodDateStartTemp = parseDate(lastPeriodDateStart); lastPeriodDateStartTemp <= thisMonthMaxDate; AddDays(lastPeriodDateStartTemp, dataCycle)) {
                    if (AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayStart * -1).getMonth() + 1 === month
                        && AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayStart * -1).getFullYear() === year) {
                        for (var j = AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayStart * -1).getDate();
                             j <= F.getDaysInMonth(year, month)
                             && parseDate(year + "/" + month + "/" + j) <= AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayEnd * -1);
                             j++) {
                            triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                        }
                    }
                    if (AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayEnd * -1).getMonth() + 1 === month
                        && AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayEnd * -1).getFullYear() === year) {
                        for (var j = AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayEnd * -1).getDate();
                             j >= 1
                             && parseDate(year + "/" + month + "/" + j) >= AddDays(new Date(lastPeriodDateStartTemp), easyPregnancyDayStart * -1);
                             j--) {
                            triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                        }
                    }
                }
                // 预测排卵日
                for (lastPeriodDateStartTemp = parseDate(lastPeriodDateStart); lastPeriodDateStartTemp <= thisMonthMaxDate; AddDays(lastPeriodDateStartTemp, dataCycle)) {
                    if (AddDays(new Date(lastPeriodDateStartTemp), ovulationDay * -1).getMonth() + 1 === month
                        && AddDays(new Date(lastPeriodDateStartTemp), ovulationDay * -1).getFullYear() === year) {
                        triggers[AddDays(new Date(lastPeriodDateStartTemp), ovulationDay * -1).getDate() + firstDayOfWeek - 1].className = 'ovulation';
                    }
                }
                // 预测经期
                for (lastPeriodDateStartTemp = parseDate(lastPeriodDateStart); lastPeriodDateStartTemp <= thisMonthMaxDate; AddDays(lastPeriodDateStartTemp, dataCycle)) {
                    if (new Date(lastPeriodDateStartTemp).getMonth() + 1 === month
                        && new Date(lastPeriodDateStartTemp).getFullYear() === year) {
                        for (var j = new Date(lastPeriodDateStartTemp).getDate();
                             j <= F.getDaysInMonth(year, month)
                             && parseDate(year + "/" + month + "/" + j) < AddDays(new Date(lastPeriodDateStartTemp), dataTime);
                             j++) {
                            triggers[j + firstDayOfWeek - 1].className = 'PredictivePhysiological';
                        }
                    }
                    if (AddDays(new Date(lastPeriodDateStartTemp), dataTime).getMonth() + 1 === month
                        && AddDays(new Date(lastPeriodDateStartTemp), dataTime).getFullYear() === year) {
                        for (var j = AddDays(new Date(lastPeriodDateStartTemp), dataTime).getDate();
                             j >= 1
                             && parseDate(year + "/" + month + "/" + j) > new Date(lastPeriodDateStartTemp)
                            ; j--) {
                            triggers[j + firstDayOfWeek - 1].className = 'PredictivePhysiological';
                        }
                    }
                }

                // 经期数据处理显示
                // 安全期第一部分（经期开始前一周期）
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (AddDays(parseDate(periodInfo_labeled[i].startDay), dataCycle * -1).getMonth() + 1 === month
                        && AddDays(parseDate(periodInfo_labeled[i].startDay), dataCycle * -1).getFullYear() === year) {
                        for (var j = AddDays(parseDate(periodInfo_labeled[i].startDay), dataCycle * -1).getDate();
                             j <= F.getDaysInMonth(year, month)
                             && triggers[j + firstDayOfWeek - 1].innerText
                             && parseDate(year + "/" + month + "/" + j) <= parseDate(periodInfo_labeled[i].startDay);
                             j++) {
                            triggers[j + firstDayOfWeek - 1].className = 'SafePeriod';
                        }
                    }
                    if (parseDate(periodInfo_labeled[i].startDay).getMonth() + 1 === month
                        && parseDate(periodInfo_labeled[i].startDay).getFullYear() === year) {
                        for (var j = parseDate(periodInfo_labeled[i].startDay).getDate();
                             j >= 1
                             && triggers[j + firstDayOfWeek - 1].innerText
                             && parseDate(year + "/" + month + "/" + j) >= AddDays(parseDate(periodInfo_labeled[i].startDay), dataCycle * -1);
                             j--) {
                            triggers[j + firstDayOfWeek - 1].className = 'SafePeriod';
                        }
                    }
                }
                // 安全期第二部分（最早的经期开始记录到最后的经期开始记录）
                if (lastPeriodDateStart !== null) {
                    for (var i = 1; i <= F.getDaysInMonth(year, month) && triggers[i + firstDayOfWeek - 1].innerText; i++) {
                        if (parseDate(year + "/" + month + "/" + i) < parseDate(lastPeriodDateStart)
                            && parseDate(year + "/" + month + "/" + i) > parseDate(lastDate)) {
                            triggers[i + firstDayOfWeek - 1].className = 'SafePeriod';
                        }
                    }
                }
                // 易孕期
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayStart * -1).getMonth() + 1 === month
                        && AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayStart * -1).getFullYear() === year) {
                        for (var j = AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayStart * -1).getDate();
                             j <= F.getDaysInMonth(year, month)
                             && parseDate(year + "/" + month + "/" + j) <= AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayEnd * -1);
                             j++) {
                            triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                        }
                    }
                    if (AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayEnd * -1).getMonth() + 1 === month
                        && AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayEnd * -1).getFullYear() === year) {
                        for (var j = AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayEnd * -1).getDate();
                             j >= 1
                             && parseDate(year + "/" + month + "/" + j) >= AddDays(parseDate(periodInfo_labeled[i].startDay), easyPregnancyDayStart * -1)
                            ; j--) {
                            triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                        }
                    }
                }
                // 排卵日
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (AddDays(parseDate(periodInfo_labeled[i].startDay), ovulationDay * -1).getMonth() + 1 === month
                        && AddDays(parseDate(periodInfo_labeled[i].startDay), ovulationDay * -1).getFullYear() === year) {
                        triggers[AddDays(parseDate(periodInfo_labeled[i].startDay), ovulationDay * -1).getDate() + firstDayOfWeek - 1].className = 'ovulation';
                    }
                }
                // 经期
                for (var i = 0; i < periodInfo_labeled.length; i++) {
                    if (parseDate(periodInfo_labeled[i].startDay).getMonth() + 1 === month
                        && parseDate(periodInfo_labeled[i].startDay).getFullYear() === year) {
                        if (periodInfo_labeled[i].endDay === "1997-01-01") {
                            for (var j = parseDate(periodInfo_labeled[i].startDay).getDate();
                                 j <= F.getDaysInMonth(year, month)
                                 && j <= new Date().getDate(); j++) {
                                triggers[j + firstDayOfWeek - 1].className = 'physiology';
                            }
                        }
                        for (var j = parseDate(periodInfo_labeled[i].startDay).getDate();
                             j <= F.getDaysInMonth(year, month)
                             && triggers[j + firstDayOfWeek - 1].innerText
                             && parseDate(year + "/" + month + "/" + j) <= parseDate(periodInfo_labeled[i].endDay);
                             j++) {
                            triggers[j + firstDayOfWeek - 1].className = 'physiology';
                        }
                    }
                    if (parseDate(periodInfo_labeled[i].endDay).getMonth() + 1 === month
                        && parseDate(periodInfo_labeled[i].startDay).getFullYear() === year) {
                        for (var j = parseDate(periodInfo_labeled[i].endDay).getDate();
                             j >= 1
                             && triggers[j + firstDayOfWeek - 1].innerText
                             && parseDate(year + "/" + month + "/" + j) >= parseDate(periodInfo_labeled[i].startDay)
                            ; j--) {
                            triggers[j + firstDayOfWeek - 1].className = 'physiology';
                        }
                    }
                }
                // 遮挡层1
                for (var i = 1; i <= F.getDaysInMonth(year, month); i++) {
                    if (parseDate(year + "/" + month + "/" + i) <= new Date()) {
                        (function (arg) {
                            triggers[arg + firstDayOfWeek - 1].addEventListener('click', function () {
                                for (var j = 1; j <= F.getDaysInMonth(year, month); j++) {
                                    triggers[j + firstDayOfWeek - 1].style.border = 'none';
                                }
                                this.style.border = '2px solid #FF4F73';
                                selected.style.display = 'block';
                                that_day.innerHTML = '';
                                that_day.innerText = year + '年' + month + '月' + arg + '日';
                                selectedStartOnOff.style.backgroundColor = '#CCC4C2';
                                selectedStartOnOff.children[0].className = 'off';
                                selectedEndOnOff.style.backgroundColor = '#CCC4C2';
                                selectedEndOnOff.children[0].className = 'off';


                                // 遮挡层1开关样式操作
                                for (var j = 0; j < periodInfo_labeled.length; j++) {
                                    if (FormatDate(parseDate(year + "/" + month + "/" + arg)) === periodInfo_labeled[j].startDay) {
                                        selectedStartOnOff.style.backgroundColor = '#FF4F73';
                                        selectedStartOnOff.children[0].className = 'on';
                                    }
                                    if (FormatDate(parseDate(year + "/" + month + "/" + arg)) === periodInfo_labeled[j].endDay) {
                                        selectedEndOnOff.style.backgroundColor = '#FF4F73';
                                        selectedEndOnOff.children[0].className = 'on';
                                    }
                                }

                                // 遮挡层1开关函数操作
                                var index = getRecordIndex(AddDays(parseDate(year + "/" + month + "/" + arg), dataTime));
                                if (index === -1) {
                                    index = getRecordIndex(parseDate(year + "/" + month + "/" + arg));
                                }
                                if (index === -1) {
                                    index = 0;
                                }
                                selectedStartOnOff.addEventListener('click', selectedStartOnOffClick);

                                function selectedStartOnOffClick() {
                                    if (periodInfo_labeled.length === 0) {
                                        inPeriodData(0, unionId, 1, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                        if (AddDays(parseDate(year + "/" + month + "/" + arg), dataTime) < new Date()) {
                                            getPeriodData(unionId, FormatDate(parseDate(year + "/" + month + "/" + arg)));
                                            inPeriodData(getRecordId(parseDate(year + "/" + month + "/" + arg)), unionId, 2, 1, FormatDate(AddDays(parseDate(year + "/" + month + "/" + arg), dataTime)));
                                        }
                                        getPeriodData(unionId, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                        resValue();
                                        render();
                                        list();
                                        selectedStartOnOff.removeEventListener('click', selectedStartOnOffClick);
                                        this.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                                        return;
                                    }
                                    if (FormatDate(parseDate(year + "/" + month + "/" + arg)) === periodInfo_labeled[index].startDay) {
                                        inPeriodData(getRecordId(parseDate(periodInfo_labeled[index].startDay)), unionId, 1, -1, periodInfo_labeled[index].startDay);
                                    } else if (getRecordId(parseDate(year + "/" + month + "/" + arg)) !== 0) {
                                        inPeriodData(getRecordId(parseDate(periodInfo_labeled[index].startDay)), unionId, 1, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    } else if (getRecordId(AddDays(parseDate(year + "/" + month + "/" + arg), dataTime)) !== 0) {
                                        inPeriodData(getRecordId(AddDays(parseDate(year + "/" + month + "/" + arg), dataTime)), unionId, 1, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    } else {
                                        inPeriodData(0, unionId, 1, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                        if (AddDays(parseDate(year + "/" + month + "/" + arg), dataTime) < new Date()) {
                                            getPeriodData(unionId, FormatDate(parseDate(year + "/" + month + "/" + arg)));
                                            inPeriodData(getRecordId(parseDate(year + "/" + month + "/" + arg)), unionId, 2, 1, FormatDate(AddDays(parseDate(year + "/" + month + "/" + arg), dataTime)));
                                        }
                                    }
                                    getPeriodData(unionId, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    resValue();
                                    render();
                                    list();
                                    selectedStartOnOff.removeEventListener('click', selectedStartOnOffClick);
                                    this.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                                }
                                if (index === -1) {
                                    index = getRecordIndex(parseDate(year + "/" + month + "/" + arg));
                                }
                                if (index === -1) {
                                    index = 0;
                                }
                                selectedEndOnOff.addEventListener('click', selectedEndOnOffClick);

                                function selectedEndOnOffClick() {
                                    if (lastPeriodDateStart === null) {
                                        alert("没有开始经期的数据，请先设置开始时间，再设置结束时间");
                                        selectedEndOnOff.style.backgroundColor = '#CCC4C2';
                                        selectedEndOnOff.children[0].className = 'off';
                                        selectedEndOnOff.removeEventListener('click', selectedEndOnOffClick);
                                        return;
                                    }
                                    if (FormatDate(parseDate(year + "/" + month + "/" + arg)) === periodInfo_labeled[index].endDay) {
                                        if (FormatDate(parseDate(year + "/" + month + "/" + arg)) === FormatDate(new Date())) {
                                            inPeriodData(getRecordId(parseDate(periodInfo_labeled[index].startDay)), unionId, 2, 1, '1997-01-01');
                                        } else {
                                            alert("如果不是这一天结束，请转到结束那天按此按钮");
                                            selectedEndOnOff.style.backgroundColor = '#FF4F73';
                                            selectedEndOnOff.children[0].className = 'on';
                                        }
                                    } else if (getRecordId(parseDate(year + "/" + month + "/" + arg)) !== 0) {
                                        inPeriodData(getRecordId(parseDate(periodInfo_labeled[index].startDay)), unionId, 2, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    } else if (getLastRecordId(parseDate(year + "/" + month + "/" + arg)) !== 0) {
                                        inPeriodData(getLastRecordId(parseDate(year + "/" + month + "/" + arg)), unionId, 2, 1, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    } else {
                                        alert("这一天之前两个月都没有开始经期的数据，请先设置开始时间，再设置结束时间");
                                        selectedEndOnOff.style.backgroundColor = '#CCC4C2';
                                        selectedEndOnOff.children[0].className = 'off';
                                    }
                                    getPeriodData(unionId, FormatDate(parseDate(year + "-" + month + "-" + arg)));
                                    resValue();
                                    render();
                                    list();
                                    selectedEndOnOff.removeEventListener('click', selectedEndOnOffClick);
                                    this.parentNode.parentNode.parentNode.parentNode.style.display = 'none';
                                }
                                close_one.addEventListener('click', function () {
                                    selectedStartOnOff.removeEventListener('click', selectedStartOnOffClick);
                                    selectedEndOnOff.removeEventListener('click', selectedEndOnOffClick);
                                })
                            })
                        })(i);
                    }
                }
            }
            render();
            //左滑 右划
            var x1, x2;
            triggerCover.addEventListener('touchstart', function (e) {
                x1 = e.targetTouches[0].pageX;
                triggerCover.addEventListener('touchmove', function (e) {
                    x2 = e.targetTouches[0].pageX;
                })
            });

            triggerCover.addEventListener('touchend', function () {
                var changeX = x2 - x1;
                //小幅度、单点滑动无效果，为了防止用户误滑
                if (Math.abs(changeX) > 100 && x2 !== null) {
                    if (changeX < 0) {
                        prev_month();
                    } else {
                        next_month();
                    }
                }
                x1 = null;
                x2 = null;
            });

            //今天
            today.addEventListener('click', today_date);

            function today_date() {
                date = new Date();
                year = date.getFullYear();
                month = date.getMonth() + 1;
                var day = date.getDate();
                years.innerText = year + '年';
                months.innerText = month + '月';
                if(Amount(parseDate(year+"/"+month+"/1"),parseDate(FormatDate(end_labeled))) >= 0
                    || Amount(parseDate(year+"/"+month+"/1"),parseDate(FormatDate(end_labeled))) <= 0){
                    getPeriodData(unionId,FormatDate(new Date()));
                }
                resValue();
                render();
                var firstDayOfWeek = F.getWeekInMonth(year, month);
                var triggers = triggerCover.children;
                triggers[day + firstDayOfWeek - 1].style.border = '2px solid #FF4F73'
                list();
            }


            //上个月
            prev.addEventListener('click', prev_month);

            function prev_month() {
                month = month - 1;
                if (month < 1) {
                    year = year - 1;
                    month = 12;
                }
                years.innerText = year + '年';
                months.innerText = month + '月';
                if(Amount(parseDate(year+"/"+month+"/1"),parseDate(FormatDate(start_labeled))) === 1){
                    perGetPeriodData(unionId,FormatDate(AddMonths(parseDate(year+"/"+month+"/1"),-4)));
                }
                render();
                list();
            }

            //下个月
            next.addEventListener('click', next_month);

            function next_month() {
                month = month + 1;
                if (month > 12) {
                    year = year + 1;
                    month = 1;
                }
                years.innerText = year + '年';
                months.innerText = month + '月';
                if(Amount(parseDate(year+"/"+month+"/1"),parseDate(FormatDate(end_labeled))) === 1){
                    perGetPeriodData(unionId,FormatDate(AddMonths(parseDate(year+"/"+month+"/1"),4)));
                }
                render();
                list();
            }

            years.innerText = year + '年';
            months.innerText = month + '月';

            // 开关样式
            var on_off = document.querySelectorAll('.on_off');
            for (var i = 0; i < on_off.length; i++) {
                on_off[i].addEventListener('click', function () {
                    var span = this.children[0];
                    if (span.className === 'on') {
                        this.style.backgroundColor = '#CCC4C2';
                        span.className = 'off';
                    }
                    else {
                        this.style.backgroundColor = '#FF4F73';
                        span.className = 'on';
                    }
                    return false;
                })
            }

            // 当天操作相关
            function list() {
                if(new Date().getFullYear() !== year || new Date().getMonth()+1 !== month){
                    toDayOnOff_li.style.display = 'none';
                    dysmenorrhea.style.display = 'none';
                    flow.style.display = 'none';
                } else {
                    toDayOnOff_li.style.display = 'block';
                    dysmenorrhea.style.display = 'block';
                    flow.style.display = 'block';
                    var span1 = toDayOnOff_li.children[1];
                    var span2 = toDayOnOff_li.children[2];
                    if(periodInfo_labeled.length === 0){
                        span1.innerText = ' يبدأ الحيض ?';
                        span2.style.backgroundColor = '#CCC4C2';
                        span2.children[0].className = 'off';
                    } else if (periodInfo_labeled[periodInfo_labeled.length - 1].endDay === FormatDate(new Date())) {
                        span1.innerText = ' نهاية الحيض ?';
                        span2.style.backgroundColor = '#FF4F73';
                        span2.children[0].className = 'on';
                    } else if (lastPeriodDateStart === null || new Date() > parseDate(periodInfo_labeled[periodInfo_labeled.length - 1].endDay) && periodInfo_labeled[periodInfo_labeled.length - 1].endDay !== '1997-01-01') {
                        span1.innerText = ' يبدأ الحيض ?';
                        span2.style.backgroundColor = '#CCC4C2';
                        span2.children[0].className = 'off';
                    } else if (lastPeriodDateStart === FormatDate(new Date())) {
                        span1.innerText = ' يبدأ الحيض ?';
                        span2.style.backgroundColor = '#FF4F73';
                        span2.children[0].className = 'on';
                    } else if (periodInfo_labeled[periodInfo_labeled.length - 1].endDay === '1997-01-01' && parseDate(FormatDate(new Date())) > parseDate(lastPeriodDateStart)) {
                        span1.innerText = ' نهاية الحيض ?';
                        span2.style.backgroundColor = '#CCC4C2';
                        span2.children[0].className = 'off';
                    }
                    getDealData(unionId,FormatDate(new Date()));
                    for(var i = 0;i < dysmenorrhea_data;i++){
                        dysmenorrhea.children[2].children[i].children[0].style.color = '#FF4F73';
                    }
                    for(var i = 0;i < flow_data;i++){
                        flow.children[2].children[i].children[0].style.color = '#FF4F73';
                    }
                    for(var i = 0;i < 5;i++){
                        (function (sum) {
                            dysmenorrhea.children[2].children[sum].addEventListener('click',function () {
                                for(var i = 0;i <= sum;i++){
                                    dysmenorrhea.children[2].children[i].children[0].style.color = '#FF4F73';
                                }
                                for(var i = sum + 1;i < 5;i++){
                                    dysmenorrhea.children[2].children[i].children[0].style.color = '#c0c0c0';
                                }
                                inDealData(unionId,FormatDate(new Date()),1,sum + 1);
                            });
                            flow.children[2].children[sum].addEventListener('click',function () {
                                for(var i = 0;i <= sum;i++){
                                    flow.children[2].children[i].children[0].style.color = '#FF4F73';
                                }
                                for(var i = sum + 1;i < 5;i++){
                                    flow.children[2].children[i].children[0].style.color = '#c0c0c0';
                                }
                                inDealData(unionId,FormatDate(new Date()),2,sum + 1);
                            });
                        })(i)
                    }
                }
            }
            list();
            toDayOnOff.addEventListener('click', toDayOnOffFunction);

            function toDayOnOffFunction() {
                if (periodInfo_labeled.length === 0 || (new Date() > parseDate(periodInfo_labeled[periodInfo_labeled.length - 1].endDay) && periodInfo_labeled[periodInfo_labeled.length - 1].endDay !== '1997-01-01')) {
                    inPeriodData(getRecordId(new Date()), unionId, 1, 1, FormatDate(new Date()));
                } else if (periodInfo_labeled[periodInfo_labeled.length - 1].endDay === FormatDate(new Date())) {
                    inPeriodData(getRecordId(new Date()), unionId, 2, -1, '1997-01-01');
                } else if (lastPeriodDateStart === FormatDate(new Date())) {
                    inPeriodData(getRecordId(new Date()), unionId, 1, -1, FormatDate(new Date()));
                } else if (periodInfo_labeled[periodInfo_labeled.length - 1].endDay === '1997-01-01' && parseDate(FormatDate(new Date())) > parseDate(lastPeriodDateStart)) {
                    inPeriodData(getRecordId(new Date()), unionId, 2, 1, FormatDate(new Date()));
                }
                getPeriodData(unionId, FormatDate(new Date()));
                resValue();
                render();
                list();
            }

            //关闭遮挡层
            for (var k = 0; k < close.length; k++) {
                close[k].addEventListener('click', function () {
                    this.parentNode.parentNode.parentNode.style.display = 'none';
                })
            }

            //遮挡层2
            //记录经期时长
            trigger_duration.addEventListener('click', function () {
                duration.style.display = 'block';
            });
            var duration_data;
            for (var i = 0; i < modelBox_li2.length; i++) {
                (function (i) {
                    modelBox_li2[i].addEventListener('click', function () {
                        for (var j = 0; j < modelBox_li2.length; j++) {
                            modelBox_li2[j].className = 'modelBox_li2';
                        }
                        this.className = "modelBox_li2 active";
                        duration_data = i + 1;
                        yes_duration.addEventListener('click', yes_duration_click);
                        function yes_duration_click() {
                            inPeriodDataRule(unionId, dataCycle, duration_data, lastDate);
                            yes_duration.removeEventListener('click', yes_duration_click);
                            this.parentNode.parentNode.parentNode.style.display = 'none';
                            resValue();
                            render();
                            list();
                        }
                    })
                })(i)
            }
            init_cycle.addEventListener('click', function () {
                cycle.style.display = 'block';
            });
            //遮挡层3
            //记录经期周期
            var cycle_data;
            trigger_cycle.addEventListener('click', function () {
                cycle.style.display = 'block';
            });
            for (var i = 0; i < modelBox_li3.length; i++) {
                (function (i) {
                    modelBox_li3[i].addEventListener('click', function () {
                        for (var j = 0; j < modelBox_li3.length; j++) {
                            modelBox_li3[j].className = 'modelBox_li2';
                        }
                        this.className = "modelBox_li2 active";
                        cycle_data = i + 1;
                        yes_cycle.addEventListener('click', yes_cycle_click);
                        function yes_cycle_click() {
                            inPeriodDataRule(unionId, cycle_data, dataTime, lastDate);
                            yes_cycle.removeEventListener('click', yes_cycle_click);
                            this.parentNode.parentNode.parentNode.style.display = 'none';
                            resValue();
                            render();
                            list();
                        }
                    })
                })(i)
            }
            // 痛经程度


            //名词解释
            var explain = document.querySelector('.explain');
            var prompt = document.querySelector('.prompt');
            prompt.addEventListener('click', function () {
                explain.style.display = 'block'
            })
        }
    }
})(window);
