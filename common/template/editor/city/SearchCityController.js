///<reference path="SearchCityModel.ts"/>
///<reference path="../../../GeocodingService.ts"/>
var SearchCityController = (function () {
    function SearchCityController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener(SearchCityEvent.ON_CITY_NAME, function (name) { return _this.onSearchCityName(name); });
        EventBus.addEventListener(SearchCityEvent.ON_CITY_NAME_EMPTY, function () { return _this.onSearchCityNameEmpty(); });
        EventBus.addEventListener(GeocodingService.ON_GEOCODING_RESULT, function (data) { return _this.onGeocodingResult(data); });
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
    }
    SearchCityController.prototype.onSearchCityName = function (name) {
        this.model.findCoordinates(name);
    };
    SearchCityController.prototype.onGeocodingResult = function (data) {
        this.model.onGeocodingResult(data);
    };
    SearchCityController.prototype.onSearchCityNameEmpty = function () {
        this.model.onSearchCityNameEmpty();
    };
    SearchCityController.prototype.onLocationSelected = function (coord) {
        console.log("onLocationSelected coord=", coord);
    };
    SearchCityController.prototype.onCityChanged = function (data) {
        console.log("onCityChanged data=", data);
        // this.model.setCity(cityName);
    };
    return SearchCityController;
}());
//# sourceMappingURL=SearchCityController.js.map