var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CityLayerView.ts"/>
var CoordinatesLayerView = (function (_super) {
    __extends(CoordinatesLayerView, _super);
    function CoordinatesLayerView() {
        _super.apply(this, arguments);
    }
    CoordinatesLayerView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, function (coord) { return _this.onCoordinatesChanged(coord); });
        EventBus.addEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, function (data) { return _this.onCoordinatesVisibilityChanged(data); });
    };
    CoordinatesLayerView.prototype.onCoordinatesChanged = function (data) {
        var coordinates = data[0] + " " + data[1];
        this.layerContainer.text(coordinates);
    };
    CoordinatesLayerView.prototype.onCoordinatesVisibilityChanged = function (data) {
        var visible = data.visible;
        if (visible) {
            this.layerContainer.show();
        }
        else {
            this.layerContainer.hide();
        }
    };
    return CoordinatesLayerView;
}(CityLayerView));
//# sourceMappingURL=CoordinatesLayerView.js.map