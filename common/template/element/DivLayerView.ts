///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
class DivLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId,selfId,  templateSizeProvider, coeff);
    }
    
    protected create():void{
        super.create();

        if((this.layer as DivTemplateLayer).hasBackgroundColor()){
            this.style+="background-color:"+(this.layer as DivTemplateLayer).getBackgroundColor()+";";
        }
        if((this.layer as DivTemplateLayer).hasBorder()){
            var border:string = (this.layer as DivTemplateLayer).getBorder();

            border = Utils.updateBorderString(border, this.coeff);
            this.style+="border:"+border+";";
        }

        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }
}
