///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
var CityListRenderer = (function () {
    function CityListRenderer(j$, data, parent) {
        var _this = this;
        this.j$ = j$;
        this.data = data;
        var container = this.j$("<div style='width: 100%; background-color: lightgray; min-height:20px; height:auto; padding: 2px; border: 1px solid gray; cursor: pointer;'></div>");
        var cityName = data.name;
        var country = data.country;
        if (country != "") {
            country = ", " + country;
        }
        var nameContainer = this.j$("<div class='noselect' data-city=" + cityName + " style='display:block; float:left; width: 100%; font-size: 0.9em;'>" + cityName + country + "</div>");
        container.appendTo(parent);
        nameContainer.appendTo(container);
        container.click(function (event) { return _this.onClick(event); });
    }
    CityListRenderer.prototype.onClick = function (event) {
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, { coord: this.data.coord, country: this.data.country, city: this.data.name });
    };
    return CityListRenderer;
}());
//# sourceMappingURL=CityListRenderer.js.map