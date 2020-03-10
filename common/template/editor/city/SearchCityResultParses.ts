class SearchCityResultParses{

    private city:any = null;
    private country:any = "";
    private center:any = null;

    constructor(){

    }

    public parse(data:any):any{
        var collection:List<any> = new List<any>("cities");
        var status:string = data.status;

        if(status == "success"){
            var responseStatus:string = data.data.status;

            if(responseStatus != "ZERO_RESULTS"){
                var features:any[] = data.data.results;
                var i:number;
                var j:number;

                if (features.length>0) {
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

                    collection.add({name:this.city, country:this.country, coord:this.center});
                }
                else{
                    console.error("No results");
                }

                /*
                for(i=0; i<features.length; i++){
                    var feature:any = features[i];
                    var name:string = "";
                    var country = "";

                    console.log("feature=",feature);
                    
                    var components:any[] = feature.address_components;
                    
                    if(components && components.length>0){
                        name = components[0].long_name;

                        if(components.length > 1){
                            try{
                                country = components[components.length-1].long_name;
                            }
                            catch(e){
                                country = components[1].long_name;
                            }
                        }
                    }
                    else{
                        name = feature.formatted_address;
                    }

                    var center:any = [feature.geometry.location.lng, feature.geometry.location.lat];
                    collection.add({name:name, country:country, coord:center});
                }
                */
            }

            return {status:status, collection:collection};
        }
        else{
            return {status:"error"};
        }
    }

    private isCity(id:string):boolean{
        if(id.indexOf("place") != -1){
            return true;
        }
        else{
            return false;
        }
    }
}
