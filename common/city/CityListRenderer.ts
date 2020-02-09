///<reference path="../lib/events/EventBus.ts"/>
class CityListRenderer{
    private j$:any;
    private coord:any;
    constructor(j$:any, data:any, parent:any){
        this.j$ = j$;
        
        var container:any = this.j$("<div style='width: 100%; background-color: lightgray; min-height:20px; height:auto; padding: 2px; border: 1px solid gray; cursor: pointer;'></div>");
        var cityName:string = data.name;
        var placeName:string = data.placeName;
        this.coord = data.coord;
        
        var nameContainer:any = this.j$("<div class='noselect' style='display:block; float:left; width: 100%; font-size: 0.9em;'>"+cityName+"</div>");
        //var placeNameContainer:any = this.j$("<div class='noselect' style='display:block; float:left; width: 56%; margin-left: 4px; font-size: 0.8em;'>"+placeName+"</div>");
        
        container.appendTo(parent);
        
        nameContainer.appendTo(container);
        //placeNameContainer.appendTo(container);
        
        container.click(()=>this.onClick());
    }
    
    private onClick():void{
        console.log("clicked");
        EventBus.dispatchEvent("LOCATION_SELECTED", this.coord);
    }
}
