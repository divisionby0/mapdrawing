///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
var CityListRenderer = (function () {
    function CityListRenderer(j$, data, parent) {
        var _this = this;
        this.j$ = j$;
        var container = this.j$("<div style='width: 100%; background-color: lightgray; min-height:20px; height:auto; padding: 2px; border: 1px solid gray; cursor: pointer;'></div>");
        var cityName = data.name;
        var placeName = data.placeName;
        this.coord = data.coord;
        var nameContainer = this.j$("<div class='noselect' style='display:block; float:left; width: 100%; font-size: 0.9em;'>" + cityName + "</div>");
        container.appendTo(parent);
        nameContainer.appendTo(container);
        container.click(function (event) { return _this.onClick(event); });
    }
    CityListRenderer.prototype.onClick = function (event) {
        var cityName = this.j$(event.target).text();
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, { coord: this.coord, city: cityName });
    };
    return CityListRenderer;
}());
//# sourceMappingURL=CityListRenderer.js.map