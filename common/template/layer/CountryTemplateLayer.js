var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="TextTemplateLayer.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var CountryTemplateLayer = (function (_super) {
    __extends(CountryTemplateLayer, _super);
    function CountryTemplateLayer() {
        _super.apply(this, arguments);
    }
    CountryTemplateLayer.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, function (text) { return _this.onText_2_changed(text); });
    };
    CountryTemplateLayer.prototype.onText_2_changed = function (text) {
        this.text = text;
    };
    return CountryTemplateLayer;
}(TextTemplateLayer));
//# sourceMappingURL=CountryTemplateLayer.js.map