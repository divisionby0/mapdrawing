///<reference path="SearchCityEvent.ts"/>
///<reference path="CityListRenderer.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
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
        this.hidePlaces();
        
        //EventBus.addEventListener("LOCATION_SELECTED", (data)=>this.onCitySelected(data));
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
    }

    public setCities(cities:List<any>):void{
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

    public setCity(cityName:string):void {
        this.input.val(cityName);
    }
    
    public clear():void{
        this.j$("#places").empty();
        this.input.val("");
    }
    public hidePlaces():void{
        this.j$("#placesListbox").hide();
    }
    public showPlaces():void{
        this.j$("#placesListbox").show();
    }

    private onInputChanged():void {
        var value:string = this.input.val();
        if(value.length > 0){
            this.showPlaces();
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME, this.input.val());
        }
        else{
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME_EMPTY, null);
        }
    }

    private onInputFocusIn(event:any):void {
        this.showPlaces();
    }

    private onCityChanged(data:any):void {
        var cityName:string = data.city;
        this.input.val(cityName);
        console.log("onCityChanged cityName=",cityName);
        this.hidePlaces();
    }
}
