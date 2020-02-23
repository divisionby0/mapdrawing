///<reference path="StarmapLayerModel.ts"/>
class StarmapLayerController{
    private model:StarmapLayerModel;
    
    constructor(model:StarmapLayerModel){
        this.model = model;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, (date)=>this.onDateTimeChanged(date));
    }

    private onDateTimeChanged(date:any):void {
        this.model.onDateTimeChanged(date);
    }
}
