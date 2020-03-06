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
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, (data)=>this.onCoordinatesChanged(data));
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onLocationChanged(data));
        EventBus.addEventListener(EditorEvent.PLACE_LABELS_CHANGED, (visible)=>this.onPlaceLabelsChanged(visible));
    }

    private onLocationChanged(data:any):void{
        this.model.locationChanged(data.coord);
    }

    private onPlaceLabelsChanged(visible:boolean):void {
        this.model.placeLabelsVisibilityChanged(visible);
    }

    private onCoordinatesChanged(data:any):void {
        this.model.coordinatesChanged(data);
    }
}
