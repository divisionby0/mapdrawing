///<reference path="LayerView.ts"/>
///<reference path="../layer/ImageTemplateLayer.ts"/>
class ImageLayerView extends LayerView{
    private image:any;
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider){
        super(j$, layer, parentId, selfId,  templateSizeProvider);
    }

    protected create():void{
        super.create();
        var url:string = (this.layer as ImageTemplateLayer).getUrl();

        this.style+='background-image:url("'+url+'"); background-size:cover;';

        console.log("style="+this.style);
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }

    protected onResize():void{
        super.onResize();

        console.log("width = "+this.currentWidth);
        console.log("height = "+this.currentHeight);
        
       //this.layerContainer.height(this.currentHeight);
        //this.image.height(this.currentHeight);
    }
}
