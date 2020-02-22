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
declare var dso:any;
declare var Observer:any;
class Starmap{
    private j$:any;
    private now:any = {};
    private moon:any = {pos: {ra: 0, dec: 0}};

    private clipped:boolean = false;
    private ck_starlabels:boolean = false;
    private ck_conlabels:boolean = false;
    private ck_dsos:boolean = false;
    private ck_conlines:boolean = true;
    private hasBorder:boolean;
    private hasConstellationsLines:boolean = true;
    private hasColoredStars:boolean = false;

    private constellationColor:string = "#d8d8d8";
    private starColor:string;
    private bgcolor:string;
    private borderColor:string;
    private borderWeight:number;
    private containerId:string = "";

    private ver:string = "0.0.4";

    private coeff:number = 1;

    //private borderContainerId:string = "starmapBorder";
    private borderCanvas:any;
    private borderContainerContext:any;

    constructor(j$:any, containerId:string, coeff:number){
        this.j$ = j$;
        this.containerId = containerId;
        this.coeff = coeff;

        this.borderCanvas = this.j$("<canvas style='position:absolute; width: 100%; height: 100%;'></canvas>");

        var parent:any = this.j$("#"+this.containerId).parent();
        parent.append(this.borderCanvas);

        console.log("Starmap ver="+this.ver);
        EventBus.addEventListener(EditorEvent.CONSTELLATIONS_CHANGED, (value)=>this.onConstellationsChanged(value));
        EventBus.addEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, (value)=>this.onCircleBorderChanged(value));
        EventBus.addEventListener(EditorEvent.STARS_CHANGED, (value)=>this.onStarsChanged(value));
    }

    public setHasBorder(value:boolean):void{
        this.clipped = false;
        this.hasBorder = value;
    }
    
    public setHasColoredStars(value:boolean):void{
        this.hasColoredStars = value;
    }

    public setBorderColor(value:string):void{
        this.borderColor = value;
    }
    public setBorderWeight(value:number):void{
        this.borderWeight = value;
    }

    public setBackgroundColor(value:string):void{
        this.bgcolor = value;
    }

    public setConstellationColor(value:string):void{
        this.constellationColor = value;
    }

    public setStarColor(value:string):void{
        this.starColor = value;
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

    public create():void{
        this.init_stars( star );
        this.init_dsos( dso );
        this.init_planets( planet );
        this.now = new Observer();
        this.set_user_obs();
        this.refresh();
        this.setDateNow();
    }

    public refresh()
    {
        var canvas:any = document.getElementById( this.containerId );
        if ( !canvas || !canvas.getContext ) return;
        var context = canvas.getContext( "2d" );

        var canvas:any = document.getElementById( this.containerId );
        this.borderContainerContext = this.borderCanvas[0].getContext( "2d" );
        
        this.draw_sky( context, canvas.width, canvas.height );
    }

    public update():void
    {
        var dt:any = document.getElementById( "user_date" );
        var lon:any = document.getElementById( "user_lon" );
        var lat:any = document.getElementById( "user_lat" );
        var clin:any = document.getElementById( "constellationLinesButton" );

        var n = Date.parse( dt.value );
        if ( isNaN( n )) {
            alert( "Your browser doesn't think\n'" + dt.value + "'\nis a valid date." );
            this.set_user_obs();
            return;
        }
        var d:any = new Date( n );
        this.now.setDate( d );

        if ( lon.value >= -180 && lon.value < 360 )
            this.now.setLonDegrees( lon.value );

        if ( lat.value >= -90 && lat.value <= 90 )
            this.now.setLatDegrees( lat.value );

        this.ck_conlines = clin.checked;

        this.set_user_obs();
        this.refresh();
    }

    private draw_sky( context, w, h )
    {
        var totalStars:number = star.length;
        var totalLines:number;
        var totalPlanets:number = 0;

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

        for ( var i = 0; i < totalStars; i++ ) {
            var currentStar:any = star[ i ];
            SkyTransform.execute( currentStar.pos, this.now, w, h);
            if ( currentStar.pos.visible ) {
                this.draw_star(context, currentStar);
            }
        }


        if ( this.hasConstellationsLines ) {
            context.strokeStyle = this.constellationColor;
            totalLines = conline.length;
            for ( i = 0; i < totalLines; i++ ) {
                var currentConline:any = conline[i];
                this.draw_line(context, star[currentConline[0]], star[currentConline[1]]);
            }
        }

        for ( i = 0; i < totalPlanets; i++ ) {
            var currentPlanet:any = planet[ i ];
            if ( i != 2 ) {
                PlanetFinder.find( currentPlanet, planet[ 2 ], this.now.jd );
                SkyTransform.execute( currentPlanet.pos, this.now, w, h);
            }
            if ( currentPlanet.pos.visible )
                this.draw_planet( context, currentPlanet);
        }

        MoonFinder.find(this.moon, planet[ 2 ], this.now.jd );

        SkyTransform.execute( this.moon.pos, this.now, w, h);
        if ( this.moon.pos.visible ){
            this.draw_moon( context );
        }
        
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

                currentStar.radius = 3.1 - 0.6 * currentStar.mag;   // 1.0 to 4.0
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

                currentStar.radius = 0.7;
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
                case 2:  currentPlanet.radius = 5;  break;
                case 8:  currentPlanet.radius = 2;  break;
                default: currentPlanet.radius = 3;  break;
            }
            currentPlanet.bright = true;
        }
    }


    private init_dsos( dso ):void
    {
        var i:number;
        var clut = [
            "#A0A040",   /* 1 open cluster      */
            "#A0A040",   /* 2 globular cluster  */
            "#40A060",   /* 3 nebula            */
            "#40A060",   /* 4 planetary nebula  */
            "#40A060",   /* 5 supernova remnant */
            "#A04040",   /* 6 galaxy            */
            "#808080"    /* 7 other             */
        ];

        var len = dso.length;
        for ( i = 0; i < len; i++ ) {
            dso[ i ].color = clut[ dso[ i ].type - 1 ];
            dso[ i ].offsetx = 4;
            dso[ i ].offsety = -3;

            switch ( dso[ i ].catalog ) {
                case 1:  dso[ i ].name = "M" + dso[ i ].id.toString(); break;
                case 2:  dso[ i ].name = dso[ i ].id.toString(); break;
                case 0:  dso[ i ].name = dso[ i ].id == 2 ? "SMC" : "LMC"; break;
                default: dso[ i ].name = " ";
            }

            /* special cases */

            switch ( dso[ i ].catalog ) {
                case 1:
                    switch ( dso[ i ].id ) {
                        case 8:  dso[ i ].offsetx =   4; dso[ i ].offsety = 6; break;
                        case 81: dso[ i ].offsetx = -24; dso[ i ].offsety = 0; break;
                        case 86: dso[ i ].offsetx = -24; break;
                        default: break;
                    }
                    break;
                case 2:
                    switch ( dso[ i ].id ) {
                        case 869:  dso[ i ].name = "869/884"; break;
                        default: break;
                    }
                    break;
                default: break;
            }
        }
    }

    private set_user_obs()
    {
        var dt:any = new Date().toString(); //Thu Feb 22 2018 14:13:07 GMT-0500

        var lon:any = -75;
        var lat:any = 40;
        var slab:any = 0;
        var clab:any = 0;
        var idso:any = 1;
        var clin:any = 1;

        var d = this.now.getDate();
        dt.value = d.toString().slice( 0, 33 );
        lon.value = this.now.getLonDegrees();
        lat.value = this.now.getLatDegrees();
        slab.checked = this.ck_starlabels;
        clab.checked = this.ck_conlabels;
        idso.checked = this.ck_dsos;
        clin.checked = this.ck_conlines;
    }

    private draw_star( context, s )
    {
        context.fillStyle = s.color;
        context.beginPath();

        var radius:number = s.radius * 1.3 * this.coeff;

        context.arc( s.pos.x, s.pos.y, radius, 0, 2 * Math.PI );
        context.closePath();
        context.fill();
    }

    private draw_line( context, s1, s2 )
    {
        if ( s1.pos.visible && s2.pos.visible ) {
            context.beginPath();
            context.moveTo( s1.pos.x, s1.pos.y );
            context.lineWidth = 0.4 * this.coeff;
            context.lineTo( s2.pos.x, s2.pos.y );
            context.stroke();
        }
    }
    private draw_planet( context, p )
    {
        this.draw_star( context, p );
    }

    private draw_moon( context )
    {
        context.globalCompositeOperation = "source-over";
        var i = Math.floor(( Astro.raddeg( this.moon.phase ) + 180 ) / 12 );
        var imageElement = document.getElementById("starImage");
        context.drawImage( imageElement, i * 16, 0, 16, 16, this.moon.pos.x - 8, this.moon.pos.y - 8, 16, 16 );
        context.globalCompositeOperation = "lighter";
    }

    private setDateNow(){
        var d = Date(Date.now());
        // Converting the number of millisecond in date string
        var a = d.toString();
        this.j$("#user_date").val(a);
    }

    private onConstellationsChanged(value:boolean):void {
        this.hasConstellationsLines = value;
        this.update();
    }

    private onCircleBorderChanged(value:boolean):void {
        this.hasBorder = value;
        this.update();
    }

    private onStarsChanged(value:boolean):void{
        this.hasColoredStars = value;
        this.init_stars(star);
        this.update();
    }
}