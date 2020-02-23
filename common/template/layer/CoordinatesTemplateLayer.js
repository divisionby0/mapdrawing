var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CityTemplateLayer.ts"/>
var CoordinatesTemplateLayer = (function (_super) {
    __extends(CoordinatesTemplateLayer, _super);
    function CoordinatesTemplateLayer() {
        _super.apply(this, arguments);
    }
    CoordinatesTemplateLayer.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, function (coord) { return _this.onCoordinatesChanged(coord); });
        EventBus.addEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, function (data) { return _this.onCoordinatesVisibilityChanged(data); });
    };
    CoordinatesTemplateLayer.prototype.onCoordinatesChanged = function (data) {
        var coordinates = data[0] + " " + data[1];
        this.text = coordinates;
    };
    CoordinatesTemplateLayer.prototype.onCoordinatesVisibilityChanged = function (data) {
        this.visible = data.visible;
    };
    return CoordinatesTemplateLayer;
}(CityTemplateLayer));
//# sourceMappingURL=CoordinatesTemplateLayer.js.map