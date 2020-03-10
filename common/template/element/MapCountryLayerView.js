var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="CountryLayerView.ts"/>
///<reference path="../layer/MapCountryTemplateLayer.ts"/>
var MapCountryLayerView = (function (_super) {
    __extends(MapCountryLayerView, _super);
    function MapCountryLayerView() {
        _super.apply(this, arguments);
    }
    MapCountryLayerView.prototype.onCountryTextChanged = function (text) {
        this.layerContainer.text(text.toUpperCase());
    };
    MapCountryLayerView.prototype.onCountryChanged = function (data) {
        var country = data.country;
        this.layerContainer.text(country.toUpperCase());
    };
    MapCountryLayerView.prototype.create = function () {
        this.style = "";
        this.id = this.layer.getId();
        var text = this.layer.getText();
        var color = this.layer.getColor();
        var fontSize = this.layer.getFontSize();
        var fontWeight = this.layer.getFontWeight();
        var textAlign = this.layer.getTextAlign();
        if (fontWeight == null || fontWeight == undefined || fontWeight == "") {
            fontWeight = "normal";
        }
        if (textAlign == null || textAlign == undefined || textAlign == "") {
            textAlign = "center";
        }
        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);
        this.style += "color:" + color + "; font-size:" + fontSize + "; text-align:" + textAlign + "; font-weight:" + fontWeight + ";";
        this.layerContainer = this.j$("<div id='" + this.id + "' style='" + this.style + "' class='mapLabel'>" + text + "</div>");
        var labelsContainer;
        if (this.coeff == 1) {
            labelsContainer = this.j$(".labelsContainer");
        }
        else {
            labelsContainer = this.j$(".labelsContainer")[1];
        }
        this.layerContainer.appendTo(labelsContainer);
    };
    return MapCountryLayerView;
}(CountryLayerView));
//# sourceMappingURL=MapCountryLayerView.js.map