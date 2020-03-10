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
        this.left = 0;
        this.right = 0;
        this.top = 0;
        this.bottom = 0;
        var params = layer.getMapParameters();
        params.setContainer(this.selfId);
        var border = this.layer.getBorder();
        if (border) {
            border = Utils.updateBorderString(border, this.coeff);
            this.style += "border:" + border + ";";
        }
        this.layerContainer = this.j$("<div id='" + this.selfId + "' style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.map = new GeographicMap(this.j$, params, this.layer.getLeft(), this.layer.getRight(), this.layer.getTop(), this.layer.getBottom());
        this.onResize();
    }
    MapLayerView.prototype.setMapStyle = function (style) {
        if (this.map) {
            this.map.setStyle(style);
        }
    };
    MapLayerView.prototype.setPosition = function (position) {
        if (this.map) {
            this.map.setPosition(position);
        }
    };
    MapLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        if (this.layerContainer) {
            this.left = this.layerContainer.width() / 100 * parseInt(this.layer.getLeft());
            this.right = this.layerContainer.width() / 100 * parseInt(this.layer.getRight());
            // TODO какая-то путаница с border в расчетах - разобраться
            this.top = 0;
            this.bottom = 0;
            if (this.layer.hasTop()) {
                this.top = this.currentHeight / 100 * parseInt(this.layer.getTop());
            }
            if (this.layer.hasBottom()) {
                this.bottom = this.currentHeight / 100 * parseInt(this.layer.getBottom());
            }
            this.layerContainer.css({ "left": this.left });
            this.layerContainer.css({ "right": this.right });
            this.layerContainer.css({ "top": this.top });
            this.layerContainer.css({ "bottom": this.bottom });
            var layerWidth;
            var layerHeight;
            if (this.coeff == 1) {
                layerWidth = (this.currentWidth - this.left - this.right) * this.coeff;
                layerHeight = (this.currentHeight - this.top - this.bottom) * this.coeff;
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