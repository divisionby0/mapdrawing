///<reference path="layer/TemplateLayer.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/geographicMap/MapLayerModel.ts"/>
var Template = (function () {
    function Template(name, preview, width, height, layers, aspectRatio) {
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    Template.prototype.getName = function () {
        return this.name;
    };
    Template.prototype.setName = function (name) {
        this.name = name;
    };
    Template.prototype.addLayer = function (layer) {
        this.layers.add(layer);
    };
    /*
    public setMapParameters(parameters:any):void{
        this.mapParameters = parameters;
    }
    */
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
    Template.prototype.setPrintWidth = function (width) {
        this.width = width;
    };
    Template.prototype.getPrintHeight = function () {
        return this.height;
    };
    Template.prototype.setPrintHeight = function (height) {
        this.height = height;
    };
    Template.prototype.getAspectRatio = function () {
        return this.aspectRatio;
    };
    Template.prototype.setAspectRatio = function (ar) {
        this.aspectRatio = ar;
    };
    Template.ON_SELECT = "ON_SELECT";
    return Template;
}());
//# sourceMappingURL=Template.js.map