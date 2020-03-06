var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="MapLayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
var MapLayerModel = (function (_super) {
    __extends(MapLayerModel, _super);
    function MapLayerModel(id, aspectRatio, type, left, top, right, bottom, border, changeable, zoom, styles, position, bounds) {
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.styles = new Array();
        this.placeLabelsVisible = false;
        this.styles = styles;
        this.border = border;
        this.currentMapParameters = new MapParameters(this.styles[0], parseFloat(zoom), position, bounds, 0, 0);
    }
    MapLayerModel.prototype.getZoom = function () {
        return this.currentMapParameters.getZoom();
    };
    MapLayerModel.prototype.getCenter = function () {
        return this.currentMapParameters.getCenter();
    };
    MapLayerModel.prototype.getMapParameters = function () {
        return this.currentMapParameters;
    };
    MapLayerModel.prototype.coordinatesChanged = function (data) {
        var center = data[2];
        var zoom = data[3];
        var bounds = data[4];
        this.currentMapParameters.setCenter(center);
        this.currentMapParameters.setZoom(zoom);
        this.currentMapParameters.setBounds(bounds);
    };
    MapLayerModel.prototype.locationChanged = function (coord) {
        this.currentMapParameters.setCenter(coord);
        if (this.view) {
            this.view.setPosition(this.currentMapParameters.getCenter());
        }
        else {
            console.error("View not set yet. Cannot apply new position.");
        }
    };
    MapLayerModel.prototype.placeLabelsVisibilityChanged = function (visible) {
        this.placeLabelsVisible = visible;
        if (visible) {
            this.mapStyle = this.styles[1];
        }
        else {
            this.mapStyle = this.styles[0];
        }
        this.currentMapParameters.setStyle(this.mapStyle);
        if (this.view) {
            this.view.setMapStyle(this.mapStyle);
        }
    };
    MapLayerModel.prototype.getBorder = function () {
        return this.border;
    };
    MapLayerModel.prototype.getMapStyle = function () {
        return this.mapStyle;
    };
    return MapLayerModel;
}(TemplateLayer));
//# sourceMappingURL=MapLayerModel.js.map