/**
 * Created by CD on 2017/5/24.
 */
(function (window) {
    window.onload = function () {
        // 日期计算相关函数
        let F = {
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
        // 更新经期记录
        function inPeriodData(recordId,unionId,type,status,value) {
            $.ajax({
                async: false,
                url: '/period/deal_period_record?recordId='+recordId+'&unionId='+unionId+'&type='+type+'&status='+status+'&value='+value,
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
        // 获取用户经期数据
        let periodInfo = null;
        function getPeriodData() {
            $.ajax({
                async: false,
                url: '../data/data.json',
                //url:'/period/get_period_info?unionId=1&currentMonth=2017-08-13',
                type: 'GET',
                dataType: 'json',
                success: function(data) {
                    periodInfo = data;
                }
            });
        }
        getPeriodData();
        // 更新经期常规记录
        function inPeriodDataRule(unionId,periodism,duration,lastDay) {
            $.ajax({
                async: false,
                url: '/period/save_period_info?unionId='+unionId+'&periodism='+periodism+'&duration='+duration+'&lastDay='+lastDay,
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
        // 日历
        const triggerCover = document.querySelector('#triggerCover');
        const days = document.querySelector('.days');//一个月多少天列表
        const today = document.querySelector('#today');
        const prev = document.querySelector('#prev');
        const next = document.querySelector('#next');
        // 页面中的年月标签
        const years = document.querySelector('#years');
        const months = document.querySelector('#months');
        // 开关
        const toDayOnOff = document.querySelector('#toDayOnOff');

        // 操作列表
        const toDayOnOff_li = document.querySelector('#toDayOnOff_li');

        let date = new Date();
        let year = date.getFullYear();
        let month = date.getMonth() + 1;
        //初始
        years.innerText = year + '年';
        months.innerText = month + '月';

        // 固定数据
        // 排卵日与经期差值
        const ovulationDay = 14;
        // 易孕期与经期差值
        const easyPregnancyDayEnd = 10;
        const easyPregnancyDayStart = 19;
        // 最后记录经期开始
        let lastPeriodDateStart = null;
        if(periodInfo.recordBeans.length > 0){
            lastPeriodDateStart = periodInfo.recordBeans[periodInfo.recordBeans.length-1].startDay;
        }
        // 最后记录经期结束
        let lastPeriodDateEnd = null;
        if(periodInfo.recordBeans.length > 0){
            lastPeriodDateEnd = periodInfo.recordBeans[periodInfo.recordBeans.length-1].endDay;
        }
        // 经期周期
        let dataCycle = periodInfo.periodism;
        // 经期时长
        let dataTime = periodInfo.duration - 1;

        // 加载日历
        function render() {
            days.innerHTML = '';
            let firstDayOfWeek = F.getWeekInMonth(year, month);
            for (let i = 0; i < firstDayOfWeek; i++) {
                let li_none = document.createElement('li');
                days.appendChild(li_none)
            }
            let daysInMonth = F.getDaysInMonth(year, month);
            for (let i = 0; i < daysInMonth; i++) {
                let li_block = document.createElement('li');
                li_block.innerText = i + 1;
                days.appendChild(li_block);
            }
            let lastDayOfWeek = F.getLastWeekInMonth(year, month);
            for (let i = 0; i < (6 - lastDayOfWeek); i++) {
                let li_none = document.createElement('li');
                days.appendChild(li_none)
            }
            const triggers = triggerCover.children;
            let thisMonthMaxDate = F.getLastDayInMonth(year,month);
            AddDays(thisMonthMaxDate , dataCycle);
            let currentDate = new Date();
            let lastPeriodDateStartTemp;
            // 预测经期处理显示
            // 预测安全期
            for(let i = 1; i <= F.getDaysInMonth(year,month); i++){
                if (new Date(Date.parse(month+"/"+i+"/"+year))>=new Date(Date.parse(lastPeriodDateStart))) {
                    triggers[i + firstDayOfWeek - 1].className='SafePeriod';
                }
            }
            // 预测易孕期
            for(lastPeriodDateStartTemp = new Date(Date.parse(lastPeriodDateStart));lastPeriodDateStartTemp<=thisMonthMaxDate;AddDays(lastPeriodDateStartTemp,dataCycle)){
                if (AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayStart * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayStart * -1).getFullYear() === year) {
                    for (let j = AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayStart * -1).getDate();
                         j<=F.getDaysInMonth(year,month)
                         && new Date(Date.parse(month + "/" + j + "/" + year)) <= AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayEnd * -1);
                         j++) {
                        triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                    }
                }
                if (AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayEnd * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayEnd * -1).getFullYear() === year) {
                    for (let j = AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayEnd * -1).getDate();
                         new Date(Date.parse(month + "/" + j + "/" + year)) >= AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), easyPregnancyDayStart * -1);
                         j--) {
                        triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                    }
                }
            }
            // 预测排卵日
            for(lastPeriodDateStartTemp = new Date(Date.parse(lastPeriodDateStart));lastPeriodDateStartTemp<=thisMonthMaxDate;AddDays(lastPeriodDateStartTemp,dataCycle)){
                if (AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), ovulationDay * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), ovulationDay * -1).getFullYear() === year) {
                    triggers[AddDays(new Date(Date.parse(lastPeriodDateStartTemp)), ovulationDay * -1).getDate() + firstDayOfWeek - 1].className = 'ovulation';
                }
            }
            // 预测经期
            for(lastPeriodDateStartTemp = new Date(Date.parse(lastPeriodDateStart));lastPeriodDateStartTemp<=thisMonthMaxDate;AddDays(lastPeriodDateStartTemp,dataCycle)){
                if(new Date(lastPeriodDateStartTemp).getMonth()+1===month
                    &&new Date(lastPeriodDateStartTemp).getFullYear()===year){
                    for(let j = new Date(lastPeriodDateStartTemp).getDate();
                        j<=F.getDaysInMonth(year,month)
                        && new Date(Date.parse(month+"/"+j+"/"+year))<AddDays(new Date(lastPeriodDateStartTemp),dataTime);
                        j++){
                        triggers[j + firstDayOfWeek - 1].className = 'PredictivePhysiological';
                    }
                }
                if(AddDays(new Date(lastPeriodDateStartTemp),dataTime).getMonth()+1===month
                    &&AddDays(new Date(lastPeriodDateStartTemp),dataTime).getFullYear()===year){
                    for(let j = AddDays(new Date(lastPeriodDateStartTemp),dataTime).getDate();
                        j >= 1
                        &&new Date(Date.parse(month+"/"+j+"/"+year))>new Date(lastPeriodDateStartTemp)
                        ;j--){
                        triggers[j + firstDayOfWeek - 1].className = 'PredictivePhysiological';
                    }
                }
            }

            // 经期数据处理显示
            // 安全期第一部分（经期开始前一周期）
            for (let i = 0; i<periodInfo.recordBeans.length;i++) {
                if (AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), dataCycle * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), dataCycle * -1).getFullYear() === year) {
                    for (let j = AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), dataCycle * -1).getDate();
                         j<=F.getDaysInMonth(year,month)
                         && triggers[j + firstDayOfWeek - 1].innerText
                         && new Date(Date.parse(month + "/" + j + "/" + year)) <= new Date(Date.parse(periodInfo.recordBeans[i].startDay));
                         j++) {
                        triggers[j + firstDayOfWeek - 1].className = 'SafePeriod';
                    }
                }
                if (new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getMonth() + 1 === month
                    && new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getFullYear() === year) {
                    for (let j = new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getDate();
                         j >= 1
                         && triggers[j + firstDayOfWeek - 1].innerText
                         && new Date(Date.parse(month + "/" + j + "/" + year)) >= AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)),dataCycle * -1);
                         j--) {
                        triggers[j + firstDayOfWeek - 1].className = 'SafePeriod';
                    }
                }
            }
            // 安全期第二部分（最早的经期开始记录到最后的经期开始记录）
            if(periodInfo.recordBeans.length > 1){
                for (let i = 1;i<=F.getDaysInMonth(year,month) && triggers[i + firstDayOfWeek - 1].innerText;i++) {
                    if(new Date(Date.parse(month + "/" + i + "/" + year)) < new Date(Date.parse(periodInfo.recordBeans[periodInfo.recordBeans.length-1].startDay))
                    && new Date(Date.parse(month + "/" + i + "/" + year)) > new Date(Date.parse(periodInfo.recordBeans[0].startDay))) {
                        triggers[i + firstDayOfWeek - 1].className = 'SafePeriod';
                    }
                }
            }
            // 易孕期
            for (let i = 0; i<periodInfo.recordBeans.length;i++) {
                if (AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayStart * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayStart * -1).getFullYear() === year) {
                    for (let j = AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayStart * -1).getDate();
                         j<=F.getDaysInMonth(year,month)
                         && new Date(Date.parse(month + "/" + j + "/" + year)) <= AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayEnd * -1);
                         j++) {
                        triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                    }
                }
                if (AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayEnd * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayEnd * -1).getFullYear() === year) {
                    for (let j = AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayEnd * -1).getDate();
                         j >= 1
                         && new Date(Date.parse(month + "/" + j + "/" + year)) >= AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), easyPregnancyDayStart * -1)
                        ; j--) {
                        triggers[j + firstDayOfWeek - 1].className = 'EasyPregnancy';
                    }
                }
            }
            // 排卵日
            for (let i = 0; i<periodInfo.recordBeans.length;i++) {
                if (AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), ovulationDay * -1).getMonth() + 1 === month
                    && AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), ovulationDay * -1).getFullYear() === year) {
                    triggers[AddDays(new Date(Date.parse(periodInfo.recordBeans[i].startDay)), ovulationDay * -1).getDate() + firstDayOfWeek - 1].className = 'ovulation';
                }
            }
            // 经期
            for (let i = 0; i<periodInfo.recordBeans.length;i++){
                if(new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getMonth()+1===month
                    &&new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getFullYear()===year){
                    if(periodInfo.recordBeans[i].endDay === "1997-01-01"){
                        for(let j = new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getDate();
                            j <= F.getDaysInMonth(year,month)
                            && j<=currentDate.getDate();j++){
                            triggers[j + firstDayOfWeek - 1].className = 'physiology';
                        }
                    }
                    for(let j = new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getDate();
                        j<=F.getDaysInMonth(year,month)
                        && triggers[j + firstDayOfWeek - 1].innerText
                        && new Date(Date.parse(month+"/"+j+"/"+year))<=new Date(Date.parse(periodInfo.recordBeans[i].endDay));
                        j++){
                        triggers[j + firstDayOfWeek - 1].className = 'physiology';
                    }
                }
                if(new Date(Date.parse(periodInfo.recordBeans[i].endDay)).getMonth()+1===month
                    &&new Date(Date.parse(periodInfo.recordBeans[i].startDay)).getFullYear()===year){
                    for(let j = new Date(Date.parse(periodInfo.recordBeans[i].endDay)).getDate();
                        j >= 1
                        && triggers[j + firstDayOfWeek - 1].innerText
                        && new Date(Date.parse(month+"/"+j+"/"+year))>=new Date(Date.parse(periodInfo.recordBeans[i].startDay))
                        ;j--){
                        triggers[j + firstDayOfWeek - 1].className = 'physiology';
                    }
                }
            }
            // 遮挡层1
            const that_day = document.querySelector('#that_day');
            const cover = document.getElementsByClassName('cover')[0];
            for (let i = 1; i <= F.getDaysInMonth(year,month); i++) {
                if (new Date(Date.parse(month+"/"+i+"/"+year))<=currentDate) {
                    (function(arg) {
                        triggers[arg + firstDayOfWeek - 1].addEventListener('click', function () {
                            for (let j = 1; j <= F.getDaysInMonth(year, month); j++) {
                                triggers[j + firstDayOfWeek - 1].style.border = 'none';
                            }
                            this.style.border = '2px solid #FF4F73';
                            cover.style.display = 'block';
                            that_day.innerHTML = '';
                            that_day.innerText = year + '年' + month + '月' + arg + '日';
                        })
                    })(i);
                }
            }
        }
        render();
        //左滑 右划
        let x1, x2;
        triggerCover.addEventListener('touchstart', function (e) {
            x1 = e.targetTouches[0].pageX;
            triggerCover.addEventListener('touchmove', function (e) {
                x2 = e.targetTouches[0].pageX;
            })
        });

        triggerCover.addEventListener('touchend', function () {
            let changeX = x2 - x1;
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
            let day = date.getDate();
            years.innerText = year + '年';
            months.innerText = month + '月';
            render();
            let firstDayOfWeek = F.getWeekInMonth(year, month);
            let triggers = triggerCover.children;
            triggers[day+firstDayOfWeek-1].style.border = '2px solid #FF4F73'
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
            render();
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
            render();
        }

        years.innerText = year + '年';
        months.innerText = month + '月';

        // 开关样式
        const on_off = document.querySelectorAll('.on_off');
        for (let i = 0; i < on_off.length; i++) {
            on_off[i].addEventListener('click', function () {

                let span = on_off[i].children[0];
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

        // 当天经期开始结束
        toDayOnOff.addEventListener('click', toDayOnOffFunction);
        function list() {
            let span1 = toDayOnOff_li.children[1];
            let span2 = toDayOnOff_li.children[2];
            // 当天经期开始结束
            if(lastPeriodDateStart===null||new Date()>new Date(Date.parse(lastPeriodDateEnd))){
                span1.innerText = '开始？';
                span2.style.backgroundColor = '#CCC4C2';
                span2.children[0].className = 'off';
            }
            if(lastPeriodDateStart===FormatDate(new Date())){
                span1.innerText = '开始？';
                span2.style.backgroundColor = '#FF4F73';
                span2.children[0].className = 'on';
            }
            if(lastPeriodDateEnd === '1997-01-01'&&new Date(FormatDate(new Date()))>new Date(Date.parse(lastPeriodDateStart))){
                span1.innerText = '结束？';
                span2.style.backgroundColor = '#CCC4C2';
                span2.children[0].className = 'off';
            }
            if(lastPeriodDateEnd===FormatDate(new Date())){
                span1.innerText = '结束？';
                span2.style.backgroundColor = '#FF4F73';
                span2.children[0].className = 'on';
            }
        }
        list();
        function toDayOnOffFunction() {
            if(lastPeriodDateStart===null||new Date()>new Date(Date.parse(lastPeriodDateEnd))){
                inPeriodData(0,1,1,1,FormatDate(new Date()));
            }
            if(lastPeriodDateStart===FormatDate(new Date())){
                inPeriodData(0,1,1,-1,FormatDate(new Date()));
            }
            if(lastPeriodDateEnd === '1997-01-01'&&new Date(FormatDate(new Date()))>new Date(Date.parse(lastPeriodDateStart))){
                inPeriodData(0,1,2,1,FormatDate(new Date()));
            }
            if(lastPeriodDateEnd===FormatDate(new Date())){
                inPeriodData(0,1,2,-1,FormatDate(new Date()));
            }
            getPeriodData();
            render();
            list();
        }

        //关闭遮挡层
        const close = document.querySelectorAll('.close');
        for (let k = 0; k < close.length; k++) {
            close[k].addEventListener('click', function () {
                this.parentNode.parentNode.parentNode.style.display = 'none';
            })
        }


        //遮挡层2

        const trigger_duration = document.getElementById('trigger_duration');
        const duration = document.getElementById('duration');
        trigger_duration.addEventListener('click', function () {
            duration.style.display = 'block';
        });
        //记录经期时长
        let duration_data;
        const modelBox_ul2 = document.querySelector('.modelBox_ul2');
        const modelBox_li2 = modelBox_ul2.children;
        for (let i = 0; i < modelBox_li2.length; i++) {
            modelBox_li2[i].addEventListener('click', function () {
                for (let j = 0; j < modelBox_li2.length; j++) {
                    modelBox_li2[j].className = 'modelBox_li2';
                }
                this.className = "modelBox_li2 active";
                duration_data=i+1;
                yes_duration.addEventListener('click', yes_duration_click);
            })
        }
        function yes_duration_click() {
            inPeriodDataRule(1,dataCycle,duration_data,lastPeriodDateStart);
            yes_duration.removeEventListener('click', yes_duration_click);
        }
        //遮挡层3
        //记录经期周期
        let cycle_data;
        const trigger_cycle = document.querySelector('#trigger_cycle');
        const cycle = document.querySelector('#cycle');
        trigger_cycle.addEventListener('click', function () {
            cycle.style.display = 'block';
        });
        const modelBox_ul3 = document.querySelector('.modelBox_ul3');
        const modelBox_li3 = modelBox_ul3.children;
        for (let i = 0; i < modelBox_li3.length; i++) {
            modelBox_li3[i].addEventListener('click', function () {
                for (let j = 0; j < modelBox_li3.length; j++) {
                    modelBox_li3[j].className = 'modelBox_li2';
                }
                this.className = "modelBox_li2 active";
                cycle_data=i+1;
                yes_cycle.addEventListener('click', yes_cycle_click);
            })
        }
        function yes_cycle_click() {
            inPeriodDataRule(1,cycle_data,dataTime,lastPeriodDateStart);
            yes_cycle.removeEventListener('click', yes_cycle_click);
        }
        //名词解释
        const explain = document.querySelector('.explain');
        const prompt = document.querySelector('.prompt');
        prompt.addEventListener('click', function () {
            explain.style.display = 'block'
        })
    }
})(window);
