///<reference path="SearchCityView.ts"/>
///<reference path="../../../common/GeocodingService.ts"/>
///<reference path="SearchCityResultParses.ts"/>
var SearchCityModel = (function () {
    function SearchCityModel(view, geocodingService) {
        this.resultParser = new SearchCityResultParses();
        this.view = view;
        this.geocodingService = geocodingService;
    }
    SearchCityModel.prototype.findCoordinates = function (cityName) {
        this.view.disable();
        this.geocodingService.getCoordinates(cityName);
    };
    SearchCityModel.prototype.onSearchCityNameEmpty = function () {
        console.log("onSearchCityNameEmpty");
        this.view.enable();
        this.view.clear();
    };
    SearchCityModel.prototype.onGeocodingResult = function (data) {
        this.view.enable();
        var resultData = this.resultParser.parse(data);
        var status = resultData.status;
        if (status != "error") {
            this.view.setCities(resultData.collection);
        }
        else {
            alert("No cities found");
        }
    };
    return SearchCityModel;
}());
//# sourceMappingURL=SearchCityModel.js.map