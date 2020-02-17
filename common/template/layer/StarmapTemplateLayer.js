var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var StarmapTemplateLayer = (function (_super) {
    __extends(StarmapTemplateLayer, _super);
    function StarmapTemplateLayer(aspectRatio, type, left, top, right, bottom, changeable, color, backgroundColor, constellationColor) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = false; }
        if (color === void 0) { color = "0"; }
        _super.call(this, aspectRatio, type, left, top, right, bottom, changeable);
        this.starsColor = color;
        this.backgroundColor = backgroundColor;
        this.constellationColor = constellationColor;
    }
    StarmapTemplateLayer.prototype.hasBackgroundColor = function () {
        if (this.backgroundColor != null && this.backgroundColor != undefined && this.backgroundColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapTemplateLayer.prototype.hasConstellationColor = function () {
        if (this.constellationColor != null && this.constellationColor != undefined && this.constellationColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapTemplateLayer.prototype.hasStarsColor = function () {
        if (this.starsColor != null && this.starsColor != undefined && this.starsColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapTemplateLayer.prototype.getBackgroundColor = function () {
        return this.backgroundColor;
    };
    StarmapTemplateLayer.prototype.getStarsColor = function () {
        return this.starsColor;
    };
    StarmapTemplateLayer.prototype.getConstellationColor = function () {
        return this.constellationColor;
    };
    return StarmapTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=StarmapTemplateLayer.js.map