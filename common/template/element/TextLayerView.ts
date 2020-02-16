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
        
        var fontSizeIntVal:number = parseFloat(fontSize);
        var pointsIndex:number = fontSize.indexOf(fontSizeIntVal.toString())+fontSizeIntVal.toString().length;
        var points:string = fontSize.substring(pointsIndex, fontSize.length);

        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);
        /*(fontSizeIntVal*this.coeff).toFixed(2)).toString()+""+points;*/

        this.style+="color:"+color+"; font-size:"+fontSize+"; text-align:"+(this.layer as TextTemplateLayer).getTextAlign()+";";

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
