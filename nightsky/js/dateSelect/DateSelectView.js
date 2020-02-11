var DateSelectView = (function () {
    function DateSelectView(j$) {
        this.j$ = j$;
        this.createDatepicker();
    }
    DateSelectView.prototype.createDatepicker = function () {
        var _this = this;
        var todayDate = new Date();
        var day = todayDate.getUTCDate().toString();
        var month = (parseInt(todayDate.getMonth()) + 1).toString();
        var year = todayDate.getFullYear().toString();
        var hour = todayDate.getHours().toString();
        var minute = todayDate.getMinutes().toString();
        if (day.length < 2) {
            day = "0" + day;
        }
        if (month.length < 2) {
            month = "0" + month;
        }
        console.log("hour:minute=" + hour + ":" + minute);
        if (hour.length < 2) {
            hour = "0" + hour;
        }
        if (minute.length < 2) {
            minute = "0" + minute;
        }
        this.j$("#datepicker").val(day + "-" + month + "-" + year);
        this.j$("#datepicker").datepicker({
            dateFormat: "dd-mm-yy",
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        });
        this.j$("#hourInput").val(hour);
        this.j$("#minuteInput").val(minute);
        this.j$("#datepicker").change(function () { return _this.onDateChanged(); });
        this.j$("#hourInput").change(function () { return _this.onHourChanged(); });
        this.j$("#minuteInput").change(function () { return _this.onMinuteChanged(); });
        var userDate = this.createUserDate();
        this.onUserDateChanged(userDate);
    };
    DateSelectView.prototype.onDateChanged = function () {
        var userDate = this.createUserDate();
        this.onUserDateChanged(userDate);
    };
    DateSelectView.prototype.onHourChanged = function () {
        var userDate = this.createUserDate();
        this.onUserDateChanged(userDate);
    };
    DateSelectView.prototype.onMinuteChanged = function () {
        var userDate = this.createUserDate();
        this.onUserDateChanged(userDate);
    };
    DateSelectView.prototype.createUserDate = function () {
        var userDate = this.j$("#datepicker").val();
        var userHours = this.j$("#hourInput").val();
        var userMinutes = this.j$("#minuteInput").val();
        var userSelectedDate = userDate + " " + userHours + ":" + userMinutes;
        console.log(userSelectedDate);
        var day;
        var month;
        var year;
        var jsDate = this.j$('#datepicker').datepicker('getDate');
        if (jsDate !== null) {
            jsDate instanceof Date; // -> true
            day = jsDate.getDate();
            month = parseInt(jsDate.getMonth()) + 1;
            year = jsDate.getFullYear();
        }
        return { day: day, month: month, year: year, hours: userHours, minutes: userMinutes };
    };
    DateSelectView.prototype.onUserDateChanged = function (newDate) {
        EventBus.dispatchEvent("ON_USER_DATE_CHANGED", newDate);
    };
    return DateSelectView;
}());
//# sourceMappingURL=DateSelectView.js.map