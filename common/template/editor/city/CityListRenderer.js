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
        //var placeNameContainer:any = this.j$("<div class='noselect' style='display:block; float:left; width: 56%; margin-left: 4px; font-size: 0.8em;'>"+placeName+"</div>");
        container.appendTo(parent);
        nameContainer.appendTo(container);
        //placeNameContainer.appendTo(container);
        container.click(function (event) { return _this.onClick(event); });
    }
    CityListRenderer.prototype.onClick = function (event) {
        //console.log("city clicked target=",event.target);
        var cityName = this.j$(event.target).text();
        //console.log("city name = ", cityName);
        //EventBus.dispatchEvent("LOCATION_SELECTED", {coord:this.coord, city:cityName});
        EventBus.dispatchEvent(EditorEvent.CITY_CHANGED, { coord: this.coord, city: cityName });
    };
    return CityListRenderer;
}());
//# sourceMappingURL=CityListRenderer.js.map