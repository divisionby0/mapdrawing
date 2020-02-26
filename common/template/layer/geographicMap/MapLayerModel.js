var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="MapLayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
var MapLayerModel = (function (_super) {
    __extends(MapLayerModel, _super);
    function MapLayerModel(id, aspectRatio, type, left, top, right, bottom, border, changeable, zoom, styles, position) {
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.styles = new Array();
        this.placeLabelsVisible = false;
        this.border = border;
        this.zoom = zoom;
        this.styles = styles;
        this.position = position;
        this.mapStyle = this.styles[0];
    }
    MapLayerModel.prototype.setView = function (view) {
        _super.prototype.setView.call(this, view);
        this.view.setZoom(this.zoom);
        this.view.setPosition(this.position);
        this.view.setMapStyle(this.mapStyle);
    };
    MapLayerModel.prototype.locationChanged = function (coord) {
        this.position = coord;
        if (this.view) {
            this.view.setPosition(this.position);
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
        if (this.view) {
            this.view.setMapStyle(this.mapStyle);
        }
    };
    MapLayerModel.prototype.getBorder = function () {
        return this.border;
    };
    MapLayerModel.prototype.getZoom = function () {
        return this.zoom;
    };
    MapLayerModel.prototype.getPosition = function () {
        return this.position;
    };
    MapLayerModel.prototype.getMapStyle = function () {
        return this.mapStyle;
    };
    return MapLayerModel;
}(TemplateLayer));
//# sourceMappingURL=MapLayerModel.js.map