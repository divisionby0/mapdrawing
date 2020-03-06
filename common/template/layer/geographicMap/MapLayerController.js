///<reference path="MapLayerModel.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../../editor/EditorEvent.ts"/>
var MapLayerController = (function () {
    function MapLayerController(model) {
        this.model = model;
        this.createListeners();
    }
    MapLayerController.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, function (data) { return _this.onCoordinatesChanged(data); });
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onLocationChanged(data); });
        EventBus.addEventListener(EditorEvent.PLACE_LABELS_CHANGED, function (visible) { return _this.onPlaceLabelsChanged(visible); });
    };
    MapLayerController.prototype.onLocationChanged = function (data) {
        this.model.locationChanged(data.coord);
    };
    MapLayerController.prototype.onPlaceLabelsChanged = function (visible) {
        this.model.placeLabelsVisibilityChanged(visible);
    };
    MapLayerController.prototype.onCoordinatesChanged = function (data) {
        this.model.coordinatesChanged(data);
    };
    return MapLayerController;
}());
//# sourceMappingURL=MapLayerController.js.map