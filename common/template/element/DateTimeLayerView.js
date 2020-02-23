var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TextLayerView.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var DateTimeLayerView = (function (_super) {
    __extends(DateTimeLayerView, _super);
    function DateTimeLayerView() {
        _super.apply(this, arguments);
    }
    DateTimeLayerView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, function (data) { return _this.onDateTimeChanged(data); });
        EventBus.addEventListener(EditorEvent.DATE_VISIBILITY_CHANGED, function (data) { return _this.onDateVisibilityChanged(data); });
        EventBus.addEventListener(EditorEvent.TIME_VISIBILITY_CHANGED, function (data) { return _this.onTimeVisibilityChanged(data); });
    };
    DateTimeLayerView.prototype.onDateTimeChanged = function (data) {
        this.layerContainer.text(this.layer.getText());
    };
    DateTimeLayerView.prototype.onDateVisibilityChanged = function (data) {
        this.layerContainer.text(this.layer.getText());
    };
    DateTimeLayerView.prototype.onTimeVisibilityChanged = function (data) {
        this.layerContainer.text(this.layer.getText());
    };
    return DateTimeLayerView;
}(TextLayerView));
//# sourceMappingURL=DateTimeLayerView.js.map