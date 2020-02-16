var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
var TextLayerView = (function (_super) {
    __extends(TextLayerView, _super);
    function TextLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    TextLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        var text = this.layer.getText();
        var color = this.layer.getColor();
        var fontSize = this.layer.getFontSize();
        var fontSizeIntVal = parseFloat(fontSize);
        var pointsIndex = fontSize.indexOf(fontSizeIntVal.toString()) + fontSizeIntVal.toString().length;
        var points = fontSize.substring(pointsIndex, fontSize.length);
        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);
        /*(fontSizeIntVal*this.coeff).toFixed(2)).toString()+""+points;*/
        this.style += "color:" + color + "; font-size:" + fontSize + "; text-align:" + this.layer.getTextAlign() + ";";
        this.layerContainer = this.j$("<div style='" + this.style + "'>" + text + "</div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    TextLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        var topIsProcents = this.hasProcents(this.layer.getTop());
        if (topIsProcents) {
            var topProcentsValue = parseInt(this.layer.getTop().split("%")[0]);
            var topValuePixels = this.currentHeight * topProcentsValue / 100;
            this.layerContainer.css({ 'top': topValuePixels + "px" });
        }
    };
    TextLayerView.prototype.hasProcents = function (value) {
        if (value.indexOf("%") != -1) {
            return true;
        }
        else {
            return false;
        }
    };
    return TextLayerView;
}(LayerView));
//# sourceMappingURL=TextLayerView.js.map