///<reference path="LayerView.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
class TextLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider){
        super(j$, layer, parentId, selfId,  templateSizeProvider);
    }

    protected create():void{
        super.create();

        var text:string = (this.layer as TextTemplateLayer).getText();
        var color:string = (this.layer as TextTemplateLayer).getColor();
        var fontSize:string = (this.layer as TextTemplateLayer).getFontSize();

        this.style+="color:"+color+"; font-size:"+fontSize+"; text-align:"+(this.layer as TextTemplateLayer).getTextAlign()+";";

        console.log("style="+this.style);

        this.layerContainer = this.j$("<div style='"+this.style+"'>"+text+"</div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }

    protected onResize():void{
        super.onResize();

        //console.log("TextLayer on resize borders left="+this.layer.getLeft()+" right="+this.layer.getRight()+" top="+this.layer.getTop()+" bottom="+this.layer.getBottom());
        
        var topIsProcents:Boolean = this.hasProcents(this.layer.getTop());

        if(topIsProcents){
            var topProcentsValue:number = parseInt(this.layer.getTop().split("%")[0]);
            var topValuePixels:number = this.currentHeight*topProcentsValue/100;
            this.layerContainer.css({'top':topValuePixels+"px"});
        }
    }

    private hasProcents(value:string):boolean{
        if(value.indexOf("%")!=-1){
            return true;
        }
        else{
            return false;
        }
    }
}
