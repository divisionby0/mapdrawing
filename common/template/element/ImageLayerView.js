var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/ImageTemplateLayer.ts"/>
var ImageLayerView = (function (_super) {
    __extends(ImageLayerView, _super);
    function ImageLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    ImageLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        var url = this.layer.getUrl();
        this.style += 'background-image:url("' + url + '"); background-size:cover;';
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    return ImageLayerView;
}(LayerView));
//# sourceMappingURL=ImageLayerView.js.map