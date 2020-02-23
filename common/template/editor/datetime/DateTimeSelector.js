///<reference path="DateSelectView.ts"/>
///<reference path="DateSelectModel.ts"/>
///<reference path="DateSelectController.ts"/>
var DateTimeSelector = (function () {
    function DateTimeSelector(j$) {
        this.j$ = j$;
        var dateSelectView = new DateSelectView(this.j$);
        var dateSelectModel = new DateSelectModel(dateSelectView);
        this.controller = new DateSelectController(dateSelectModel);
        this.createListener();
    }
    DateTimeSelector.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, function (newDate) { return _this.onDateTimeChanged(newDate); });
    };
    DateTimeSelector.prototype.onDateTimeChanged = function (newDate) {
        var userDate = new Date();
        userDate.setFullYear(newDate.year);
        userDate.setMonth(newDate.month);
        userDate.setDate(newDate.day);
        userDate.setHours(newDate.hours);
        userDate.setMinutes(newDate.minutes);
        this.controller.setDateTime(userDate.toString());
    };
    return DateTimeSelector;
}());
//# sourceMappingURL=DateTimeSelector.js.map