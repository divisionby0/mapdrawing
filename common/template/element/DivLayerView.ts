///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
class DivLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider){
        super(j$, layer, parentId,selfId,  templateSizeProvider);
    }
    
    protected create():void{
        super.create();

        if((this.layer as DivTemplateLayer).hasBackgroundColor()){
            this.style+="background-color:"+(this.layer as DivTemplateLayer).getBackgroundColor()+";";
        }
        if((this.layer as DivTemplateLayer).hasBorder()){
            this.style+="border:"+(this.layer as DivTemplateLayer).getBorder()+";";
        }

        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }

    protected onResize():void{
        super.onResize();
        console.log("width = "+this.currentWidth);
        console.log("height = "+this.currentHeight);
        
        //this.layerContainer.height(this.currentHeight);
    }
}
