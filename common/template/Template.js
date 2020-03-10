///<reference path="layer/TemplateLayer.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/geographicMap/MapLayerModel.ts"/>
///<reference path="layer/CityTemplateLayer.ts"/>
///<reference path="layer/CountryTemplateLayer.ts"/>
///<reference path="layer/CoordinatesTemplateLayer.ts"/>
var Template = (function () {
    function Template(name, preview, width, height, layers, aspectRatio) {
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    Template.prototype.getDefaultCity = function () {
        var city = "";
        var country = "";
        var coord = "";
        var iterator = this.getLayersIterator();
        while (iterator.hasNext()) {
            var layer = iterator.next();
            if (layer.getType() == LayerType.CITY_LAYER_TYPE) {
                city = layer.getText();
            }
            if (layer.getType() == LayerType.COUNTRY_LAYER_TYPE) {
                country = layer.getText();
            }
            if (layer.getType() == LayerType.MAP_LAYER_TYPE) {
                coord = layer.getCenter();
            }
        }
        return { coord: coord, country: country, city: city };
    };
    Template.prototype.getName = function () {
        return this.name;
    };
    Template.prototype.setName = function (name) {
        this.name = name;
    };
    Template.prototype.addLayer = function (layer) {
        this.layers.add(layer);
    };
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
    Template.prototype.totalLayers = function () {
        return this.layers.size();
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