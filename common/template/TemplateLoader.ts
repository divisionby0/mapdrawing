///<reference path="../lib/events/EventBus.ts"/>
class TemplateLoader{
    
    public static ON_DATA_LOADED:string = "ON_DATA_LOADED";
    public static ON_DATA_LOAD_ERROR:string = "ON_DATA_LOAD_ERROR";
    
    private j$:any;
    constructor(j$:any){
        this.j$ = j$;
    }

    public load(url:string):void{
        console.log("loading from "+url+" ...");
        this.j$.ajax({
            type: "GET" ,
            url: url ,
            dataType: "text" ,
            success: (xml)=>this.onFileLoaded(xml),
            error: (error)=>this.onError(error)
        });
    }

    private onFileLoaded(data:any):void{
        //console.log("onFileLoaded data=",data);
        EventBus.dispatchEvent(TemplateLoader.ON_DATA_LOADED, data);
        /*
        $(xml).find('person').each(function() {
            nm= $(this).text();
            $("#temp").html(nm);
        }
        */
    }

    private onError(error:any):void{
        EventBus.dispatchEvent(TemplateLoader.ON_DATA_LOAD_ERROR, error);
        //console.error("ERROR: ",error);
    }
}
