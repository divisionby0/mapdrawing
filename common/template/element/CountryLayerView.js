var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CityLayerView.ts"/>
var CountryLayerView = (function (_super) {
    __extends(CountryLayerView, _super);
    function CountryLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    CountryLayerView.prototype.onCityChanged = function (data) {
        console.log("onCityChanged data=", data);
        var country = data.country;
        this.layerContainer.text(country);
    };
    return CountryLayerView;
}(CityLayerView));
//# sourceMappingURL=CountryLayerView.js.map