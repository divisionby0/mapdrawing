class SearchCityResultParses{
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
                
                for(i=0; i<features.length; i++){
                    var feature:any = features[i];
                    var name:string = "";
                    var country = "";

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
