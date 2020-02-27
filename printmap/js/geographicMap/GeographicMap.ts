///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
declare var mapboxgl:any;
class GeographicMap{
    private j$:any;
    private selfId:string;
    private map:any;
    private zoom:number;
    private position:string[];
    private currentStyle:string;
    private coeff:number;
    
    public static ON_MAP_LOADED:string = "ON_MAP_LOADED";
    
    constructor(j$:any, selfId:string, parameters:any){
        this.j$ = j$;
        this.selfId = selfId;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;

        if(parameters.coeff){
            this.coeff = parameters.coeff;
        }
        else{
            this.coeff = 1;
        }
        
        this.zoom = this.zoom;
        this.createMap();
    }
    
    public setZoom(zoom:string):void{
        this.zoom = parseInt(zoom);
        if(this.map){
            this.map.setZoom(this.zoom);
        }
    }
    
    public setPosition(position:any):void{
        this.position = position;
        if(this.map){
            this.map.flyTo({center:this.position});
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
        var mapDiv:any = document.getElementById(this.selfId);

        mapDiv.style.width = w;
        mapCanvas.style.width = h;

        this.map.resize();
    }

    private createMap():void{
        try {
            this.map = new mapboxgl.Map({
                container: this.selfId,
                center: this.position, // lng, lat
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle,
                attributionControl: false,
                preserveDrawingBuffer: true
            });

            this.map.on('load', ()=>this.onMapLoaded());

            this.j$(".mapboxgl-control-container").hide();

            this.map.on('moveend', ()=>this.onMapMoved());
            
            this.onMapMoved();
        } catch (e) {
            alert(e.message);
        }
    }

    private onMapMoved():void {
        var center = this.map.getCenter().toArray();

        var lat:string = parseFloat(center[1]).toFixed(7);
        var lng:string = parseFloat(center[0]).toFixed(7);
        var coord:any[] = [lat,lng];
        
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
    }

    private onMapLoaded():void {
        console.log("MAP loaded zoom=",this.map.getZoom());
        EventBus.dispatchEvent(GeographicMap.ON_MAP_LOADED, {map:this.map, style:this.currentStyle});
    }
    private onZoomEnded():void {
        console.log("MAP onZoomEnded zoom=",this.map.getZoom());
    }
}
