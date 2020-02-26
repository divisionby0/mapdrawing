var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="Template.ts"/>
var MapTemplate = (function (_super) {
    __extends(MapTemplate, _super);
    function MapTemplate() {
        _super.apply(this, arguments);
    }
    MapTemplate.prototype.getCountry = function () {
        return this.country;
    };
    MapTemplate.prototype.setCountry = function (country) {
        this.country = country;
    };
    return MapTemplate;
}(Template));
//# sourceMappingURL=MapTemplate.js.map