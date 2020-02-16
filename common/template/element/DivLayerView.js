var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
var DivLayerView = (function (_super) {
    __extends(DivLayerView, _super);
    function DivLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    DivLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        if (this.layer.hasBackgroundColor()) {
            this.style += "background-color:" + this.layer.getBackgroundColor() + ";";
        }
        if (this.layer.hasBorder()) {
            var border = this.layer.getBorder();
            border = Utils.updateBorderString(border, this.coeff);
            this.style += "border:" + border + ";";
        }
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    return DivLayerView;
}(LayerView));
//# sourceMappingURL=DivLayerView.js.map