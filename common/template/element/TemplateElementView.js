///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="DivLayerView.ts"/>
///<reference path="TextLayerView.ts"/>
///<reference path="BorderCircleLayerView.ts"/>
///<reference path="StarmapLayerView.ts"/>
///<reference path="ImageLayerView.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
///<reference path="CityLayerView.ts"/>
///<reference path="CoordinatesLayerView.ts"/>
var TemplateElementView = (function () {
    function TemplateElementView(j$, parentContainerId, selfContainerId, coeff) {
        this.j$ = j$;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        this.coeff = coeff;
    }
    TemplateElementView.prototype.getTemplateWidth = function () {
        return this.j$("#" + this.parentContainerId).outerWidth();
    };
    TemplateElementView.prototype.getTemplateHeight = function () {
        var aspectRatio = parseFloat(this.data.getAspectRatio());
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
                    new DivLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.TEXT_LAYER_TYPE:
                    new TextLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.CITY_LAYER_TYPE:
                    new CityLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.COORDINATES_LAYER_TYPE:
                    new CoordinatesLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.IMAGE_LAYER_TYPE:
                    new ImageLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.BORDER_CIRCLE_LAYER_TYPE:
                    new BorderCircleLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.STARMAP_LAYER_TYPE:
                    new StarmapLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
            }
        }
        this.j$("#" + this.parentContainerId).height(this.getTemplateHeight());
    };
    return TemplateElementView;
}());
//# sourceMappingURL=TemplateElementView.js.map