///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
declare var mapboxgl:any;
class GeographicMap{
    private j$:any;
    
    private map:any;
    private zoom:number;
    private position:string[];
    private lng:string;
    private currentStyle:string;
    private placementHorizontal:boolean = false;
    
    constructor(j$:any, parameters:any){
        this.j$ = j$;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;
        this.createMap();
    }
    
    public setZoom(zoom:string):void{
        if(this.map){
            this.map.setZoom(zoom);
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
        var mapDiv:any = document.getElementById('map');

        mapDiv.style.width = w;
        mapCanvas.style.width = h;

        this.map.resize();
    }

    private createMap():void{
        try {
            console.log("create map pos=",this.position);
            this.map = new mapboxgl.Map({
                container: 'map',
                center: this.position, // lng, lat
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle,
                attributionControl: false
            });

            this.j$(".mapboxgl-control-container").hide();

            this.map.on('moveend', ()=>this.onMapMoved());
            this.onMapMoved();
        } catch (e) {
            alert(e.message);
        }
    }

    private onMapMoved():void {
        var center = this.map.getCenter().toArray();

        var lat:string = parseFloat(center[1]).toFixed(13);
        var lng:string = parseFloat(center[0]).toFixed(13);
        var coord:any[] = [lat,lng];
        
        EventBus.dispatchEvent(EditorEvent.COORDINATES_CHANGED, coord);
    }
}
