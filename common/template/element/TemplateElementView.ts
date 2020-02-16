///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="DivLayerView.ts"/>
///<reference path="TextLayerView.ts"/>
///<reference path="BorderCircleLayerView.ts"/>
///<reference path="StarmapLayerView.ts"/>
///<reference path="ImageLayerView.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
class TemplateElementView implements ITemplateSizeProvider{
    private j$:any;
    private parentContainerId:string;
    private selfContainerId:string;
    private data:Template;
    private coeff:number;
    
    constructor(j$:any, parentContainerId:string, selfContainerId:string, coeff:number){
        this.j$ = j$;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        this.coeff = coeff;
        console.log("TemplateElementView coeff="+this.coeff);
    }

    public getTemplateWidth():number{
        return this.j$("#"+this.parentContainerId).outerWidth();
    }
    public getTemplateHeight():number{
        var aspectRatio:any = parseFloat(this.data.getAspectRatio());
        return this.getTemplateWidth()*aspectRatio;
    }

    public setData(data:Template):void{
        this.data = data;
        var layersIterator:ListIterator = data.getLayersIterator();
        
        while(layersIterator.hasNext()){
            var layer:TemplateLayer = layersIterator.next();
            
            var layerType:string = layer.getType();
            
            switch(layerType){
                case LayerType.DIV_LAYER_TYPE:
                    new DivLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
                    break;
                case LayerType.TEXT_LAYER_TYPE:
                    new TextLayerView(this.j$, layer, this.parentContainerId, this.selfContainerId, this, this.coeff);
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
        
        this.j$("#"+this.parentContainerId).height(this.getTemplateHeight());
    }
}

