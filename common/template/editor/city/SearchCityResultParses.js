var SearchCityResultParses = (function () {
    function SearchCityResultParses() {
        this.city = null;
        this.country = "";
        this.center = null;
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
                if (features.length > 0) {
                    var c, lc, component;
                    for (var r = 0, rl = features.length; r < rl; r += 1) {
                        var result = features[r];
                        if (!this.city && result.types[0] === 'locality') {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];
                                if (component.types[0] === 'locality') {
                                    this.city = component.long_name;
                                    this.center = [result.geometry.location.lng, result.geometry.location.lat];
                                    this.parse(data);
                                    break;
                                }
                            }
                        }
                        else if (this.country === "") {
                            for (c = 0, lc = result.address_components.length; c < lc; c += 1) {
                                component = result.address_components[c];
                                if (component.types[0] === 'country') {
                                    this.country = component.long_name;
                                    break;
                                }
                            }
                        }
                        if (this.city && this.country && this.center) {
                            break;
                        }
                    }
                    collection.add({ name: this.city, country: this.country, coord: this.center });
                }
                else {
                    console.error("No results");
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