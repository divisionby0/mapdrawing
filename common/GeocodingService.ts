///<reference path="lib/events/EventBus.ts"/>
class GeocodingService{
    //private url:string = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
    private url:string = "https://maps.googleapis.com/maps/api/geocode/json?address=";
    private reverseUrl:string = "https://maps.googleapis.com/maps/api/geocode/json?";
    // https://maps.googleapis.com/maps/api/geocode/json?latlng=40.714224,-73.961452&key=YOUR_API_KEY
    private j$:any;
    private token:string = 'AIzaSyBy4L8fG1APB4f0_QUQs9lMUFAsC9Al_48';
    public static ON_GEOCODING_RESULT:string = "ON_GEOCODING_RESULT";
    public static ON_REVERSED_GEOCODING_RESULT:string = "ON_REVERSED_GEOCODING_RESULT";

    constructor(j$:any){
        this.j$ = j$;
    }

    public getCity(lat:any, lng:any):any{
        var url:string = this.buildReverseUrl(lat, lng);
        this.j$.get(url, (data,status) =>this.onReverseResult(data,status));
    }

    public getCoordinates(cityName:string):void{
        var url:string = this.buildUrl(cityName);
        this.j$.get(url, (data,status) =>this.onResult(data,status));
    }

    private onResult(data:any,status:string):void{
        EventBus.dispatchEvent(GeocodingService.ON_GEOCODING_RESULT, {data:data, status:status});
    }
    
    private buildUrl(cityName:string):string{
        return this.url+cityName+"&key="+this.token;
    }
    
    private buildReverseUrl(lat:any, lng:any):string {
        return this.reverseUrl+"latlng="+lat+","+lng+"&key="+this.token;
    }

    private onReverseResult(data:any, status:any):void {
        EventBus.dispatchEvent(GeocodingService.ON_REVERSED_GEOCODING_RESULT, {data:data, status:status});
    }
}
