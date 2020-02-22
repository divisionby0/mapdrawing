var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../LayerId.ts"/>
var DivLayerView = (function (_super) {
    __extends(DivLayerView, _super);
    function DivLayerView(j$, layer, parentId, selfId, templateSizeProvider, coeff) {
        var _this = this;
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider, coeff);
        EventBus.addEventListener(EditorEvent.BORDER_CHANGED, function (value) { return _this.onBorderExistenceChanged(value); });
    }
    DivLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        if (this.layer.hasBackgroundColor()) {
            this.style += "background-color:" + this.layer.getBackgroundColor() + ";";
        }
        if (this.layer.hasBorder()) {
            var border = this.layer.getBorder();
            border = Utils.updateBorderString(border, this.coeff);
            this.style += "border:" + border + ";";
        }
        this.layerContainer = this.j$("<div id='" + this.layer.getId() + "' style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    DivLayerView.prototype.onBorderExistenceChanged = function (exists) {
        if (this.layer.getId() == LayerId.BACKGROUND_BORDER) {
            if (exists) {
                this.layerContainer.show();
            }
            else {
                this.layerContainer.hide();
            }
        }
    };
    return DivLayerView;
}(LayerView));
//# sourceMappingURL=DivLayerView.js.map