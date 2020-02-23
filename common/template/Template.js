///<reference path="layer/TemplateLayer.ts"/>
var Template = (function () {
    function Template(name, preview, width, height, layers, aspectRatio) {
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    Template.prototype.setCity = function (city) {
        this.city = city;
    };
    Template.prototype.setLat = function (lat) {
        this.lat = lat;
    };
    Template.prototype.setLng = function (lng) {
        this.lng = lng;
    };
    Template.prototype.getCity = function () {
        return this.city;
    };
    Template.prototype.getLat = function () {
        return this.lat;
    };
    Template.prototype.getLng = function () {
        return this.lng;
    };
    Template.prototype.getPreview = function () {
        return this.preview;
    };
    Template.prototype.getLayersIterator = function () {
        return this.layers.getIterator();
    };
    Template.prototype.getPrintWidth = function () {
        return this.width;
    };
    Template.prototype.getPrintHeight = function () {
        return this.height;
    };
    Template.prototype.getAspectRatio = function () {
        return this.aspectRatio;
    };
    Template.ON_SELECT = "ON_SELECT";
    return Template;
}());
//# sourceMappingURL=Template.js.map