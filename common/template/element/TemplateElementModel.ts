///<reference path="TemplateElementView.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../layer/border/Border.ts"/>
///<reference path="../LayerId.ts"/>
class TemplateElementModel{
    
    private view:TemplateElementView;    
    private data:Template;
    
    constructor(view:TemplateElementView){
        this.view = view;
    }
    
    public destroy():void{
        
    }
    
    public setData(data:Template):void{
        this.data = data;
        this.view.setData(data);
    }
    
    public onTextChanged(data:any):void{
        var layersIterator:ListIterator = this.data.getLayersIterator();

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            var isTextLayer = layer instanceof TextTemplateLayer;
            if(isTextLayer){
                var layerId:string = layer.getId();
                if(layerId == data.elementId){
                    (layer as TextTemplateLayer).setText(data.text.toUpperCase());
                }
            }
        }
    }

    public onBorderChanged(visible:boolean):void {
        var layersIterator:ListIterator = this.data.getLayersIterator();

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            var isDivLayer = layer instanceof DivTemplateLayer;

            if(isDivLayer){
                var layerId:string = layer.getId();
                if(layerId == LayerId.BACKGROUND_BORDER){
                    var currentBorder:string = (layer as DivTemplateLayer).getBorder();
                    
                    var borderParameters:Border = Utils.parseBorderParameters(currentBorder);

                    if(visible == true){
                        borderParameters.getRest()[0] = "solid";
                    }
                    else{
                        borderParameters.getRest()[0] = "none";
                    }

                    this.updateTemplateLayerBorder((layer as DivTemplateLayer), borderParameters.toCssString());
                }
            }
        }
    }

    public onCircleBorderChanged(visible:boolean):void {
        var layersIterator:ListIterator = this.data.getLayersIterator();

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;

            if(isStarmapLayer){
                var layerId:string = layer.getId();
                if(layerId == LayerId.STARMAP){
                    (layer as StarmapLayerModel).setBorderVisible(visible);
                }
            }
        }
    }

    public onConstellationsChanged(visible:boolean):void {
        var layersIterator:ListIterator = this.data.getLayersIterator();

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;

            if(isStarmapLayer){
                var layerId:string = layer.getId();
                /*
                if(layerId == TemplateLayer.STARMAP){
                    (layer as StarmapLayerModel).setConstellationVisible(visible);
                }
                */
                if(layerId == LayerId.STARMAP){
                    (layer as StarmapLayerModel).setConstellationVisible(visible);
                }
            }
        }
    }

    public onStarsChanged(isMulticolored:boolean):void {
        var layersIterator:ListIterator = this.data.getLayersIterator();

        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            var isStarmapLayer = layer instanceof StarmapLayerModel;

            if(isStarmapLayer){
                var layerId:string = layer.getId();
                if(layerId == LayerId.STARMAP){
                    (layer as StarmapLayerModel).setStarsMulticolored(isMulticolored);
                }
            }
        }
    }


    private updateTemplateLayerBorder(layer:DivTemplateLayer, css:string):void{
        layer.setBorder(css);
    }
}
