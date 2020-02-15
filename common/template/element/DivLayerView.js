var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
var DivLayerView = (function (_super) {
    __extends(DivLayerView, _super);
    function DivLayerView(j$, layer, parentId, selfId, templateSizeProvider) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider);
    }
    DivLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        if (this.layer.hasBackgroundColor()) {
            this.style += "background-color:" + this.layer.getBackgroundColor() + ";";
        }
        if (this.layer.hasBorder()) {
            this.style += "border:" + this.layer.getBorder() + ";";
        }
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    DivLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        console.log("width = " + this.currentWidth);
        console.log("height = " + this.currentHeight);
        //this.layerContainer.height(this.currentHeight);
    };
    return DivLayerView;
}(LayerView));
//# sourceMappingURL=DivLayerView.js.map