///<reference path="TemplateElementModel.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
var TemplateElementController = (function () {
    function TemplateElementController(model, data) {
        this.model = model;
        this.model.setData(data);
        this.createListeners();
    }
    TemplateElementController.prototype.destroy = function () {
        var _this = this;
        EventBus.removeEventListener(EditorEvent.TEXT_1_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.removeEventListener(EditorEvent.TEXT_2_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.removeEventListener(EditorEvent.BORDER_CHANGED, function (data) { return _this.onBorderChanged(data); });
        EventBus.removeEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, function (data) { return _this.onCircleBorderChanged(data); });
        EventBus.removeEventListener(EditorEvent.CONSTELLATIONS_CHANGED, function (data) { return _this.onConstellationsChanged(data); });
        EventBus.removeEventListener(EditorEvent.STARS_CHANGED, function (data) { return _this.onStarsChanged(data); });
        this.model.destroy();
    };
    TemplateElementController.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.addEventListener(EditorEvent.BORDER_CHANGED, function (data) { return _this.onBorderChanged(data); });
        EventBus.addEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, function (data) { return _this.onCircleBorderChanged(data); });
        EventBus.addEventListener(EditorEvent.CONSTELLATIONS_CHANGED, function (data) { return _this.onConstellationsChanged(data); });
        EventBus.addEventListener(EditorEvent.STARS_CHANGED, function (data) { return _this.onStarsChanged(data); });
    };
    TemplateElementController.prototype.onTextChanged = function (data) {
        this.model.onTextChanged(data);
    };
    TemplateElementController.prototype.onBorderChanged = function (visible) {
        this.model.onBorderChanged(visible);
    };
    TemplateElementController.prototype.onCircleBorderChanged = function (visible) {
        this.model.onCircleBorderChanged(visible);
    };
    TemplateElementController.prototype.onConstellationsChanged = function (visible) {
        this.model.onConstellationsChanged(visible);
    };
    TemplateElementController.prototype.onStarsChanged = function (isMulticolored) {
        this.model.onStarsChanged(isMulticolored);
    };
    return TemplateElementController;
}());
//# sourceMappingURL=TemplateElementController.js.map