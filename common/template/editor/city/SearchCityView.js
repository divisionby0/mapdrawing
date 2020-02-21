///<reference path="SearchCityEvent.ts"/>
///<reference path="CityListRenderer.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
var SearchCityView = (function () {
    function SearchCityView(j$) {
        var _this = this;
        this.j$ = j$;
        this.input = this.j$("#cityInput");
        this.placesContainer = this.j$("#places");
        this.input.on("input", function () { return _this.onInputChanged(); });
        this.input.focusin(function (event) { return _this.onInputFocusIn(event); });
        this.hidePlaces();
        //EventBus.addEventListener("LOCATION_SELECTED", (data)=>this.onCitySelected(data));
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
    }
    SearchCityView.prototype.setCities = function (cities) {
        this.j$("#places").empty();
        var iterator = cities.getIterator();
        while (iterator.hasNext()) {
            var city = iterator.next();
            new CityListRenderer(this.j$, city, this.j$("#places"));
        }
    };
    SearchCityView.prototype.disable = function () {
        //this.input.attr('disabled', 'disabled');
    };
    SearchCityView.prototype.enable = function () {
        //this.input.removeAttr('disabled');
        //this.input.focus();
    };
    SearchCityView.prototype.setCity = function (cityName) {
        this.input.val(cityName);
    };
    SearchCityView.prototype.clear = function () {
        this.j$("#places").empty();
        this.input.val("");
    };
    SearchCityView.prototype.hidePlaces = function () {
        this.j$("#placesListbox").hide();
    };
    SearchCityView.prototype.showPlaces = function () {
        this.j$("#placesListbox").show();
    };
    SearchCityView.prototype.onInputChanged = function () {
        var value = this.input.val();
        if (value.length > 0) {
            this.showPlaces();
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME, this.input.val());
        }
        else {
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME_EMPTY, null);
        }
    };
    SearchCityView.prototype.onInputFocusIn = function (event) {
        this.showPlaces();
    };
    SearchCityView.prototype.onCityChanged = function (data) {
        var cityName = data.city;
        this.input.val(cityName);
        console.log("onCityChanged cityName=", cityName);
        this.hidePlaces();
    };
    return SearchCityView;
}());
//# sourceMappingURL=SearchCityView.js.map