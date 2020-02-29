///<reference path="TemplateElementView.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../layer/border/Border.ts"/>
///<reference path="../LayerId.ts"/>
var TemplateElementModel = (function () {
    function TemplateElementModel(view) {
        this.view = view;
    }
    TemplateElementModel.prototype.destroy = function () {
    };
    TemplateElementModel.prototype.setData = function (data) {
        this.data = data;
        this.view.setData(data);
    };
    TemplateElementModel.prototype.onTextChanged = function (data) {
        var layersIterator = this.data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var isTextLayer = layer instanceof TextTemplateLayer;
            if (isTextLayer) {
                var layerId = layer.getId();
                if (layerId == data.elementId) {
                    layer.setText(data.text.toUpperCase());
                }
            }
        }
    };
    TemplateElementModel.prototype.onBorderChanged = function (visible) {
        var layersIterator = this.data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var isDivLayer = layer instanceof DivTemplateLayer;
            if (isDivLayer) {
                var layerId = layer.getId();
                if (layerId == LayerId.BACKGROUND_BORDER) {
                    var currentBorder = layer.getBorder();
                    var borderParameters = Utils.parseBorderParameters(currentBorder);
                    if (visible == true) {
                        borderParameters.getRest()[0] = "solid";
                    }
                    else {
                        borderParameters.getRest()[0] = "none";
                    }
                    this.updateTemplateLayerBorder(layer, borderParameters.toCssString());
                }
            }
        }
    };
    TemplateElementModel.prototype.onCircleBorderChanged = function (visible) {
        var layersIterator = this.data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;
            if (isStarmapLayer) {
                var layerId = layer.getId();
                if (layerId == LayerId.STARMAP) {
                    layer.setBorderVisible(visible);
                }
            }
        }
    };
    TemplateElementModel.prototype.onConstellationsChanged = function (visible) {
        var layersIterator = this.data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;
            if (isStarmapLayer) {
                var layerId = layer.getId();
                /*
                if(layerId == TemplateLayer.STARMAP){
                    (layer as StarmapLayerModel).setConstellationVisible(visible);
                }
                */
                if (layerId == LayerId.STARMAP) {
                    layer.setConstellationVisible(visible);
                }
            }
        }
    };
    TemplateElementModel.prototype.onStarsChanged = function (isMulticolored) {
        var layersIterator = this.data.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;
            if (isStarmapLayer) {
                var layerId = layer.getId();
                if (layerId == LayerId.STARMAP) {
                    layer.setStarsMulticolored(isMulticolored);
                }
            }
        }
    };
    TemplateElementModel.prototype.updateTemplateLayerBorder = function (layer, css) {
        layer.setBorder(css);
    };
    return TemplateElementModel;
}());
//# sourceMappingURL=TemplateElementModel.js.map