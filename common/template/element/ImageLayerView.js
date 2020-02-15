var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/ImageTemplateLayer.ts"/>
var ImageLayerView = (function (_super) {
    __extends(ImageLayerView, _super);
    function ImageLayerView(j$, layer, parentId, selfId, templateSizeProvider) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider);
    }
    ImageLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        var url = this.layer.getUrl();
        this.style += 'background-image:url("' + url + '"); background-size:cover;';
        console.log("style=" + this.style);
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    ImageLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        console.log("width = " + this.currentWidth);
        console.log("height = " + this.currentHeight);
        //this.layerContainer.height(this.currentHeight);
        //this.image.height(this.currentHeight);
    };
    return ImageLayerView;
}(LayerView));
//# sourceMappingURL=ImageLayerView.js.map