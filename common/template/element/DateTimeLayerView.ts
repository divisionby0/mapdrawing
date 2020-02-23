///<reference path="TextLayerView.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class DateTimeLayerView extends TextLayerView{

    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, (data)=>this.onDateTimeChanged(data));
        EventBus.addEventListener(EditorEvent.DATE_VISIBILITY_CHANGED, (data)=>this.onDateVisibilityChanged(data));
        EventBus.addEventListener(EditorEvent.TIME_VISIBILITY_CHANGED, (data)=>this.onTimeVisibilityChanged(data));
    }

    private onDateTimeChanged(data:any):void {
        this.layerContainer.text((this.layer as TextTemplateLayer).getText());
    }

    private onDateVisibilityChanged(data:any):void {
        this.layerContainer.text((this.layer as TextTemplateLayer).getText());
    }
    
    private onTimeVisibilityChanged(data:any):void {
        this.layerContainer.text((this.layer as TextTemplateLayer).getText());
    }
}
