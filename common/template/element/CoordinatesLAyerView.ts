///<reference path="CityLayerView.ts"/>
class CoordinatesLayerView extends CityLayerView{

    protected onDestroy() {
        EventBus.removeEventListener(EditorEvent.COORDINATES_CHANGED, (coord)=>this.onCoordinatesChanged(coord));
        EventBus.removeEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, (data)=>this.onCoordinatesVisibilityChanged(data));
    }
    
    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, (coord)=>this.onCoordinatesChanged(coord));
        EventBus.addEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, (data)=>this.onCoordinatesVisibilityChanged(data));
    }

    private onCoordinatesChanged(data:any):void {
        var coordinates:string = data[0]+" "+data[1];
        this.layerContainer.text(coordinates);
    }

    private onCoordinatesVisibilityChanged(data:any):void {
        var visible:boolean = data.visible;

        if(visible){
            this.layerContainer.show();
        }
        else{
            this.layerContainer.hide();
        }
    }
}
