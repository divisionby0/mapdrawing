///<reference path="PlanetFinder.ts"/>
///<reference path="MoonFinder.ts"/>
///<reference path="SkyTransform.ts"/>
///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
///<reference path="PlanetFinder.ts"/>
///<reference path="MoonFinder.ts"/>
///<reference path="SkyTransform.ts"/>
///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
declare var star:any;
declare var planet:any;
declare var conline:any;
declare var Observer:any;
class Starmap{
    private j$:any;
    private now:any = {};
    private moon:any = {pos: {ra: 0, dec: 0}};

    private clipped:boolean = false;
    private hasBorder:boolean;
    private hasConstellationsLines:boolean = true;
    private hasColoredStars:boolean = false;

    private constellationColor:string = "#d8d8d8";
    private starColor:string;
    private bgcolor:string;
    private borderColor:string;
    private borderWeight:number;
    private containerId:string = "";

    private ver:string = "0.0.6";

    private coeff:number = 1;
    
    private borderCanvas:any;
    private borderContainerContext:any;
    
    private canvas:any;
    private context:any;
    private starSize:number = 1.1;
    private nearStarSize:number = 2.1;
    private farStarSize:number = 0.7;
    
    private clipArcRadius:number;
    private constellationLineWidth:number = 0.4;

    private currentCoord:any;
    private currentDate:string;

    constructor(j$:any, containerId:string, coeff:number, parameters:any){
        console.log("new Starmap ver="+this.ver);
        
        this.j$ = j$;
        this.containerId = containerId;
        this.coeff = coeff;

        this.bgcolor = parameters.backgroundColor;
        this.starColor = parameters.starColor;
        this.constellationColor = parameters.constellationColor;
        this.hasConstellationsLines = parameters.hasConstellations;
        this.hasColoredStars = parameters.hasColoredStars;
        this.hasBorder = parameters.hasBorder;
        this.borderColor = parameters.borderColor;
        this.borderWeight = parameters.borderWeight;
        
        this.constellationLineWidth *= this.coeff; 
        
        this.borderCanvas = this.j$("<canvas style='position:absolute; width: 100%; height: 100%;'></canvas>");

        var parent:any = this.j$("#"+this.containerId).parent();
        parent.append(this.borderCanvas);

        this.borderContainerContext = this.borderCanvas[0].getContext( "2d" );

        this.canvas = document.getElementById( this.containerId );
        if ( !this.canvas || !this.canvas.getContext ) return;
        this.context = this.canvas.getContext( "2d" );
        
        this.create();
    }

    private create():void{
        this.init_stars( star );
        this.init_planets( planet );
        this.now = new Observer();
        this.refresh();
        this.setDateNow();
    }

    public destroy():void{
        
    }

    public setCoord(coord:any):void{
        this.currentCoord = coord;

        var n = Date.parse( this.currentDate );

        var d = new Date( n );
        this.now.setDate( d );

        var lon = this.currentCoord[0];
        var lat = this.currentCoord[1];

        if ( lon >= -180 && lon < 360 )
            this.now.setLonDegrees( lon );

        if ( lat >= -90 && lat <= 90 )
            this.now.setLatDegrees( lat );

        this.refresh();
    }

    public setDate(date:string):void {
        this.currentDate = date;
        var n = Date.parse( date );
        var d:any = new Date( n );
        this.now.setDate( d );
        this.refresh();
    }

    public setHasBorder(value:boolean):void{
        this.clipped = false;
        this.hasBorder = value;
        this.refresh();
    }
    
    public setHasColoredStars(value:boolean):void{
        this.hasColoredStars = value;
        this.init_stars(star);
        this.refresh();
    }

    public setBorderColor(value:string):void{
        this.borderColor = value;
    }
    public setBorderWeight(value:number):void{
        this.borderWeight = value;
    }

    public setStarColor(value:string):void{
        this.starColor = value;
    }

    public setBackgroundColor(value:string):void{
        this.bgcolor = value;
    }

    public setConstellationColor(value:string):void{
        this.constellationColor = value;
    }
    
    public setHasConstellations(value:boolean):void{
        this.hasConstellationsLines = value;
        this.refresh();
    }


    public setContainer(value:string):void{
        this.containerId = value;
    }
    
    public resize(w:number, h:number):void{
        this.borderCanvas.attr("width", w);
        this.borderCanvas.attr("height", h);

        this.borderCanvas.width(w+"px");
        this.borderCanvas.height(h+"px");
    }

    public refresh()
    {
        this.draw_sky( this.context, this.canvas.width, this.canvas.height );
    }

    private draw_sky( context, w, h )
    {
        var i:number;

        PlanetFinder.find(planet[ 2 ], null, this.now.jd);

        context.beginPath();
        context.rect(0, 0, w, h);
        context.fillStyle = "rgba(0,0,0,0)";
        context.fill();

        context.clearRect( 0, 0, w, h );
        this.borderContainerContext.clearRect( 0, 0, w, h );

        if(this.bgcolor == null || this.bgcolor == undefined || this.bgcolor == ""){
            this.bgcolor = "rgba(0,0,0,0)";
        }
        
        var clipArcRadius:number = w / 2;

        context.fillStyle = this.bgcolor;

        context.beginPath();
        context.arc( w / 2, h / 2, clipArcRadius, 0, 2 * Math.PI );
        context.closePath();
        context.fill();
        context.clip();

        context.lineWidth = 1;
        
        for ( i = 0; i < star.length; i++ ) {
            SkyTransform.execute( star[ i ].pos, this.now, w, h);
            if ( star[ i ].pos.visible ) {
                this.draw_star(context, star[ i ]);
            }
        }

        if ( this.hasConstellationsLines ) {
            context.strokeStyle = this.constellationColor;
            for ( i = 0; i < conline.length; i++ ) {
                this.draw_line(context, star[conline[i][0]], star[conline[i][1]]);
            }
        }

        for ( i = 0; i < planet.lengthnets; i++ ) {
            if ( i != 2 ) {
                PlanetFinder.find( planet[ i ], planet[ 2 ], this.now.jd );
                SkyTransform.execute( planet[ i ].pos, this.now, w, h);
            }
            if ( planet[ i ].pos.visible )
                this.draw_planet( context, planet[ i ]);
        }

        MoonFinder.find(this.moon, planet[ 2 ], this.now.jd );
        SkyTransform.execute( this.moon.pos, this.now, w, h);
        
        // draw border using stroke
        if(this.hasBorder && this.borderColor!=null && this.borderColor!=undefined && this.borderColor!=""){
            this.borderContainerContext.strokeStyle=this.borderColor;
            this.borderContainerContext.lineWidth = this.borderWeight*this.coeff;
            this.borderContainerContext.beginPath();
            this.borderContainerContext.arc(w / 2, h / 2, w / 2-this.borderWeight*this.coeff/2, 0, 2 * Math.PI);
            this.borderContainerContext.stroke();
        }
    }

