var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CityTemplateLayer.ts"/>
var MapCityTemplateLayer = (function (_super) {
    __extends(MapCityTemplateLayer, _super);
    function MapCityTemplateLayer(id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        _super.call(this, id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
    }
    MapCityTemplateLayer.prototype.onCityChanged = function (data) {
        var city = data.city;
        if (city != "") {
            this.text = city;
        }
    };
    return MapCityTemplateLayer;
}(CityTemplateLayer));
//# sourceMappingURL=MapCityTemplateLayer.js.map