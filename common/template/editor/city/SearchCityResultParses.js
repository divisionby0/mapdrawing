var SearchCityResultParses = (function () {
    function SearchCityResultParses() {
    }
    SearchCityResultParses.prototype.parse = function (data) {
        var collection = new List("cities");
        var status = data.status;
        if (status == "success") {
            var responseStatus = data.data.status;
            if (responseStatus != "ZERO_RESULTS") {
                var features = data.data.results;
                var i;
                for (i = 0; i < features.length; i++) {
                    var feature = features[i];
                    var name = feature.formatted_address;
                    var center = [feature.geometry.location.lng, feature.geometry.location.lat];
                    collection.add({ name: name, coord: center });
                }
            }
            return { status: status, collection: collection };
        }
        else {
            return { status: "error" };
        }
    };
    SearchCityResultParses.prototype.isCity = function (id) {
        if (id.indexOf("place") != -1) {
            return true;
        }
        else {
            return false;
        }
    };
    return SearchCityResultParses;
}());
//# sourceMappingURL=SearchCityResultParses.js.map