    private init_stars( collection )
    {
        var clut:any = [
            "#AEC1FF",  /* bv = -0.4 */
            "#C5D3FF",
            "#EAEDFF",
            "#FFF6F3",
            "#FFEAD3",
            "#FFE1B4",
            "#FFD7A6",
            "#FFC682",
            "#FF4500"   /* bv =  2.0 */
        ];

        var len:any = collection.length;

        for ( var i = 0; i < len; i++ ) {
            var currentStar:any = collection[ i ];

            if ( currentStar.mag < 3.5 ) {
                // near focused stars
                var cindex = Math.round( 8 * ( currentStar.bv + 0.4 ) / 2.4 );
                cindex = Math.max( 0, Math.min( 8, cindex ));

                if(this.hasColoredStars == true){
                    currentStar.color = clut[ cindex ];
                }
                else{
                    if(this.starColor!=null && this.starColor!=undefined && this.starColor!=""){
                        // template color
                        currentStar.color = this.starColor;
                    }
                    else{
                        // automatic color
                        currentStar.color = clut[ cindex ];
                    }
                }

                currentStar.radius = (this.nearStarSize - 0.6 * currentStar.mag) * this.starSize * this.coeff;   // 1.0 to 4.0
                currentStar.bright = true;
            }
            else {
                // far unfocused stars
                var gray = 160 - Math.round(( currentStar.mag - 3.5 ) * 80.0 );

                if(this.hasColoredStars == true){
                    currentStar.color = "#" + ( 1 << 24 | gray << 16 | gray << 8 | gray ).toString( 16 ).slice( 1 );
                }
                else{
                    if(this.starColor!=null && this.starColor!=undefined && this.starColor!=""){
                        // template color
                        currentStar.color = this.starColor;
                    }
                    else{
                        // automatic color
                        currentStar.color = "#" + ( 1 << 24 | gray << 16 | gray << 8 | gray ).toString( 16 ).slice( 1 );
                    }
                }
                currentStar.radius = this.farStarSize * this.coeff;
                currentStar.bright = false;
            }
        }
    }

    private init_planets( collection )
    {
        var seps = 0.397777156;
        var ceps = 0.917482062;

        var i;
        var so, co, si, ci, sw, cw, f1, f2;

        for ( i = 0; i < 9; i++ ) {
            var currentPlanet:any = collection[ i ];

            so = Math.sin( currentPlanet.o );
            co = Math.cos( currentPlanet.o );
            si = Math.sin( currentPlanet.i );
            ci = Math.cos( currentPlanet.i );
            sw = Math.sin( currentPlanet.wb - currentPlanet.o );
            cw = Math.cos( currentPlanet.wb - currentPlanet.o );

            f1 = cw * so + sw * co * ci;
            f2 = cw * co * ci - sw * so;

            currentPlanet.P = [];
            currentPlanet.Q = [];
            currentPlanet.P[ 0 ] = cw * co - sw * so * ci;
            currentPlanet.P[ 1 ] = ceps * f1 - seps * sw * si;
            currentPlanet.P[ 2 ] = seps * f1 + ceps * sw * si;
            currentPlanet.Q[ 0 ] = -sw * co - cw * so * ci;
            currentPlanet.Q[ 1 ] = ceps * f2 - seps * cw * si;
            currentPlanet.Q[ 2 ] = seps * f2 + ceps * cw * si;

            switch ( i ) {
                case 2:  currentPlanet.radius = 5 * this.coeff;  break;
                case 8:  currentPlanet.radius = 2 * this.coeff;  break;
                default: currentPlanet.radius = 3 * this.coeff;  break;
            }
            currentPlanet.bright = true;
        }
    }

    private draw_star( context, s )
    {
        context.fillStyle = s.color;
        context.beginPath();
        
        context.arc( s.pos.x, s.pos.y, s.radius, 0, 2 * Math.PI );
        
        context.closePath();
        context.fill();
    }

    private draw_line( context, s1, s2 )
    {
        if ( s1.pos.visible && s2.pos.visible ) {
            context.beginPath();
            context.moveTo( s1.pos.x, s1.pos.y );
            
            context.lineWidth = this.constellationLineWidth;
            context.lineTo( s2.pos.x, s2.pos.y );
            
            context.stroke();
        }
    }
    private draw_planet( context, p )
    {
        this.draw_star( context, p );
    }
    
    private setDateNow(){
        var d = Date(Date.now());
        // Converting the number of millisecond in date string
        var a = d.toString();

        var n = Date.parse( a );
        var d:any = new Date( n );
        this.now.setDate( d );
        this.refresh();
    }
}