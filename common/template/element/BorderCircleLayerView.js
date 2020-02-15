var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/BorderCircleTemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
var BorderCircleLayerView = (function (_super) {
    __extends(BorderCircleLayerView, _super);
    function BorderCircleLayerView(j$, layer, parentId, selfId, templateSizeProvider) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider);
    }
    BorderCircleLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        this.style += "border-radius:" + this.layer.getRadius() + "; width:" + this.layer.getWidth() + "; border:" + this.layer.getBorder() + ";";
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.onResize();
    };
    BorderCircleLayerView.prototype.onResize = function () {
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
    };
    return BorderCircleLayerView;
}(LayerView));
//# sourceMappingURL=BorderCircleLayerView.js.map