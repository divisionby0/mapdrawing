///<reference path="StarmapLayerModel.ts"/>
var StarmapLayerController = (function () {
    function StarmapLayerController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, function (date) { return _this.onDateTimeChanged(date); });
    }
    StarmapLayerController.prototype.onDateTimeChanged = function (date) {
        this.model.onDateTimeChanged(date);
    };
    return StarmapLayerController;
}());
//# sourceMappingURL=StarmapLayerController.js.map