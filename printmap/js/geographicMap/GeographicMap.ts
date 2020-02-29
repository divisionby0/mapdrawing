///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
declare var mapboxgl:any;
class GeographicMap{
    private j$:any;
    private selfId:string;
    private map:any;
    private zoom:number;
    private center:string[];
    private currentStyle:string;
    private coeff:number;
    
    public static ON_MAP_LOADED:string = "ON_MAP_LOADED";
    public static ON_MAP_CHANGED:string = "ON_MAP_CHANGED";
    private bounds:any;
    private bearing:any;
    private pitch:any;

    constructor(j$:any, selfId:string, parameters:any){
        this.j$ = j$;
        this.selfId = selfId;
        this.zoom = parameters.zoom;
        this.center = parameters.position;
        this.currentStyle = parameters.currentStyle;

        if(parameters.coeff){
            this.coeff = parameters.coeff;
        }
        else{
            this.coeff = 1;
        }
        if(parameters.bounds){
            this.bounds = parameters.bounds;
        }
        
        if(parameters.zoom){
            this.zoom = parameters.zoom;
        }
        if(parameters.bearing){
            this.bearing = parameters.bearing;
        }
        if(parameters.pitch){
            this.pitch = parameters.pitch;
        }
        
        this.createMap();
    }

    public setZoom(zoom:string):void{
        this.zoom = parseInt(zoom);
        if(this.map){
            this.map.setZoom(this.zoom);
        }
    }

    public setPosition(position:any):void{
        this.center = position;
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
        /*
        var mapCanvas:any = document.getElementsByClassName('mapboxgl-canvas')[0];
        var mapDiv:any = document.getElementById(this.selfId);

        mapDiv.style.width = w;
        mapCanvas.style.width = h;
        */

        this.map.resize();
    }

    private createMap():void{
        var parameters:any = {
            container: this.selfId,
            style: this.currentStyle,
            preserveDrawingBuffer: true,
            fadeDuration: 0,
            attributionControl: false
        };

        if(this.bounds){
            parameters.bounds = this.bounds;
        }
        if(this.zoom){
            parameters.zoom = this.zoom;
        }
        if(this.center){
            parameters.center = this.center;
        }
        if(this.bearing){
            parameters.bearing = this.bearing;
        }
        if(this.pitch){
            parameters.pitch = this.pitch;
        }

        console.log("map parameters: ",parameters);
        
        try {
            this.map = new mapboxgl.Map(parameters);

            this.map.on('load', ()=>this.onMapLoaded());

            this.j$(".mapboxgl-control-container").hide();

            this.map.on('moveend', ()=>this.onMapChanged());
            this.map.on('zoomend', ()=>this.onMapChanged());

            window.setTimeout(()=>this.map.resize(), 500);

        } catch (e) {
            alert(e.message);
        }
    }

    private onMapChanged():void {
        var center = this.map.getCenter().toArray();

        var lat:string = parseFloat(center[1]).toFixed(7);
        var lng:string = parseFloat(center[0]).toFixed(7);
        var coord:any[] = [lat,lng];

        this.center = this.map.getCenter();
        this.bounds = this.map.getBounds();
        this.zoom = this.map.getZoom();
        this.bearing = this.map.getBearing();
        this.pitch = this.map.getPitch();
        
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
        EventBus.dispatchEvent(GeographicMap.ON_MAP_CHANGED, {center:this.center, bounds:this.bounds, zoom:this.zoom, style:this.currentStyle, bearing:this.bearing, pitch:this.pitch})
    }

    private onMapLoaded():void {
        console.log("MAP loaded zoom=",this.map.getZoom());
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, {map:this.map, style:this.currentStyle});
    }
    private onZoomEnded():void {
        console.log("MAP onZoomEnded zoom=",this.map.getZoom());
    }
}
