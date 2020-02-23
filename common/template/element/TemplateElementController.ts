///<reference path="TemplateElementModel.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
class TemplateElementController{
    
    private model:TemplateElementModel;
    
    constructor(model:TemplateElementModel, data:Template){
        this.model = model;
        this.model.setData(data);
        
        this.createListeners();
    }

    public destroy():void{
        EventBus.removeEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.removeEventListener(EditorEvent.TEXT_2_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.removeEventListener(EditorEvent.BORDER_CHANGED, (data)=>this.onBorderChanged(data));
        EventBus.removeEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, (data)=>this.onCircleBorderChanged(data));
        EventBus.removeEventListener(EditorEvent.CONSTELLATIONS_CHANGED, (data)=>this.onConstellationsChanged(data));
        EventBus.removeEventListener(EditorEvent.STARS_CHANGED, (data)=>this.onStarsChanged(data));
        
        this.model.destroy();
    }
    
    private createListeners():void {
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, (data)=>this.onTextChanged(data));
        EventBus.addEventListener(EditorEvent.BORDER_CHANGED, (data)=>this.onBorderChanged(data));
        EventBus.addEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, (data)=>this.onCircleBorderChanged(data));
        EventBus.addEventListener(EditorEvent.CONSTELLATIONS_CHANGED, (data)=>this.onConstellationsChanged(data));
        EventBus.addEventListener(EditorEvent.STARS_CHANGED, (data)=>this.onStarsChanged(data));
    }

    private onTextChanged(data:any):void {
        this.model.onTextChanged(data);
    }
    private onBorderChanged(visible:boolean):void {
        this.model.onBorderChanged(visible);
    }

    private onCircleBorderChanged(visible:boolean):void {
        this.model.onCircleBorderChanged(visible);
    }

    private onConstellationsChanged(visible:boolean):void {
        this.model.onConstellationsChanged(visible);
    }

    private onStarsChanged(isMulticolored:boolean):void {
        this.model.onStarsChanged(isMulticolored);
    }
}
