///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="ITemplateSizeProvider.ts"/>
class LayerView{
    protected j$:any;
    protected layer:TemplateLayer;
    protected parentId:string;
    protected selfId:string;
    protected currentWidth:number;
    protected style:string = "position:absolute;";
    protected layerContainer:any;
    
    protected currentHeight:number;
    protected templateWidthProvider:ITemplateSizeProvider;
    protected coeff:number;
    
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        this.j$ = j$;
        this.layer = layer;
        this.parentId = parentId;
        this.selfId = selfId;
        this.templateWidthProvider = templateSizeProvider;
        this.coeff = coeff;
        this.createListeners();
        this.create();
        this.j$( window ).resize(()=>this.onResize());
        
        this.onResize();
    }

    protected create():void {
        if(this.layer.hasLeft()){
            this.style+="left:"+this.layer.getLeft()+";";
        }
        if(this.layer.hasRight()){
            this.style+="right:"+this.layer.getRight()+";";
        }
        if(this.layer.hasTop()){
            this.style+="top:"+this.layer.getTop()+";";
        }
        if(this.layer.hasBottom()){
            this.style+="bottom:"+this.layer.getBottom()+";";
        }
    }

    protected calculateHeight():void{
        this.currentWidth = this.templateWidthProvider.getTemplateWidth();
        var aspectRatio:number = this.layer.getAspectRatio();
        this.currentHeight = this.templateWidthProvider.getTemplateHeight();
    }
    
    protected onResize():void{
        this.calculateHeight();
    }
    
    protected createListeners():void{
        
    }
}
