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
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onLocationChanged(data); });
    };
    MapLayerController.prototype.onLocationChanged = function (data) {
        console.log("LOCATION changed data=", data);
        this.model.locationChanged(data.coord);
    };
    return MapLayerController;
}());
//# sourceMappingURL=MapLayerController.js.map