///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
var DateSelectView = (function () {
    function DateSelectView(j$) {
        var _this = this;
        this.j$ = j$;
        this.j$("#currentTimeButton").click(function () { return _this.onCurrentTimeButtonClicked(); });
    }
    DateSelectView.prototype.setDate = function (data) {
        this.createDatepicker(data);
    };
    DateSelectView.prototype.createDatepicker = function (currentDate) {
        var _this = this;
        this.j$("#datepicker").val(currentDate.day + "-" + currentDate.month + "-" + currentDate.year);
        this.j$("#datepicker").datepicker({
            dateFormat: "dd-mm-yy",
            monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
            dayNamesMin: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
        });
        this.j$("#hourInput").val(currentDate.hour);
        this.j$("#minuteInput").val(currentDate.minute);
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
    DateSelectView.prototype.onCurrentTimeButtonClicked = function () {
        EventBus.dispatchEvent(EditorEvent.SET_CURRENT_DATE_TIME, null);
    };
    DateSelectView.prototype.createUserDate = function () {
        var userDate = this.j$("#datepicker").val();
        var userHours = this.j$("#hourInput").val();
        var userMinutes = this.j$("#minuteInput").val();
        var userSelectedDate = userDate + " " + userHours + ":" + userMinutes;
        var day;
        var month;
        var year;
        var jsDate = this.j$('#datepicker').datepicker('getDate');
        if (jsDate !== null) {
            jsDate instanceof Date; // -> true
            day = jsDate.getDate();
            month = parseInt(jsDate.getMonth()) + 1; // TODO эта единица переводит на 1 месяц врепед - разобраться. НО уменьшать надо чтобы получить правильные названия месяцев
            year = jsDate.getFullYear();
        }
        return { day: day, month: month, year: year, hours: userHours, minutes: userMinutes };
    };
    DateSelectView.prototype.onUserDateChanged = function (newDate) {
        EventBus.dispatchEvent(EditorEvent.DATE_TIME_CHANGED, newDate);
    };
    return DateSelectView;
}());
//# sourceMappingURL=DateSelectView.js.map