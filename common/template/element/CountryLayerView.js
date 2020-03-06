var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TextLayerView.ts"/>
var CountryLayerView = (function (_super) {
    __extends(CountryLayerView, _super);
    function CountryLayerView() {
        _super.apply(this, arguments);
    }
    CountryLayerView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCountryChanged(data); });
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, function (data) { return _this.onCountryTextChanged(data); });
    };
    CountryLayerView.prototype.onCountryTextChanged = function (text) {
        this.layerContainer.text(text.toUpperCase());
    };
    CountryLayerView.prototype.onCountryChanged = function (data) {
        var country = data.country;
        this.layerContainer.text(country.toUpperCase());
    };
    return CountryLayerView;
}(TextLayerView));
//# sourceMappingURL=CountryLayerView.js.map