///<reference path="Template.ts"/>
///<reference path="layer/LayerType.ts"/>
///<reference path="layer/TextTemplateLayer.ts"/>
class TemplateUtil{
    public static getCurrentCity(template:Template):string{
        var layersIterator:ListIterator = template.getLayersIterator();
        while(layersIterator.hasNext()){
            var templateLayer:TemplateLayer = layersIterator.next();
            
            //var layerId:string = templateLayer.getId();
            var layerType:string = templateLayer.getType();
            if(layerType == LayerType.CITY_LAYER_TYPE){
                return (templateLayer as TextTemplateLayer).getText();
            }
        }
        
        return "";
    }
}
