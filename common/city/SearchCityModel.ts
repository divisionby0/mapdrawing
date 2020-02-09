///<reference path="SearchCityView.ts"/>
///<reference path="../../../common/GeocodingService.ts"/>
///<reference path="SearchCityResultParses.ts"/>
class SearchCityModel{
    private view:SearchCityView;
    private geocodingService:GeocodingService;
    private resultParser:SearchCityResultParses = new SearchCityResultParses();
    
    constructor(view:SearchCityView, geocodingService:GeocodingService){
        this.view = view;
        this.geocodingService = geocodingService;
    }
    
    public findCoordinates(cityName:string):void{
        this.view.disable();
        this.geocodingService.getCoordinates(cityName);
    }
    
    public onSearchCityNameEmpty():void{
        console.log("onSearchCityNameEmpty");
        this.view.enable();
        this.view.clear();
    }
    
    public onGeocodingResult(data:any):void{
        this.view.enable();
        var resultData:any = this.resultParser.parse(data);
        
        var status:string = resultData.status;
        
        if(status != "error"){
            this.view.setCities(resultData.collection);
        }
        else{
            alert("No cities found");
        }
    }
}
