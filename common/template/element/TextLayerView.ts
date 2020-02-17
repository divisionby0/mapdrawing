///<reference path="LayerView.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
class TextLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected create():void{
        super.create();

        var text:string = (this.layer as TextTemplateLayer).getText();
        var color:string = (this.layer as TextTemplateLayer).getColor();
        var fontSize:string = (this.layer as TextTemplateLayer).getFontSize();
        var fontWeight:string = (this.layer as TextTemplateLayer).getFontWeight();

        var textAlign:string = (this.layer as TextTemplateLayer).getTextAlign();
        
        if(fontWeight==null || fontWeight==undefined || fontWeight==""){
            fontWeight="normal";
        }
        if(textAlign==null || textAlign==undefined || textAlign==""){
            textAlign="center";
        }

        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);

        this.style+="color:"+color+"; font-size:"+fontSize+"; text-align:"+textAlign+"; font-weight:"+fontWeight+";";
        console.log("style="+this.style);
        this.layerContainer = this.j$("<div style='"+this.style+"'>"+text+"</div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }

    protected onResize():void{
        super.onResize();
        var topIsProcents:boolean = this.hasProcents(this.layer.getTop());

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
