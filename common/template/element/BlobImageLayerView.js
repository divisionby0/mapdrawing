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
        this.printWidth = 2481;
        this.printHeight = 3509;
    }
    BlobImageLayerView.prototype.create = function () {
        var url = this.layer.getUrl();
        this.style += 'left:' + this.layer.getLeft() + '; right:' + this.layer.getRight() + '; top:' + this.layer.getTop() + '; bottom:' + this.layer.getBottom() + ';';
        //var imageWidth:number = this.printWidth - this.printWidth/100*parseFloat(this.layer.getLeft()) - this.printWidth/100*parseFloat(this.layer.getRight());
        //var imageHeight:number = this.printHeight - this.printHeight/100*parseFloat(this.layer.getTop()) - this.printHeight/100*parseFloat(this.layer.getBottom());
        var border = this.layer.getBorder();
        border = Utils.updateBorderString(border, this.coeff);
        this.style += "; border:" + border + ";";
        var img = this.j$("<img src='" + url + "' style='width:100%; height:100%'>");
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.append(img);
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    return BlobImageLayerView;
}(ImageLayerView));
//# sourceMappingURL=BlobImageLayerView.js.map