var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TextTemplateLayer.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
var CityTemplateLayer = (function (_super) {
    __extends(CityTemplateLayer, _super);
    function CityTemplateLayer(id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        _super.call(this, id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.createListener();
    }
    CityTemplateLayer.prototype.onDestroy = function () {
        var _this = this;
        EventBus.removeEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
        EventBus.removeEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, function (data) { return _this.onCityVisibilityChanged(data); });
    };
    CityTemplateLayer.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
        EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, function (data) { return _this.onCityVisibilityChanged(data); });
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, function (text) { return _this.onText_1_changed(text); });
    };
    CityTemplateLayer.prototype.onCityChanged = function (data) {
        var city = data.city;
        this.text = city;
    };
    CityTemplateLayer.prototype.onCityVisibilityChanged = function (data) {
        this.visible = data.visible;
    };
    CityTemplateLayer.prototype.onText_1_changed = function (text) {
        this.text = text.toUpperCase();
    };
    return CityTemplateLayer;
}(TextTemplateLayer));
//# sourceMappingURL=CityTemplateLayer.js.map