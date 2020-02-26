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
                var j;
                for (i = 0; i < features.length; i++) {
                    var feature = features[i];
                    //var name:string = feature.formatted_address;
                    var name;
                    var name = "";
                    var country = "";
                    var components = feature.address_components;
                    console.log("components: ", components);
                    if (components && components.length > 0) {
                        name = components[0].long_name;
                        console.log("length > 0");
                        console.log("name=", name);
                        if (components.length > 1) {
                            try {
                                country = components[components.length - 1].long_name;
                            }
                            catch (e) {
                                country = components[1].long_name;
                            }
                        }
                    }
                    else {
                        console.log("no components or length =0");
                        name = feature.formatted_address;
                    }
                    var center = [feature.geometry.location.lng, feature.geometry.location.lat];
                    collection.add({ name: name, country: country, coord: center });
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