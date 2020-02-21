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

                for(i=0; i<features.length; i++){
                    var feature:any = features[i];

                    var name:string = feature.formatted_address;
                    var center:any = [feature.geometry.location.lng, feature.geometry.location.lat];
                    collection.add({name:name, coord:center});
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
