///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="DivLayerView.ts"/>
///<reference path="TextLayerView.ts"/>
///<reference path="BorderCircleLayerView.ts"/>
///<reference path="StarmapLayerView.ts"/>
///<reference path="ImageLayerView.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
var TemplateElementView = (function () {
    function TemplateElementView(j$, parentContainerId, selfContainerId) {
        this.j$ = j$;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        console.log("this.parentContainerId=" + this.parentContainerId);
    }
    TemplateElementView.prototype.getTemplateWidth = function () {
        return this.j$("#" + this.parentContainerId).outerWidth();
    };
    TemplateElementView.prototype.getTemplateHeight = function () {
        var aspectRatio = parseFloat(this.data.getAspectRatio());
        console.log("aspectRatio=" + aspectRatio);
        return this.getTemplateWidth() * aspectRatio;
    };
    TemplateElementView.prototype.setData = function (data) {
        this.data = data;
        var layersIterator = data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var layerType = layer.getType();
            switch (layerType) {
                case LayerType.DIV_LAYER_TYPE:
                    new DivLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this);
                    break;
                case LayerType.TEXT_LAYER_TYPE:
                    new TextLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this);
                    break;
                case LayerType.IMAGE_LAYER_TYPE:
                    new ImageLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this);
                    break;
                case LayerType.BORDER_CIRCLE_LAYER_TYPE:
                    new BorderCircleLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this);
                    break;
                case LayerType.STARMAP_LAYER_TYPE:
                    new StarmapLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this);
                    break;
            }
        }
        this.j$("#" + this.parentContainerId).height(this.getTemplateHeight());
    };
    return TemplateElementView;
}());
//# sourceMappingURL=TemplateElementView.js.map