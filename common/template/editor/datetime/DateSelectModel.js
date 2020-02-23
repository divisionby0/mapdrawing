///<reference path="DateSelectView.ts"/>
var DateSelectModel = (function () {
    function DateSelectModel(view) {
        this.view = view;
        this.currentDate = this.createCurrentDate();
        this.view.setDate(this.currentDate);
    }
    DateSelectModel.prototype.setCurrentDate = function () {
        var todayDate = new Date();
        this.currentDate = this.parseDate(todayDate);
        this.view.setDate(this.currentDate);
    };
    DateSelectModel.prototype.createCurrentDate = function () {
        var todayDate = new Date();
        todayDate.setHours(12);
        todayDate.setMinutes(0);
        return this.parseDate(todayDate);
    };
    DateSelectModel.prototype.parseDate = function (date) {
        var day = date.getUTCDate().toString();
        var month = (parseInt(date.getMonth()) + 1).toString();
        var year = date.getFullYear().toString();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        if (day.length < 2) {
            day = "0" + day;
        }
        if (month.length < 2) {
            month = "0" + month;
        }
        if (hour.length < 2) {
            hour = "0" + hour;
        }
        if (minute.length < 2) {
            minute = "0" + minute;
        }
        var retValue = { day: day, month: month, year: year, hour: hour, minute: minute };
        return retValue;
    };
    return DateSelectModel;
}());
//# sourceMappingURL=DateSelectModel.js.map