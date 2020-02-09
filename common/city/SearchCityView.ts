///<reference path="../lib/events/EventBus.ts"/>
///<reference path="SearchCityEvent.ts"/>
///<reference path="CityListRenderer.ts"/>
class SearchCityView{
    private j$:any;
    private input:any;
    private placesContainer:any;

    constructor(j$:any){
        this.j$ = j$;
        this.input = this.j$("#cityInput");
        this.placesContainer = this.j$("#places");
        this.input.on("input",()=>this.onInputChanged());

        this.input.focusin((event)=>this.onInputFocusIn(event));

        console.log("SearchCityView input=",this.input);
        this.hide();


        EventBus.addEventListener("LOCATION_SELECTED", (coord)=>this.onCitySelected(coord));
    }

    public setCities(cities:List<any>):void{
        //console.log("cities=",cities);
        this.j$("#places").empty();
        var iterator:ListIterator = cities.getIterator();
        while(iterator.hasNext()){
            var city:any = iterator.next();
            new CityListRenderer(this.j$, city, this.j$("#places"));
        }
    }

    public disable():void{
        //this.input.attr('disabled', 'disabled');
    }
    
    public enable():void{
        //this.input.removeAttr('disabled');
        //this.input.focus();
    }
    
    public clear():void{
        console.log("clear");
        this.j$("#places").empty();
        this.input.val("");
    }
    public hide():void{
        this.j$("#placesListbox").hide();
    }
    public show():void{
        this.j$("#placesListbox").show();
    }

    private onInputChanged():void {
        console.log("changed");
        var value:string = this.input.val();
        if(value.length > 0){
            this.show();
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME, this.input.val());
        }
        else{
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME_EMPTY, null);
        }
    }

    private onInputFocusIn(event:any):void {
        this.show();
    }

    private onCitySelected(coord:any):void {
        this.hide();
    }
}
