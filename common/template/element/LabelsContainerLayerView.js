var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="DivLayerView.ts"/>
var LabelsContainerLayerView = (function (_super) {
    __extends(LabelsContainerLayerView, _super);
    function LabelsContainerLayerView() {
        _super.apply(this, arguments);
    }
    LabelsContainerLayerView.prototype.createContainer = function () {
        this.layerContainer = this.j$("<div id='" + this.layer.getId() + "' style='" + this.style + "' class='labelsContainer'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
    };
    return LabelsContainerLayerView;
}(DivLayerView));
//# sourceMappingURL=LabelsContainerLayerView.js.map