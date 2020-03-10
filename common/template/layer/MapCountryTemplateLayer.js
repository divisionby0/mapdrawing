var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CountryTemplateLayer.ts"/>
var MapCountryTemplateLayer = (function (_super) {
    __extends(MapCountryTemplateLayer, _super);
    function MapCountryTemplateLayer() {
        _super.apply(this, arguments);
    }
    MapCountryTemplateLayer.prototype.onCityChanged = function (data) {
        var country = data.country;
        if (country && country != "") {
            this.text = country.toUpperCase();
        }
        else if (country == "") {
            this.text = "";
        }
    };
    return MapCountryTemplateLayer;
}(CountryTemplateLayer));
//# sourceMappingURL=MapCountryTemplateLayer.js.map