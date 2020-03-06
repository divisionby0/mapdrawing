var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="ImageLayerView.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../layer/BlobImageTemplateLayer.ts"/>
var BlobImageLayerView = (function (_super) {
    __extends(BlobImageLayerView, _super);
    function BlobImageLayerView() {
        _super.apply(this, arguments);
    }
    BlobImageLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        var url = this.layer.getUrl();
        this.style += 'background-image:url("' + url + '"); background-size:cover;';
        var border = this.layer.getBorder();
        border = Utils.updateBorderString(border, this.coeff);
        this.style += "; border:" + border + ";";
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    return BlobImageLayerView;
}(ImageLayerView));
//# sourceMappingURL=BlobImageLayerView.js.map