///<reference path="LayerView.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class TextLayerView extends LayerView{
    protected id:string;
    
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected onDestroy() {
        EventBus.removeEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.removeEventListener(EditorEvent.TEXT_2_CHANGED, (data)=>this.onTextChanged(data));
    }

    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, (data)=>this.onTextChanged(data));
    }

    protected create():void{
        super.create();

        this.id = this.layer.getId();
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
        this.layerContainer = this.j$("<div id='"+this.id+"' style='"+this.style+"'>"+text+"</div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));

        if((this.layer as TextTemplateLayer).isVisible()){
            this.layerContainer.show();
        }
        else{
            this.layerContainer.hide();
        }
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

    public onTextChanged(data:any):void {
        var text:string = data.text;
        var elementId:string = data.elementId;

        var textElement:any = this.j$("#"+elementId);

        textElement.text(text);
    }
}
