var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var TextLayerView = (function (_super) {
    __extends(TextLayerView, _super);
    function TextLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
    }
    TextLayerView.prototype.onDestroy = function () {
        var _this = this;
        EventBus.removeEventListener(EditorEvent.TEXT_1_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.removeEventListener(EditorEvent.TEXT_2_CHANGED, function (data) { return _this.onTextChanged(data); });
    };
    TextLayerView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, function (data) { return _this.onTextChanged(data); });
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, function (data) { return _this.onTextChanged(data); });
    };
    TextLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        this.id = this.layer.getId();
        var text = this.layer.getText();
        var color = this.layer.getColor();
        var fontSize = this.layer.getFontSize();
        var fontWeight = this.layer.getFontWeight();
        var textAlign = this.layer.getTextAlign();
        if (fontWeight == null || fontWeight == undefined || fontWeight == "") {
            fontWeight = "normal";
        }
        if (textAlign == null || textAlign == undefined || textAlign == "") {
            textAlign = "center";
        }
        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);
        this.style += "color:" + color + "; font-size:" + fontSize + "; text-align:" + textAlign + "; font-weight:" + fontWeight + ";";
        this.layerContainer = this.j$("<div id='" + this.id + "' style='" + this.style + "'>" + text + "</div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        if (this.layer.isVisible()) {
            this.layerContainer.show();
        }
        else {
            this.layerContainer.hide();
        }
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
    TextLayerView.prototype.onTextChanged = function (data) {
        var text = data.text;
        var elementId = data.elementId;
        var textElement = this.j$("#" + elementId);
        textElement.text(text);
    };
    return TextLayerView;
}(LayerView));
//# sourceMappingURL=TextLayerView.js.map