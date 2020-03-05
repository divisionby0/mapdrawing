///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
///<reference path="../../../common/template/layer/geographicMap/MapParameters.ts"/>
declare var mapboxgl:any;
declare function render(jQ, data):Function;
class GeographicMap{
    private j$:any;
    private map:any;
    private zoom:number;
    private center:string[];
    private currentStyle:string;

    public static ON_MAP_LOADED:string = "ON_MAP_LOADED";
    public static ON_MAP_CHANGED:string = "ON_MAP_CHANGED";
    
    private parameters:MapParameters;
    
    private initWidth:number;
    private initHeight:number;

    constructor(j$:any, parameters:MapParameters){
        console.log("Map constructor parameters=",parameters);
        this.j$ = j$;
        this.parameters = parameters;
        this.createMap();
        
        EventBus.addEventListener("RENDER_PRINT_SIZE", ()=>this.onRenderPrintSizeRequest());
    }
    
    public setPosition(position:any):void{
        this.center = position;
        
        this.parameters.setCenter(position);
        
        if(this.map){
            this.map.flyTo({center:this.center});
        }
        else{
            console.log("map not created yet");
        }
    }

    public setStyle(style:string):void{
        this.currentStyle = style;
        if(this.map){
            this.map.setStyle(this.currentStyle);
        }
    }

    public resize(w:number, h:number):void{
        var mapCanvas:any = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv:any = document.getElementById(this.parameters.getContainer());
        
        mapDiv.style.width = w;
        mapDiv.style.height = h;
        mapCanvas.style.width = w;
        mapCanvas.style.height = h;

        if(this.map){
            this.map.resize();
            this.updateMap();
        }
    }

    private createMap():void{
        console.log("createMap() this.currentStyle=",this.currentStyle);

        console.log("map parameters: ",this.parameters.toObject());

        try {
            this.map = new mapboxgl.Map(this.parameters.toObject());

            this.map.on('load', ()=>this.onMapLoaded());

            this.j$(".mapboxgl-control-container").hide();

            this.updateMap();

            window.setTimeout(()=>this.updateMap(), 500);

            this.map.on('moveend', ()=>this.onMapChanged());
            this.map.on('zoomend', ()=>this.onMapChanged());

        } catch (e) {
            console.error("ERROR: ",e);
            alert(e.message);
        }
    }
    
    private updateMap():void{
        this.map.resize();
        this.map.jumpTo({center:this.parameters.getCenter()});

        if(this.parameters.getBounds()){
            this.map.fitBounds(this.parameters.getBounds());
        }
        this.map.setZoom(this.parameters.getZoom());
    }

    private onMapChanged():void{
        this.parameters.setZoom(this.map.getZoom());
        this.parameters.setCenter(this.map.getCenter());
        this.parameters.setBounds(this.map.getBounds());
        
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, {zoom:this.map.getZoom(), center:this.map.getCenter(), bounds:this.map.getBounds()});
    }

    private onMapLoaded():void {
        console.log("MAP loaded zoom=",this.map.getZoom());
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, {map:this.map, style:this.currentStyle});
    }

    private onRenderPrintSizeRequest():void {
        render(this.j$, this.parameters.toObject());
    }
}