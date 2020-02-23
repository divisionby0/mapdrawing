///<reference path="DateSelectModel.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
var DateSelectController = (function () {
    function DateSelectController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener(EditorEvent.SET_CURRENT_DATE_TIME, function () { return _this.onSetCurrentDateTimeRequest(); });
    }
    DateSelectController.prototype.onSetCurrentDateTimeRequest = function () {
        this.model.setCurrentDate();
    };
    return DateSelectController;
}());
//# sourceMappingURL=DateSelectController.js.map