var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="LayerView.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../layer/StarmapTemplateLayer.ts"/>
///<reference path="../../../nightsky/js/starmap/Starmap.ts"/>
var StarmapLayerView = (function (_super) {
    __extends(StarmapLayerView, _super);
    function StarmapLayerView(j$, layer, parentId, selfId, templateSizeProvider) {
        _super.call(this, j$, layer, parentId, selfId, templateSizeProvider);
    }
    StarmapLayerView.prototype.create = function () {
        _super.prototype.create.call(this);
        if (this.layer.hasBackgroundColor()) {
            var backgroundColor = this.layer.getBackgroundColor();
            this.style += "background-color:" + backgroundColor + ";";
        }
        this.layerContainer = this.j$("<div style='" + this.style + "'></div>");
        this.layerContainer.appendTo(this.j$("#" + this.parentId));
        this.canvas = this.j$("<canvas id='" + this.selfId + "' style='width: 100%; height: 100%;'></canvas>");
        //this.canvas = this.j$("<canvas id='planicanvas' style='width:700px; height: 700px;' width='700' height='700'></canvas>");
        this.canvas.appendTo(this.layerContainer);
        var starmap = new Starmap(this.j$, this.selfId);
        starmap.create();
        //setContainer(this.selfId);
        //canvasApp();
        this.onResize();
        //this.j$('input[id="user_dsos"]').prop("checked", true).trigger("change");
        //get_user_obs();
    };
    StarmapLayerView.prototype.onResize = function () {
        _super.prototype.onResize.call(this);
        this.layerContainer.height(this.layerContainer.width());
        var left = this.layerContainer.width() / 100 * parseInt(this.layer.getLeft());
        var right = this.layerContainer.width() / 100 * parseInt(this.layer.getRight());
        if (this.layer.hasTop()) {
            var top = this.currentHeight / 100 * parseInt(this.layer.getTop());
        }
        this.layerContainer.css({ "top": top });
        this.layerContainer.css({ "left": left });
        this.layerContainer.css({ "right": right });
        this.canvas.attr("width", this.layerContainer.width());
        this.canvas.attr("height", this.layerContainer.width());
        this.canvas.width(this.layerContainer.width() + "px");
        this.canvas.height(this.layerContainer.width() + "px");
        get_user_obs();
        /*
        this.canvas.attr("width", this.layerContainer.width());
        this.canvas.attr("height", this.layerContainer.width());

        this.canvas.width(this.layerContainer.width()+"px");
        this.canvas.height(this.layerContainer.width()+"px");
        */
    };
    return StarmapLayerView;
}(LayerView));
//# sourceMappingURL=StarmapLayerView.js.map