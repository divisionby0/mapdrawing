var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="DivTemplateLayer.ts"/>
var LabelsContainerTemplateLayer = (function (_super) {
    __extends(LabelsContainerTemplateLayer, _super);
    function LabelsContainerTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border) {
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = true; }
        if (backgroundColor === void 0) { backgroundColor = ""; }
        if (backgroundAlpha === void 0) { backgroundAlpha = ""; }
        if (border === void 0) { border = ""; }
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border);
    }
    return LabelsContainerTemplateLayer;
}(DivTemplateLayer));
//# sourceMappingURL=LabelsContainerTemplateLayer.js.map