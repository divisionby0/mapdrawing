///<reference path="MapLayerModel.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../../editor/EditorEvent.ts"/>
class MapLayerController{
    private model:MapLayerModel;
    
    constructor(model:MapLayerModel){
        this.model = model;
        this.createListeners();
    }

    private createListeners() {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onLocationChanged(data));
    }

    private onLocationChanged(data:any):void{
        console.log("LOCATION changed data=",data);
        this.model.locationChanged(data.coord);
    }
}
