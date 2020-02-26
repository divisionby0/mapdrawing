///<reference path="StarmapLayerModel.ts"/>
class StarmapLayerController{
    private model:StarmapLayerModel;
    
    constructor(model:StarmapLayerModel){
        //console.log("new StarmapLayerController");
        this.model = model;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, (date)=>this.onDateTimeChanged(date));
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));

        EventBus.addEventListener(EditorEvent.STARS_CHANGED, (value)=>this.onStarsChanged(value));
        EventBus.addEventListener(EditorEvent.CONSTELLATIONS_CHANGED, (value)=>this.onConstellationsChanged(value));
        EventBus.addEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, (value)=>this.onCircleBorderChanged(value));
    }

    private onStarsChanged(value):void{
        this.model.setHasColoredStars(value);
    }
    private onConstellationsChanged(value):void{
        this.model.setHasConstellations(value);
    }
    private onCircleBorderChanged(value):void{
        this.model.hasCircleBorder(value);
    }
    
    private onDateTimeChanged(date:any):void {
        this.model.onDateTimeChanged(date);
    }

    private onCityChanged(data:any) {
        //console.log("event listener onCityChanged");
        this.model.onCityChanged(data);
    }
}
