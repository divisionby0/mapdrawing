class MapParameters{
    private container:string;
    private style:string;
    private zoom:number;
    private center:any;
    private bounds:any;
    private bearing:any;
    private pitch:any;
    private preserveDrawingBuffer:boolean = true;
    private attributionControl:boolean = false;
    private fadeDuration:number = 0;

    constructor(style:string, zoom:number, center:any, bounds:any, bearing:any, pitch:any){
        this.style = style;
        this.zoom = zoom;
        this.center = center;
        this.bounds = bounds;
        this.bearing = bearing;
        this.pitch = pitch;
    }
    
    public getContainer():string{
        return this.container;
    }
    public setContainer(value:string):void{
        this.container = value;
    }
    
    public getZoom():number{
        return this.zoom;
    }
    public setZoom(value:number):void{
        this.zoom = value;
    }

    public getCenter():any{
        return this.center;
    }
    public setCenter(value:any):void{
        this.center = value;
    }

    public setStyle(value:string):void{
        this.style = value;
    }
    
    public getBounds():any{
        return this.bounds;
    }
    public setBounds(value:any):void{
        this.bounds = value;
    }

    public toObject():any{
        return {container: this.container,
            center: this.center,
            zoom: this.zoom,
            style: this.style,
            bearing: this.bearing,
            pitch: this.pitch,
            preserveDrawingBuffer: this.preserveDrawingBuffer,
            fadeDuration: this.fadeDuration,
            attributionControl: this.attributionControl,
            bounds:this.bounds
        };
    }
}