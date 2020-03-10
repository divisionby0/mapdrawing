///<reference path="LayerView.ts"/>
///<reference path="../layer/ImageTemplateLayer.ts"/>
class ImageLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected create():void{
        //super.create();
        var url:string = (this.layer as ImageTemplateLayer).getUrl();

        this.style+='background-image:url("'+url+'"); background-size:cover;';

        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");

        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }
}
