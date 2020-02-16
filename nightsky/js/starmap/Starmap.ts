///<reference path="PlanetFinder.ts"/>
///<reference path="MoonFinder.ts"/>
///<reference path="SkyTransform.ts"/>
declare var star:any;
declare var planet:any;
declare var conline:any;
declare var dso:any;
declare var Observer:any;
class Starmap{

    private j$:any;
    private now:any = {};
    private moon:any = {pos: {ra: 0, dec: 0}};

    private clipped:boolean = true;
    private ck_starlabels:boolean = false;
    private ck_conlabels:boolean = false;
    private ck_dsos:boolean = false;
    private ck_conlines:boolean = true;
    
    private constellationColor:string = "#d8d8d8";
    private starNameColor:string = "#d8d8d8";
    private bgcolor:string;
    private containertId:string = "";
    
    constructor(j$:any, containerId:string){
        this.j$ = j$;
        this.containertId = containerId;
    }
    
    public setBackgroundColor(value:string):void{
        this.bgcolor = value;
    }
    
    public setConstellationColor(value:string):void{
        this.constellationColor = value;
    }
    
    public setStarNameColor(value:string):void{
        this.starNameColor = value;
    }
    
    public setContainer(value:string):void{
        this.containertId = value;
    }
    
    public create():void{
        this.init_stars( star );
        this.init_planets( planet );
        this.now = new Observer();
        this.set_user_obs();
        this.refresh();

        this.setDateNow();
    }
    
    public refresh()
    {
        var canvas:any = document.getElementById( this.containertId );
        if ( !canvas || !canvas.getContext ) return;
        var context = canvas.getContext( "2d" );
        this.draw_sky( context, canvas.width, canvas.height );
    }
    
    private draw_sky( context, w, h )
    {
        /* ----- calculate Earth (sun) position */
        PlanetFinder.find(planet[ 2 ], null, this.now.jd);
        var azalt = SkyTransform.execute( planet[ 2 ].pos, this.now, w, h );

        /* ---- background, blue if sun up, black otherwise */
        context.clearRect( 0, 0, w, h );

        // TODO смена цветов звезд и полосок
        //context.fillStyle = bgcolor;  // planet[ 2 ].pos.visible ? "#182448" : "#000000";
        if(this.bgcolor){
            context.fillStyle = this.bgcolor;  // planet[ 2 ].pos.visible ? "#182448" : "#000000";
        }
        else{
            console.log("no background color information - making transparent");
            context.fillStyle = "rgba(255, 255, 255, 0)";
        }

        context.beginPath();
        context.arc( w / 3, h / 3, w / 3, 0, 2 * Math.PI );

        context.closePath();
        context.fill();
        if ( !this.clipped ) {
            context.clip();
            this.clipped = true;
        }

        //context.globalCompositeOperation = "xor";
        context.lineWidth = 1;

        /* ----- horizon labels */
        context.textBaseline = "middle";
        context.fillStyle = this.starNameColor;
        context.font = "12px Sans-Serif";

        /* ---- stars */
        var len = star.length;
        for ( var i = 0; i < len; i++ ) {
            SkyTransform.execute( star[ i ].pos, this.now, w, h );
            if ( star[ i ].pos.visible ) {
                this.draw_star(context, star[i]);
            }
        }

        /* ---- constellation lines */
        if ( this.ck_conlines ) {
            //context.strokeStyle = "#303030";
            context.strokeStyle = this.constellationColor;
            len = conline.length;
            for ( i = 0; i < len; i++ )
                this.draw_line( context, star[ conline[ i ][ 0 ]], star[ conline[ i ][ 1 ]] );
        }

        /* ---- planets */
        for ( i = 0; i < 9; i++ ) {
            if ( i != 2 ) {
                PlanetFinder.find( planet[ i ], planet[ 2 ], this.now.jd );
                SkyTransform.execute( planet[ i ].pos, this.now, w, h );
            }
            if ( planet[ i ].pos.visible )
                this.draw_planet( context, planet[ i ]);
        }

        /* ----- Moon */
        MoonFinder.find(this.moon, planet[ 2 ], this.now.jd );

        SkyTransform.execute( this.moon.pos, this.now, w, h );
        if ( this.moon.pos.visible )
            this.draw_moon( context );
    }
    
    private init_stars( star )
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

        var len:any = star.length;
        for ( var i = 0; i < len; i++ ) {
            if ( star[ i ].mag < 3.5 ) {
                var cindex = Math.round( 8 * ( star[ i ].bv + 0.4 ) / 2.4 );
                cindex = Math.max( 0, Math.min( 8, cindex ));
                star[ i ].color = clut[ cindex ];
                star[ i ].radius = 3.1 - 0.6 * star[ i ].mag;   // 1.0 to 4.0
                star[ i ].bright = true;
            }
            else {
                var gray = 160 - Math.round(( star[ i ].mag - 3.5 ) * 80.0 );
                star[ i ].color = "#" + ( 1 << 24 | gray << 16 | gray << 8 | gray ).toString( 16 ).slice( 1 );
                star[ i ].radius = 1;
                star[ i ].bright = false;
            }
        }
    }
    
    private init_planets( planet )
    {
        var seps = 0.397777156;
        var ceps = 0.917482062;

        var i;
        var so, co, si, ci, sw, cw, f1, f2;

        for ( i = 0; i < 9; i++ ) {
            so = Math.sin( planet[ i ].o );
            co = Math.cos( planet[ i ].o );
            si = Math.sin( planet[ i ].i );
            ci = Math.cos( planet[ i ].i );
            sw = Math.sin( planet[ i ].wb - planet[ i ].o );
            cw = Math.cos( planet[ i ].wb - planet[ i ].o );

            f1 = cw * so + sw * co * ci;
            f2 = cw * co * ci - sw * so;

            planet[ i ].P = [];
            planet[ i ].Q = [];
            planet[ i ].P[ 0 ] = cw * co - sw * so * ci;
            planet[ i ].P[ 1 ] = ceps * f1 - seps * sw * si;
            planet[ i ].P[ 2 ] = seps * f1 + ceps * sw * si;
            planet[ i ].Q[ 0 ] = -sw * co - cw * so * ci;
            planet[ i ].Q[ 1 ] = ceps * f2 - seps * cw * si;
            planet[ i ].Q[ 2 ] = seps * f2 + ceps * cw * si;

            switch ( i ) {
                case 2:  planet[ i ].radius = 5;  break;
                case 8:  planet[ i ].radius = 2;  break;
                default: planet[ i ].radius = 3;  break;
            }
            planet[ i ].bright = true;
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
        context.arc( s.pos.x, s.pos.y, s.radius* 1.3, 0, 2 * Math.PI );
        context.closePath();
        context.fill();
    }
    
    private draw_line( context, s1, s2 )
    {
        if ( s1.pos.visible && s2.pos.visible ) {
            context.beginPath();
            context.moveTo( s1.pos.x, s1.pos.y );
            context.lineWidth = 0.4;
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
}
