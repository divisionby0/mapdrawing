var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var DivTemplateLayer = (function (_super) {
    __extends(DivTemplateLayer, _super);
    function DivTemplateLayer(id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border) {
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = true; }
        if (backgroundColor === void 0) { backgroundColor = ""; }
        if (backgroundAlpha === void 0) { backgroundAlpha = ""; }
        if (border === void 0) { border = ""; }
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.backgroundColor = backgroundColor;
        this.backgroundAlpha = backgroundAlpha;
        this.border = border;
    }
    DivTemplateLayer.prototype.hasBackgroundColor = function () {
        if (this.backgroundColor != null && this.backgroundColor != undefined && this.backgroundColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    DivTemplateLayer.prototype.hasBackgroundAlpha = function () {
        if (this.backgroundAlpha != null && this.backgroundAlpha != undefined && this.backgroundAlpha != "") {
            return true;
        }
        else {
            return false;
        }
    };
    DivTemplateLayer.prototype.hasBorder = function () {
        if (this.border != null && this.border != undefined && this.border != "") {
            return true;
        }
        else {
            return false;
        }
    };
    DivTemplateLayer.prototype.getBackgroundColor = function () {
        return this.backgroundColor;
    };
    DivTemplateLayer.prototype.getBackgroundAlpha = function () {
        return this.backgroundAlpha;
    };
    DivTemplateLayer.prototype.getBorder = function () {
        return this.border;
    };
    DivTemplateLayer.prototype.setBorder = function (border) {
        this.border = border;
    };
    return DivTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=DivTemplateLayer.js.map