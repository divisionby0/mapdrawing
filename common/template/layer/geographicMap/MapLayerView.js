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
    function MapLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
        console.log("new MapLayerView coeff=", this.coeff);
        var params = layer.getMapParameters();
        params.setContainer(this.selfId);
        var border = this.layer.getBorder();
        if (border) {
            border = Utils.updateBorderString(border, this.coeff);
            this.style += "border:" + border + ";";
        }
        this.layerContainer = this.j$("<div id='" + this.selfId + "' style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.map = new GeographicMap(this.j$, params);
        this.onResize();
    }
    MapLayerView.prototype.setMapStyle = function (style) {
        /*
        if(this.map){
            this.map.setStyle(style);
        }
        */
    };
    MapLayerView.prototype.setPosition = function (position) {
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
            var layerWidth;
            var layerHeight;
            if (this.coeff == 1) {
                layerWidth = (this.currentWidth - left - right) * this.coeff;
                layerHeight = (this.currentHeight - top - bottom) * this.coeff;
            }
            else {
                layerWidth = 2481;
                layerHeight = 3509;
            }
            //var layerWidth:number = (this.currentWidth - left - right)*this.coeff;
            //var layerHeight:number = (this.currentHeight - top - bottom)*this.coeff;
            this.layerContainer.width(layerWidth);
            this.layerContainer.height(layerHeight);
            if (this.map) {
                this.map.resize(layerWidth, layerHeight);
            }
        }
    };
    return MapLayerView;
}(LayerView));
//# sourceMappingURL=MapLayerView.js.map