///<reference path="../lib/events/EventBus.ts"/>
///<reference path="SearchCityEvent.ts"/>
///<reference path="CityListRenderer.ts"/>
var SearchCityView = (function () {
    function SearchCityView(j$) {
        var _this = this;
        this.j$ = j$;
        this.input = this.j$("#cityInput");
        this.placesContainer = this.j$("#places");
        this.input.on("input", function () { return _this.onInputChanged(); });
        this.input.focusin(function (event) { return _this.onInputFocusIn(event); });
        this.hide();
        EventBus.addEventListener("LOCATION_SELECTED", function (coord) { return _this.onCitySelected(coord); });
    }
    SearchCityView.prototype.setCities = function (cities) {
        //console.log("cities=",cities);
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
    SearchCityView.prototype.clear = function () {
        this.j$("#places").empty();
        this.input.val("");
    };
    SearchCityView.prototype.hide = function () {
        this.j$("#placesListbox").hide();
    };
    SearchCityView.prototype.show = function () {
        this.j$("#placesListbox").show();
    };
    SearchCityView.prototype.onInputChanged = function () {
        var value = this.input.val();
        if (value.length > 0) {
            this.show();
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME, this.input.val());
        }
        else {
            EventBus.dispatchEvent(SearchCityEvent.ON_CITY_NAME_EMPTY, null);
        }
    };
    SearchCityView.prototype.onInputFocusIn = function (event) {
        this.show();
    };
    SearchCityView.prototype.onCitySelected = function (coord) {
        this.hide();
    };
    return SearchCityView;
}());
//# sourceMappingURL=SearchCityView.js.map