///<reference path="CoordinatesTemplateLayer.ts"/>
class MapCoordinatesTemplateLayer extends CoordinatesTemplateLayer{
    
    protected onCoordinatesChanged(data:any):void {
        var coordinates:string = parseFloat(data[0]).toFixed(5)+" "+parseFloat(data[1]).toFixed(5);
        this.text = coordinates;
    }
}
