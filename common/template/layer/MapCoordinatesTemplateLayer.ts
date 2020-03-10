///<reference path="CoordinatesTemplateLayer.ts"/>
class MapCoordinatesTemplateLayer extends CoordinatesTemplateLayer{
    protected onCoordinatesChanged(data:any):void {
        var coordinates:string = data[0]+" "+data[1];
        this.text = coordinates;
    }
}
