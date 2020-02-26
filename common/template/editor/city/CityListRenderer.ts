///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
class CityListRenderer{
    private j$:any;
    private data:any;
    
    constructor(j$:any, data:any, parent:any){
        this.j$ = j$;
        this.data = data;
        var container:any = this.j$("<div style='width: 100%; background-color: lightgray; min-height:20px; height:auto; padding: 2px; border: 1px solid gray; cursor: pointer;'></div>");
        var cityName:string = data.name;
        var country:string = data.country;
        if(country!=""){
            country = ", "+country;
        }
        
        var nameContainer:any = this.j$("<div class='noselect' data-city="+cityName+" style='display:block; float:left; width: 100%; font-size: 0.9em;'>"+cityName+country+"</div>");
        container.appendTo(parent);
        
        nameContainer.appendTo(container);
        
        container.click((event)=>this.onClick(event));
    }
    
    private onClick(event:any):void{
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, {coord:this.data.coord, country:this.data.country, city:this.data.name});
    }
}
