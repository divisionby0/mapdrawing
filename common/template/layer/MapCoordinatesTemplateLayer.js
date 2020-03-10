var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CoordinatesTemplateLayer.ts"/>
var MapCoordinatesTemplateLayer = (function (_super) {
    __extends(MapCoordinatesTemplateLayer, _super);
    function MapCoordinatesTemplateLayer() {
        _super.apply(this, arguments);
    }
    MapCoordinatesTemplateLayer.prototype.onCoordinatesChanged = function (data) {
        var coordinates = parseFloat(data[0]).toFixed(5) + " " + parseFloat(data[1]).toFixed(5);
        this.text = coordinates;
    };
    return MapCoordinatesTemplateLayer;
}(CoordinatesTemplateLayer));
//# sourceMappingURL=MapCoordinatesTemplateLayer.js.map