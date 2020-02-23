///<reference path="CityTemplateLayer.ts"/>
class CoordinatesTemplateLayer extends CityTemplateLayer{

    protected onDestroy():void {
        EventBus.removeEventListener(EditorEvent.COORDINATES_CHANGED, (coord)=>this.onCoordinatesChanged(coord));
        EventBus.removeEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, (data)=>this.onCoordinatesVisibilityChanged(data));
    }
    
    protected createListener() {
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, (coord)=>this.onCoordinatesChanged(coord));
        EventBus.addEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, (data)=>this.onCoordinatesVisibilityChanged(data));
    }

    private onCoordinatesChanged(data:any):void {
        var coordinates:string = data[0]+" "+data[1];
        this.text = coordinates;
    }

    private onCoordinatesVisibilityChanged(data:any):void {
        this.visible = data.visible;
    }
}
