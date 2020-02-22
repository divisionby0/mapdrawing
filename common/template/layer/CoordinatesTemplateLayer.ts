///<reference path="CityTemplateLayer.ts"/>
class CoordinatesTemplateLayer extends CityTemplateLayer{
    protected createListener() {
        //EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        //EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, (data)=>this.onCityVisibilityChanged(data));
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, (coord)=>this.onCoordinatesChanged(coord));
        EventBus.addEventListener(EditorEvent.COORDINATES_VISIBILITY_CHANGED, (data)=>this.onCoordinatesVisibilityChanged(data));
    }

    private onCoordinatesChanged(data:any):void {
        console.log("onCoordinatesChanged data=",data);
        var coordinates:string = data[0]+" "+data[1];
        this.text = coordinates;
    }

    private onCoordinatesVisibilityChanged(data:any):void {
        this.visible = data.visible;
    }
}
