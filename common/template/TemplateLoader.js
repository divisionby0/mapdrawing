///<reference path="../lib/events/EventBus.ts"/>
var TemplateLoader = (function () {
    function TemplateLoader(j$) {
        this.j$ = j$;
    }
    TemplateLoader.prototype.load = function (url) {
        var _this = this;
        console.log("loading from " + url + " ...");
        this.j$.ajax({
            type: "GET",
            url: url,
            dataType: "text",
            success: function (xml) { return _this.onFileLoaded(xml); },
            error: function (error) { return _this.onError(error); }
        });
    };
    TemplateLoader.prototype.onFileLoaded = function (data) {
        //console.log("onFileLoaded data=",data);
        EventBus.dispatchEvent(TemplateLoader.ON_DATA_LOADED, data);
        /*
        $(xml).find('person').each(function() {
            nm= $(this).text();
            $("#temp").html(nm);
        }
        */
    };
    TemplateLoader.prototype.onError = function (error) {
        EventBus.dispatchEvent(TemplateLoader.ON_DATA_LOAD_ERROR, error);
        //console.error("ERROR: ",error);
    };
    TemplateLoader.ON_DATA_LOADED = "ON_DATA_LOADED";
    TemplateLoader.ON_DATA_LOAD_ERROR = "ON_DATA_LOAD_ERROR";
    return TemplateLoader;
}());
//# sourceMappingURL=TemplateLoader.js.map