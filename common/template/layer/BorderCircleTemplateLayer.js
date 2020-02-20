var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var BorderCircleTemplateLayer = (function (_super) {
    __extends(BorderCircleTemplateLayer, _super);
    function BorderCircleTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, radius, width, color, border) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (radius === void 0) { radius = "0"; }
        if (width === void 0) { width = "0"; }
        if (color === void 0) { color = "0"; }
        if (border === void 0) { border = ""; }
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.radius = radius;
        this.width = width;
        this.color = color;
        this.border = border;
    }
    BorderCircleTemplateLayer.prototype.getRadius = function () {
        return this.radius;
    };
    BorderCircleTemplateLayer.prototype.getWidth = function () {
        return this.width;
    };
    BorderCircleTemplateLayer.prototype.getColor = function () {
        return this.color;
    };
    BorderCircleTemplateLayer.prototype.getBorder = function () {
        return this.border;
    };
    return BorderCircleTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=BorderCircleTemplateLayer.js.map