var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var ImageTemplateLayer = (function (_super) {
    __extends(ImageTemplateLayer, _super);
    function ImageTemplateLayer(aspectRatio, type, url, left, top, right, bottom, changeable) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = false; }
        _super.call(this, aspectRatio, type, left, top, right, bottom, changeable);
        this.url = url;
    }
    ImageTemplateLayer.prototype.getUrl = function () {
        return this.url;
    };
    return ImageTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=ImageTemplateLayer.js.map