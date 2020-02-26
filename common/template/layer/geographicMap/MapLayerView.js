var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../element/LayerView.ts"/>
///<reference path="../TemplateLayer.ts"/>
///<reference path="../../../../printmap/js/geographicMap/GeographicMap.ts"/>
///<reference path="MapLayerModel.ts"/>
///<reference path="../../../lib/Utils.ts"/>
var MapLayerView = (function (_super) {
    __extends(MapLayerView, _super);
    function MapLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff, zoom, mapStyle, position) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
        this.zoom = zoom;
        this.position = position;
        this.mapStyle = mapStyle;
        this.createMap();
    }
    MapLayerView.prototype.setZoom = function (zoom) {
        if (this.map) {
            this.map.setZoom(zoom);
        }
    };
    MapLayerView.prototype.setMapStyle = function (style) {
        if (this.map) {
            this.map.setStyle(style);
        }
    };
    MapLayerView.prototype.setPosition = function (position) {
        this.position = position;
        if (this.map) {
            this.map.setPosition(position);
        }
    };
    MapLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        if (this.layerContainer) {
            var left = this.layerContainer.width() / 100 * parseInt(this.layer.getLeft());
            var right = this.layerContainer.width() / 100 * parseInt(this.layer.getRight());
            // TODO какая-то путаница с border в расчетах - разобраться
            var top = 0;
            var bottom = 0;
            if (this.layer.hasTop()) {
                top = this.currentHeight / 100 * parseInt(this.layer.getTop());
            }
            if (this.layer.hasBottom()) {
                bottom = this.currentHeight / 100 * parseInt(this.layer.getBottom());
            }
            this.layerContainer.css({ "left": left });
            this.layerContainer.css({ "right": right });
            this.layerContainer.css({ "top": top });
            this.layerContainer.css({ "bottom": bottom });
            this.layerContainer.height(this.currentHeight - top - bottom);
            this.layerContainer.width(this.currentWidth - left - right);
        }
    };
    MapLayerView.prototype.create = function () {
        // do nothing
    };
    MapLayerView.prototype.createMap = function () {
        var parameters = { zoom: this.zoom, position: this.position, style: this.mapStyle };
        var border = this.layer.getBorder();
        if (border) {
            border = Utils.updateBorderString(border, this.coeff);
            this.style += "border:" + border + ";";
        }
        console.log("createMap style=" + this.style);
        this.layerContainer = this.j$("<div id='map' style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.map = new GeographicMap(this.j$, parameters);
        this.onResize();
    };
    return MapLayerView;
}(LayerView));
//# sourceMappingURL=MapLayerView.js.map