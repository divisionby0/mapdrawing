var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../../element/LayerView.ts"/>
///<reference path="../DivTemplateLayer.ts"/>
///<reference path="./StarmapLayerModel.ts"/>
///<reference path="../../../../nightsky/js/starmap/Starmap.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
//declare var canvasApp:Function;
var StarmapLayerView = (function (_super) {
    __extends(StarmapLayerView, _super);
    function StarmapLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    StarmapLayerView.prototype.setDate = function (date) {
        this.j$("#user_date").val(date);
        this.starmap.setDate(date);
    };
    StarmapLayerView.prototype.onDestroy = function () {
        var _this = this;
        console.log("destroy()");
        EventBus.removeEventListener("UPDATE_STARMAP", function () { return _this.onUpdateStarmapRequest(); });
        if (this.starmap) {
            this.starmap.destroy();
            this.starmap = null;
        }
    };
    StarmapLayerView.prototype.create = function () {
        var backgroundColor = "";
        var starsColor = "";
        var constellationColor = "";
        var hasMulticoloredStars = false;
        var hasBorder = this.layer.hasBorder();
        if (this.layer.hasBackgroundColor()) {
            backgroundColor = this.layer.getBackgroundColor();
        }
        if (this.layer.hasStarsColor()) {
            starsColor = this.layer.getStarsColor();
        }
        if (this.layer.hasConstellationColor()) {
            constellationColor = this.layer.getConstellationColor();
        }
        hasMulticoloredStars = this.layer.getHasMulticoloredStars();
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.canvas = this.j$("<canvas id='" + this.selfId + "' style='position:absolute; width: 100%; height: 100%;'></canvas>");
        this.canvas.appendTo(this.layerContainer);
        this.starmap = new Starmap(this.j$, this.selfId, this.coeff);
        this.starmap.setBackgroundColor(backgroundColor);
        this.starmap.setStarColor(starsColor);
        this.starmap.setConstellationColor(constellationColor);
        this.starmap.setHasColoredStars(hasMulticoloredStars);
        this.starmap.setHasBorder(hasBorder);
        this.starmap.setBorderColor(this.layer.getBorderColor());
        this.starmap.setBorderWeight(this.layer.getBorderWeight());
        this.starmap.create();
        this.onResize();
        _super.prototype.create.call(this);
    };
    StarmapLayerView.prototype.onUpdateStarmapRequest = function () {
        if (this.starmap) {
            this.starmap.refresh();
        }
    };
    StarmapLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        this.layerContainer.height(this.layerContainer.width());
        var left = this.layerContainer.width() / 100 * parseInt(this.layer.getLeft());
        var right = this.layerContainer.width() / 100 * parseInt(this.layer.getRight());
        if (this.layer.hasTop()) {
            var top = this.currentHeight / 100 * parseInt(this.layer.getTop());
        }
        this.layerContainer.css({ "top": top });
        this.layerContainer.css({ "left": left });
        this.layerContainer.css({ "right": right });
        var newWidth = this.layerContainer.width();
        this.canvas.attr("width", newWidth);
        this.canvas.attr("height", newWidth);
        this.canvas.width(newWidth + "px");
        this.canvas.height(newWidth + "px");
        this.starmap.resize(newWidth, newWidth);
        this.starmap.refresh();
    };
    return StarmapLayerView;
}(LayerView));
//# sourceMappingURL=StarmapLayerView.js.map