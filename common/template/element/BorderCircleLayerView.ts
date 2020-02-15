///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/BorderCircleTemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
class BorderCircleLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider){
        super(j$, layer, parentId,selfId,  templateSizeProvider);
    }

    protected create():void{
        super.create();

        this.style+="border-radius:"+(this.layer as BorderCircleTemplateLayer).getRadius()+"; width:"+(this.layer as BorderCircleTemplateLayer).getWidth()+"; border:"+(this.layer as DivTemplateLayer).getBorder()+";";
        
        this.layerContainer = this.j$("<div style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        this.onResize();
    }

    protected onResize():void{
        super.onResize();
        
        this.layerContainer.height(this.layerContainer.width());

        var left:any = this.layerContainer.width()/100 * parseInt(this.layer.getLeft());
        var right:any = this.layerContainer.width()/100 * parseInt(this.layer.getRight());

        if(this.layer.hasTop()){
            var top:any = this.currentHeight / 100 * parseInt(this.layer.getTop());
        }

        this.layerContainer.css({"top":top});
        this.layerContainer.css({"left":left});
        this.layerContainer.css({"right":right});

        
    }
}
