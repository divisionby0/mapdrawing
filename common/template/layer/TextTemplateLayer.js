var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var TextTemplateLayer = (function (_super) {
    __extends(TextTemplateLayer, _super);
    function TextTemplateLayer(id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = true; }
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
        this.fontWeight = fontWeight;
    }
    TextTemplateLayer.prototype.getText = function () {
        return this.text;
    };
    TextTemplateLayer.prototype.getColor = function () {
        return this.color;
    };
    TextTemplateLayer.prototype.getFontSize = function () {
        return this.fontSize;
    };
    TextTemplateLayer.prototype.getTextAlign = function () {
        return this.textAlign;
    };
    TextTemplateLayer.prototype.getFontWeight = function () {
        return this.fontWeight;
    };
    return TextTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=TextTemplateLayer.js.map