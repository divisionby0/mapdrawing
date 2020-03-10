var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TextTemplateLayer.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var CountryTemplateLayer = (function (_super) {
    __extends(CountryTemplateLayer, _super);
    function CountryTemplateLayer(id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        _super.call(this, id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.createListener();
    }
    CountryTemplateLayer.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, function (text) { return _this.onText_2_changed(text); });
    };
    CountryTemplateLayer.prototype.onText_2_changed = function (text) {
        this.text = text.toUpperCase();
    };
    CountryTemplateLayer.prototype.onCityChanged = function (data) {
        var country = data.country;
        if (country && country != "") {
            this.text = country.toUpperCase();
        }
    };
    return CountryTemplateLayer;
}(TextTemplateLayer));
//# sourceMappingURL=CountryTemplateLayer.js.map