///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
var LayerView = (function () {
    function LayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        var _this = this;
        this.style = "position:absolute;";
        this.j$ = j$;
        this.layer = layer;
        this.parentId = parentId;
        this.selfId = selfId;
        this.templateWidthProvider = templateSizeProvider;
        this.coeff = coeff;
        this.createListeners();
        this.create();
        this.j$(window).resize(function () { return _this.onResize(); });
        this.onResize();
    }
    LayerView.prototype.destroy = function () {
        this.onDestroy();
    };
    LayerView.prototype.create = function () {
        if (this.layer.hasLeft()) {
            this.style += "left:" + this.layer.getLeft() + ";";
        }
        if (this.layer.hasRight()) {
            this.style += "right:" + this.layer.getRight() + ";";
        }
        if (this.layer.hasTop()) {
            this.style += "top:" + this.layer.getTop() + ";";
        }
        if (this.layer.hasBottom()) {
            this.style += "bottom:" + this.layer.getBottom() + ";";
        }
    };
    LayerView.prototype.calculateHeight = function () {
        this.currentWidth = this.templateWidthProvider.getTemplateWidth();
        var aspectRatio = this.layer.getAspectRatio();
        this.currentHeight = this.templateWidthProvider.getTemplateHeight();
    };
    LayerView.prototype.onResize = function () {
        this.calculateHeight();
    };
    LayerView.prototype.createListeners = function () {
    };
    LayerView.prototype.onDestroy = function () {
    };
    return LayerView;
}());
//# sourceMappingURL=LayerView.js.map