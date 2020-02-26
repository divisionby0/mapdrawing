///<reference path="lib/events/EventBus.ts"/>
var GeocodingService = (function () {
    function GeocodingService(j$) {
        //private url:string = "https://api.mapbox.com/geocoding/v5/mapbox.places/";
        this.url = "https://maps.googleapis.com/maps/api/geocode/json?address=";
        this.reverseUrl = "https://maps.googleapis.com/maps/api/geocode/json?";
        this.token = 'AIzaSyBy4L8fG1APB4f0_QUQs9lMUFAsC9Al_48';
        this.j$ = j$;
    }
    GeocodingService.prototype.getCity = function (lat, lng) {
        var _this = this;
        var url = this.buildReverseUrl(lat, lng);
        this.j$.get(url, function (data, status) { return _this.onReverseResult(data, status); });
    };
    GeocodingService.prototype.getCoordinates = function (cityName) {
        var _this = this;
        var url = this.buildUrl(cityName);
        this.j$.get(url, function (data, status) { return _this.onResult(data, status); });
    };
    GeocodingService.prototype.onResult = function (data, status) {
        EventBus.dispatchEvent(GeocodingService.ON_GEOCODING_RESULT, { data: data, status: status });
    };
    GeocodingService.prototype.buildUrl = function (cityName) {
        return this.url + cityName + "&key=" + this.token;
    };
    GeocodingService.prototype.buildReverseUrl = function (lat, lng) {
        return this.reverseUrl + "latlng=" + lat + "," + lng + "&key=" + this.token;
    };
    GeocodingService.prototype.onReverseResult = function (data, status) {
        EventBus.dispatchEvent(GeocodingService.ON_REVERSED_GEOCODING_RESULT, { data: data, status: status });
    };
    GeocodingService.ON_GEOCODING_RESULT = "ON_GEOCODING_RESULT";
    GeocodingService.ON_REVERSED_GEOCODING_RESULT = "ON_REVERSED_GEOCODING_RESULT";
    return GeocodingService;
}());
//# sourceMappingURL=GeocodingService.js.map