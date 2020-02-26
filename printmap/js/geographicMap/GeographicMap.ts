declare var mapboxgl:any;
class GeographicMap{
    private j$:any;
    
    private map:any;
    private zoom:number;
    private position:string[];
    private lng:string;
    private currentStyle:string;
    
    constructor(j$:any, parameters:any){
        this.j$ = j$;
        this.zoom = parameters.zoom;
        this.position = parameters.position;
        this.currentStyle = parameters.currentStyle;
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
            this.map.destroy();
            this.map = null;
        }
        this.createMap();
    }

    private createMap():void{
        console.log("position=",this.position);
        try {
            this.map = new mapboxgl.Map({
                container: 'map',
                center: this.position, // lng, lat
                zoom: this.zoom,
                fadeDuration: 0,
                style: this.currentStyle
            });

            this.map.on('moveend', ()=>this.onMapMoved());
            this.onMapMoved();
        } catch (e) {
            alert(e.message);
        }
    }

    private onMapMoved():void {
        var center = this.map.getCenter().toArray();

        var zoom:string = parseFloat(this.map.getZoom()).toFixed(6);
        var lat:string = parseFloat(center[1]).toFixed(6);
        var lng:string = parseFloat(center[0]).toFixed(6);
        console.log("lat=",lat,"lng=",lng);
    }
}
