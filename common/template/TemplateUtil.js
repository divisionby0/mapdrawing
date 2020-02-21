///<reference path="Template.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/TextTemplateLayer.ts"/>
var TemplateUtil = (function () {
    function TemplateUtil() {
    }
    TemplateUtil.getCurrentCity = function (template) {
        var layersIterator = template.getLayersIterator();
        while (layersIterator.hasNext()) {
            var templateLayer = layersIterator.next();
            //var layerId:string = templateLayer.getId();
            var layerType = templateLayer.getType();
            if (layerType == LayerType.CITY_LAYER_TYPE) {
                return templateLayer.getText();
            }
        }
        return "";
    };
    return TemplateUtil;
}());
//# sourceMappingURL=TemplateUtil.js.map