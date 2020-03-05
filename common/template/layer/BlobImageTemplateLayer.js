var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="ImageTemplateLayer.ts"/>
var BlobImageTemplateLayer = (function (_super) {
    __extends(BlobImageTemplateLayer, _super);
    function BlobImageTemplateLayer(id, aspectRatio, type, url, left, top, right, bottom, changeable, border) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = false; }
        _super.call(this, id, aspectRatio, type, url, left, top, right, bottom, changeable);
        this.border = border;
    }
    BlobImageTemplateLayer.prototype.getBorder = function () {
        return this.border;
    };
    return BlobImageTemplateLayer;
}(ImageTemplateLayer));
//# sourceMappingURL=BlobImageTemplateLayer.js.map