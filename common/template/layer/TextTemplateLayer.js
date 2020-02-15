var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TemplateLayer.ts"/>
var TextTemplateLayer = (function (_super) {
    __extends(TextTemplateLayer, _super);
    function TextTemplateLayer(aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = true; }
        if (textAlign === void 0) { textAlign = "center"; }
        _super.call(this, aspectRatio, type, left, top, right, bottom, changeable);
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
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
    return TextTemplateLayer;
}(TemplateLayer));
//# sourceMappingURL=TextTemplateLayer.js.map