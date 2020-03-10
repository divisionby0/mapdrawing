///<reference path="LayerView.ts"/>
///<reference path="../layer/TemplateLayer.ts"/>
///<reference path="../layer/DivTemplateLayer.ts"/>
///<reference path="../../lib/Utils.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../LayerId.ts"/>
class DivLayerView extends LayerView{
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId,selfId,  templateSizeProvider, coeff);
        EventBus.addEventListener(EditorEvent.BORDER_CHANGED, (value)=>this.onBorderExistenceChanged(value));
    }

    protected onDestroy() {
        EventBus.removeEventListener(EditorEvent.BORDER_CHANGED, (value)=>this.onBorderExistenceChanged(value));
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
        this.createContainer();
        /*
        this.layerContainer = this.j$("<div id='"+this.layer.getId()+"' style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
        */
    }
    
    protected createContainer():void{
        this.layerContainer = this.j$("<div id='"+this.layer.getId()+"' style='"+this.style+"'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }

    private onBorderExistenceChanged(exists:boolean):void {
        if(this.layer.getId() == LayerId.BACKGROUND_BORDER){
            if(exists){
                this.layerContainer.show();
            }
            else{
                this.layerContainer.hide();
            }
        }
    }
}
