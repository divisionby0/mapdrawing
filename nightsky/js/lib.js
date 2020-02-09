var Astro =
{
    JD_J2000: 2451545.0,
    JD_1970: 2440587.5,
    YEARDAYS: 365.2422,
    EQtoECL: 1,
    ECLtoEQ: -1,

    range: function( v, r ) {
        return v - r * Math.floor( v / r );
    },

    degrad: function( x ) {
        return x * 1.74532925199433e-2;
    },

    raddeg: function( x ) {
        return x * 5.729577951308232e1;
    },

    hrrad: function( x ) {
        return x * 2.617993877991494e-1;
    },

    radhr: function( x ) {
        return x * 3.819718634205488;
    },

    /* from[] and to[] contain (azimuth, altitude) and
     (hour angle, declination) */
    aa_hadec: function( lat, from, to )
    {
        var slat = Math.sin( lat );
        var clat = Math.cos( lat );
        var sx   = Math.sin( from[ 0 ] );
        var cx   = Math.cos( from[ 0 ] );
        var sy   = Math.sin( from[ 1 ] );
        var cy   = Math.cos( from[ 1 ] );

        to[ 0 ] = Math.atan2( -cy * sx, -cy * cx * slat + sy * clat );
        to[ 1 ] = Math.asin( sy * slat + cy * clat * cx );
    },

    /* from[] and to[] contain (lam, bet) and (ra, dec) */
    /* if sw = EQtoECL, from[] is (ra, dec) */
    ecl_eq: function( sw, from, to )
    {
        var eps = Astro.degrad( 23.45229444 );
        var seps = Math.sin( eps );
        var ceps = Math.cos( eps );

        var sy = Math.sin( from[ 1 ] );
        var cy = Math.cos( from[ 1 ] );
        if ( Math.abs( cy ) < 1e-20 ) cy = 1e-20;
        var ty = sy / cy;
        var cx = Math.cos( from[ 0 ] );
        var sx = Math.sin( from[ 0 ] );

        to[ 1 ] = Math.asin(( sy * ceps ) - ( cy * seps * sx * sw ));
        to[ 0 ] = Math.atan2((( sx * ceps ) + ( ty * seps * sw )), cx );
        to[ 0 ] = Astro.range( to[ 0 ], 2 * Math.PI );
    },

    precess: function( jd1, jd2, coord )
    {
        var zeta_A, z_A, theta_A;
        var T;
        var A, B, C;
        var alpha, delta;
        var alpha_in, delta_in;
        var from_equinox, to_equinox;
        var alpha2000, delta2000;

        from_equinox = ( jd1 - Astro.JD_J2000 ) / Astro.YEARDAYS;
        to_equinox   = ( jd2 - Astro.JD_J2000 ) / Astro.YEARDAYS;
        alpha_in = coord[ 0 ];
        delta_in = coord[ 1 ];

        /* From from_equinox to 2000.0 */

        if ( from_equinox != 0.0 ) {
            T = from_equinox / 100.0;
            zeta_A  = Astro.degrad( T * ( 0.6406161 + T * (  8.39e-5  + T * 5.0e-6 )));
            z_A     = Astro.degrad( T * ( 0.6406161 + T * (  3.041e-4 + T * 5.1e-6 )));
            theta_A = Astro.degrad( T * ( 0.5567530 + T * ( -1.185e-4 + T * 1.16e-5 )));

            A =  Math.sin( alpha_in - z_A ) *  Math.cos( delta_in );
            B =  Math.cos( alpha_in - z_A )
                *  Math.cos( theta_A ) * Math.cos( delta_in )
                +  Math.sin( theta_A ) * Math.sin( delta_in );
            C = -Math.cos( alpha_in - z_A )
                *  Math.sin( theta_A ) * Math.cos( delta_in )
                +  Math.cos( theta_A ) * Math.sin( delta_in );

            alpha2000 = Math.atan2( A, B ) - zeta_A;
            alpha2000 = Astro.range( alpha2000, 2 * Math.PI );
            delta2000 = Math.asin( C );
        }
        else {
            alpha2000 = alpha_in;
            delta2000 = delta_in;
        }

        /* From 2000.0 to to_equinox */

        if ( to_equinox != 0.0 ) {
            T = to_equinox / 100.0;
            zeta_A  = Astro.degrad( T * ( 0.6406161 + T * (  8.39e-5  + T * 5.0e-6 )));
            z_A     = Astro.degrad( T * ( 0.6406161 + T * (  3.041e-4 + T * 5.1e-6 )));
            theta_A = Astro.degrad( T * ( 0.5567530 + T * ( -1.185e-4 + T * 1.16e-5 )));

            A = Math.sin( alpha2000 + zeta_A ) * Math.cos( delta2000 );
            B = Math.cos( alpha2000 + zeta_A )
                * Math.cos( theta_A ) * Math.cos( delta2000 )
                - Math.sin( theta_A ) * Math.sin( delta2000 );
            C = Math.cos( alpha2000 + zeta_A )
                * Math.sin( theta_A ) * Math.cos( delta2000 )
                + Math.cos( theta_A ) * Math.sin( delta2000 );

            alpha = Math.atan2( A, B ) + z_A;
            alpha = Astro.range( alpha, 2.0 * Math.PI );
            delta = Math.asin( C );
        }
        else {
            alpha = alpha2000;
            delta = delta2000;
        }

        coord[ 0 ] = alpha;
        coord[ 1 ] = delta;
    }
};
function Observer()
{
    var d = new Date();
    this.jd = Astro.JD_1970 + d.getTime() / 86400000.0;
    this.longitude = Astro.degrad( -0.25 * d.getTimezoneOffset());
    this.latitude = Astro.degrad( 40.0 );
    this.initLST();
}

Observer.prototype.setJD = function( jd ) {
    this.jd = jd;
    this.initLST();
};

Observer.prototype.getDate = function() {
    return new Date( Math.round(( this.jd - Astro.JD_1970 ) * 86400000.0 ));
};

Observer.prototype.setDate = function( date ) {
    this.jd = Astro.JD_1970 + date.getTime() / 86400000.0;
    this.initLST();
};

Observer.prototype.incHour = function( count ) {
    this.jd += count / 24.0;
    this.initLST();
};

Observer.prototype.getLatDegrees = function() {
    return Math.round( Astro.raddeg( this.latitude ));
};

Observer.prototype.setLatDegrees = function( lat ) {
    this.latitude = Astro.degrad( lat );
};

Observer.prototype.getLonDegrees = function() {
    return Math.round( Astro.raddeg( this.longitude ));
};

Observer.prototype.setLon = function( lon ) {
    this.longitude = lon;
    this.initLST();
};

Observer.prototype.setLonDegrees = function( lon ) {
    this.longitude = Astro.degrad( lon );
    this.initLST();
};

Observer.prototype.jd_day = function() {
    return Math.floor( this.jd - 0.5 ) + 0.5;
};

Observer.prototype.jd_hour = function() {
    return ( this.jd - this.jd_day() ) * 24.0;
};

Observer.prototype.initLST = function() {
    this.lst = Astro.range( this.gst() + this.longitude, 2 * Math.PI );
};

Observer.prototype.gst = function() {
    var t = ( this.jd_day() - Astro.JD_J2000 ) / 36525;
    var theta = 1.753368559146 + t * ( 628.331970688835
        + t * ( 6.770708e-6 + t * -1.48e-6 ));
    return Astro.range( theta + Astro.hrrad( this.jd_hour() ), 2 * Math.PI );
};
function skypos_transform( pos, now, w, h )
{
    var coord = [ pos.ra, pos.dec ];
    Astro.precess( Astro.JD_J2000, now.jd, coord );
    coord[ 0 ] = now.lst - coord[ 0 ];
    Astro.aa_hadec( now.latitude, coord, coord );
    if ( coord[ 1 ] < 0 )
        pos.visible = false;
    else {
        pos.visible = true;
        var tmp = 0.5 - coord[ 1 ] / Math.PI;
        pos.x = w * ( 0.5 - tmp * Math.sin( coord[ 0 ] ));
        pos.y = h * ( 0.5 - tmp * Math.cos( coord[ 0 ] ));
    }
    return coord;
}


function init_stars( star )
{
    var clut = [
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

    var len = star.length;
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


function init_dsos( dso )
{
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


function init_planets( planet )
{
    var seps = 0.397777156;
    var ceps = 0.917482062;

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


function find_planet( planet, earth, jd )
{
    function kepler( m, e )
    {
        var EPSILON = 1.0e-6;
        var d, ae = m;

        while ( true ) {
            d = ae - ( e * Math.sin( ae )) - m;
            if ( Math.abs( d ) < EPSILON ) break;
            d /= 1.0 - ( e * Math.cos( ae ));
            ae -= d;
        }
        return 2.0 *
            Math.atan( Math.sqrt(( 1.0 + e ) / ( 1.0 - e )) * Math.tan( ae / 2.0 ));
    }

    var t = ( jd - Astro.JD_J2000 ) / 36525.0;
    var m = planet.L - planet.wb + planet.dL * t;  /* mean anomaly */
    m = Astro.range( m, Math.PI * 2.0 );

    var v = kepler( m, planet.e );
    var cv = Math.cos( v );
    var sv = Math.sin( v );
    var r = ( planet.a * ( 1.0 - planet.e * planet.e )) / ( 1 + planet.e * cv );

    planet.hx = r * ( planet.P[ 0 ] * cv + planet.Q[ 0 ] * sv );
    planet.hy = r * ( planet.P[ 1 ] * cv + planet.Q[ 1 ] * sv );
    planet.hz = r * ( planet.P[ 2 ] * cv + planet.Q[ 2 ] * sv );

    var dx, dy, dz;
    if ( planet.name != "Earth" ) {
        dx = planet.hx - earth.hx;
        dy = planet.hy - earth.hy;
        dz = planet.hz - earth.hz;
    } else {
        dx = -planet.hx;
        dy = -planet.hy;
        dz = -planet.hz;
    }

    planet.pos.ra = Math.atan2( dy, dx );
    planet.pos.dec = Math.atan2( dz, Math.sqrt( dx * dx + dy * dy ));
}


function find_moon( moon, earth, jd )
{
    var P2 = Math.PI * 2.0;
    var ARC = 206264.8062;
    var T, L0, L, LS, D, F, DL, S, H, N, M, C;
    var mlon, mlat;

    /* calculate the Moon's ecliptic longitude and latitude */
    T  = ( jd - 2451545.0 ) / 36525.0;

    L0 =      Astro.range( 0.606433 + 1336.855225 * T, 1.0 );
    L  = P2 * Astro.range( 0.374897 + 1325.552410 * T, 1.0 );
    LS = P2 * Astro.range( 0.993133 +   99.997361 * T, 1.0 );
    D  = P2 * Astro.range( 0.827361 + 1236.853086 * T, 1.0 );
    F  = P2 * Astro.range( 0.259086 + 1342.227825 * T, 1.0 );

    DL = 22640 * Math.sin( L ) +
        -4586 * Math.sin( L - 2 * D ) +
        2370 * Math.sin( 2 * D ) +
        769 * Math.sin( 2 * L ) +
        -668 * Math.sin( LS ) +
        -412 * Math.sin( 2 * F ) +
        -212 * Math.sin( 2 * L - 2 * D ) +
        -206 * Math.sin( L + LS - 2 * D ) +
        192 * Math.sin( L + 2 * D ) +
        -165 * Math.sin( LS - 2 * D ) +
        -125 * Math.sin( D ) +
        -110 * Math.sin( L + LS ) +
        148 * Math.sin( L - LS ) +
        -55 * Math.sin( 2 * F - 2 * D );

    S  = F + ( DL + 412 * Math.sin( 2 * F ) + 541 * Math.sin( LS )) / ARC;
    H  = F - 2 * D;
    N  = -526 * Math.sin( H ) +
        44 * Math.sin( L + H ) +
        -31 * Math.sin( -L + H ) +
        -23 * Math.sin( LS + H ) +
        11 * Math.sin( -LS + H ) +
        -25 * Math.sin( -2 * L + F ) +
        21 * Math.sin( -L + F );

    /* epoch of date! */
    mlon = P2 * Astro.range( L0 + DL / 1296000.0, 1.0 );
    mlat = ( 18520.0 * Math.sin( S ) + N ) / ARC;

    /* convert Sun equatorial J2000 to ecliptic coordinates at epoch jd */
    /* "Earth" ra and dec are really geocentric Sun coordinates */
    var coord = [ earth.pos.ra, earth.pos.dec ];
    Astro.ecl_eq( Astro.EQtoECL, coord, coord );
    Astro.precess( Astro.JD_J2000, jd, coord );

    /* calculate Moon phase */
    D = mlon - coord[ 0 ];
    moon.phase = Math.acos( Math.cos( D ) * Math.cos( mlat ));
    if ( Math.sin( D ) < 0.0 )
        moon.phase = P2 - moon.phase;
    moon.phase -= Math.PI;

    /* convert Moon ecliptic to equatorial coordinates */
    coord[ 0 ] = mlon;
    coord[ 1 ] = mlat;
    Astro.ecl_eq( Astro.ECLtoEQ, coord, coord );
    Astro.precess( jd, Astro.JD_J2000, coord );
    moon.pos.ra = coord[ 0 ];
    moon.pos.dec = coord[ 1 ];

    /* calculate position angle of the bright limb */
    var sa  = Math.sin( earth.pos.ra - moon.pos.ra );
    var ca  = Math.cos( earth.pos.ra - moon.pos.ra );
    var sd0 = Math.sin( earth.pos.dec );
    var cd0 = Math.cos( earth.pos.dec );
    var sd  = Math.sin( moon.pos.dec );
    var cd  = Math.cos( moon.pos.dec );

    moon.posAngle = Math.atan2( cd0 * sa, sd0 * cd - cd0 * sd * ca );
}
var star = [
    {pos:{ra:0.023278,dec:-0.099615},mag: 4.61,bv: 1.04},
    {pos:{ra:0.036601,dec: 0.507726},mag: 2.06,bv:-0.11},
    {pos:{ra:0.040048,dec: 1.032357},mag: 2.27,bv: 0.34},
    {pos:{ra:0.040797,dec:-0.488479},mag: 5.42,bv: 0.42},
    {pos:{ra:0.041066,dec:-0.798445},mag: 3.88,bv: 1.03},
    {pos:{ra:0.045037,dec: 0.804112},mag: 5.03,bv: 0.40},
    {pos:{ra:0.043786,dec:-1.435078},mag: 5.28,bv: 1.05},
    {pos:{ra:0.049153,dec:-0.269969},mag: 4.89,bv: 0.49},
    {pos:{ra:0.050498,dec:-0.485197},mag: 5.41,bv: 1.34},
    {pos:{ra:0.051196,dec:-0.613187},mag: 5.25,bv: 0.44},
    {pos:{ra:0.053087,dec:-0.313083},mag: 5.25,bv: 1.48},
    {pos:{ra:0.057756,dec: 0.265004},mag: 2.83,bv:-0.23},
    {pos:{ra:0.063719,dec: 0.352673},mag: 4.80,bv: 1.57},
    {pos:{ra:0.063094,dec:-0.135796},mag: 5.12,bv: 1.62},
    {pos:{ra:0.063879,dec:-0.330439},mag: 4.44,bv: 1.66},
    {pos:{ra:0.074576,dec: 0.675122},mag: 4.61,bv: 0.06},
    {pos:{ra:0.079972,dec: 0.642024},mag: 4.52,bv: 0.05},
    {pos:{ra:0.084772,dec:-0.154006},mag: 3.56,bv: 1.22},
    {pos:{ra:0.087579,dec:-1.132277},mag: 4.23,bv: 0.58},
    {pos:{ra:0.089877,dec: 0.142947},mag: 5.37,bv: 1.34},
    {pos:{ra:0.092161,dec: 0.662677},mag: 5.18,bv: 0.42},
    {pos:{ra:0.093899,dec:-0.505826},mag: 5.18,bv: 1.00},
    {pos:{ra:0.094997,dec:-0.350074},mag: 5.12,bv: 1.82},
    {pos:{ra:0.108174,dec: 1.079157},mag: 5.40,bv: 0.00},
    {pos:{ra:0.112363,dec:-1.348340},mag: 2.80,bv: 0.62},
    {pos:{ra:0.114683,dec:-0.738381},mag: 2.39,bv: 1.09},
    {pos:{ra:0.114334,dec:-0.762360},mag: 3.94,bv: 0.17},
    {pos:{ra:0.122384,dec: 0.312293},mag: 5.06,bv: 1.65},
    {pos:{ra:0.123169,dec: 0.774829},mag: 5.17,bv: 0.03},
    {pos:{ra:0.121860,dec:-0.576085},mag: 4.81,bv: 1.64},
    {pos:{ra:0.124093,dec:-0.696648},mag: 5.43,bv: 1.56},
    {pos:{ra:0.131431,dec: 0.519265},mag: 5.23,bv: 0.24},
    {pos:{ra:0.132550,dec:-0.415175},mag: 5.19,bv: 0.12},
    {pos:{ra:0.138637,dec: 0.951592},mag: 4.73,bv:-0.10},
    {pos:{ra:0.137081,dec:-0.851784},mag: 4.77,bv: 0.02},
    {pos:{ra:0.137641,dec:-1.098825},mag: 4.37,bv:-0.07},
    {pos:{ra:0.137706,dec:-1.098961},mag: 4.54,bv: 0.15},
    {pos:{ra:0.143990,dec: 1.098365},mag: 4.16,bv: 0.14},
    {pos:{ra:0.142208,dec: 0.354205},mag: 5.38,bv: 1.08},
    {pos:{ra:0.142812,dec:-1.100100},mag: 5.09,bv: 0.04},
    {pos:{ra:0.153800,dec:-0.062706},mag: 5.20,bv: 0.56},
    {pos:{ra:0.157683,dec: 0.945421},mag: 5.08,bv:-0.11},
    {pos:{ra:0.160468,dec: 0.776473},mag: 5.13,bv: 1.60},
    {pos:{ra:0.161319,dec: 0.940679},mag: 3.66,bv:-0.20},
    {pos:{ra:0.160927,dec: 0.588515},mag: 4.36,bv:-0.14},
    {pos:{ra:0.162977,dec: 0.617837},mag: 5.48,bv: 0.88},
    {pos:{ra:0.168228,dec: 0.511585},mag: 4.37,bv: 0.87},
    {pos:{ra:0.170890,dec: 0.861398},mag: 5.43,bv: 1.64},
    {pos:{ra:0.171602,dec: 0.538623},mag: 3.27,bv: 1.28},
    {pos:{ra:0.174213,dec: 0.374169},mag: 5.36,bv: 1.16},
    {pos:{ra:0.176751,dec: 0.986761},mag: 2.23,bv: 1.17},
    {pos:{ra:0.179420,dec: 0.688683},mag: 5.33,bv: 0.89},
    {pos:{ra:0.183543,dec: 0.881609},mag: 4.80,bv:-0.11},
    {pos:{ra:0.180322,dec:-0.804335},mag: 4.59,bv: 0.97},
    {pos:{ra:0.189666,dec: 0.820736},mag: 4.94,bv: 0.18},
    {pos:{ra:0.185325,dec:-1.142633},mag: 5.39,bv: 0.50},
    {pos:{ra:0.190197,dec:-0.313927},mag: 2.04,bv: 1.02},
    {pos:{ra:0.189165,dec:-1.002920},mag: 4.36,bv: 0.00},
    {pos:{ra:0.195150,dec: 0.842723},mag: 4.54,bv:-0.07},
    {pos:{ra:0.192815,dec:-0.185170},mag: 4.76,bv: 1.01},
    {pos:{ra:0.197600,dec: 0.963800},mag: 5.42,bv: 0.04},
    {pos:{ra:0.195215,dec:-0.384079},mag: 5.24,bv: 0.33},
    {pos:{ra:0.208429,dec: 1.306335},mag: 5.41,bv:-0.08},
    {pos:{ra:0.201571,dec:-0.393082},mag: 5.50,bv: 0.98},
    {pos:{ra:0.203113,dec: 0.270099},mag: 5.38,bv: 1.65},
    {pos:{ra:0.205185,dec: 0.208984},mag: 5.50,bv: 0.97},
    {pos:{ra:0.206552,dec: 0.423543},mag: 4.06,bv: 1.12},
    {pos:{ra:0.214239,dec: 1.009077},mag: 3.44,bv: 0.57},
    {pos:{ra:0.213083,dec: 0.889565},mag: 4.89,bv:-0.11},
    {pos:{ra:0.212421,dec: 0.132383},mag: 4.43,bv: 1.50},
    {pos:{ra:0.213708,dec: 0.295668},mag: 5.07,bv: 0.51},
    {pos:{ra:0.217352,dec: 0.716962},mag: 4.53,bv:-0.15},
    {pos:{ra:0.221337,dec: 1.121330},mag: 5.39,bv: 0.49},
    {pos:{ra:0.218719,dec:-0.185781},mag: 5.19,bv: 0.50},
    {pos:{ra:0.212014,dec:-1.307659},mag: 5.07,bv: 1.37},
    {pos:{ra:0.221162,dec:-0.889890},mag: 5.22,bv: 0.36},
    {pos:{ra:0.231554,dec: 1.066818},mag: 4.82,bv: 0.53},
    {pos:{ra:0.229845,dec:-0.418981},mag: 5.46,bv: 1.24},
    {pos:{ra:0.231292,dec:-0.019969},mag: 4.77,bv: 1.57},
    {pos:{ra:0.239990,dec: 1.029269},mag: 4.83,bv: 1.21},
    {pos:{ra:0.239837,dec: 0.412392},mag: 5.47,bv: 1.00},
    {pos:{ra:0.247437,dec: 1.059706},mag: 2.47,bv:-0.15},
    {pos:{ra:0.247240,dec: 1.032905},mag: 4.63,bv: 0.96},
    {pos:{ra:0.244455,dec:-0.196640},mag: 5.31,bv: 1.52},
    {pos:{ra:0.247633,dec: 0.671942},mag: 3.87,bv: 0.13},
    {pos:{ra:0.240005,dec:-1.213474},mag: 5.45,bv: 1.09},
    {pos:{ra:0.249611,dec: 0.408712},mag: 4.42,bv: 0.94},
    {pos:{ra:0.252360,dec: 0.506010},mag: 5.42,bv: 1.08},
    {pos:{ra:0.255720,dec:-0.512385},mag: 4.31,bv:-0.16},
    {pos:{ra:0.299957,dec: 1.505468},mag: 4.25,bv: 1.21},
    {pos:{ra:0.274097,dec: 0.555092},mag: 5.50,bv:-0.05},
    {pos:{ra:0.272446,dec:-0.550685},mag: 5.50,bv: 0.08},
    {pos:{ra:0.274642,dec: 0.137706},mag: 4.28,bv: 0.96},
    {pos:{ra:0.275078,dec:-0.084416},mag: 5.43,bv: 1.11},
    {pos:{ra:0.274104,dec:-0.809789},mag: 5.36,bv: 0.90},
    {pos:{ra:0.286590,dec: 0.374780},mag: 5.34,bv:-0.03},
    {pos:{ra:0.297899,dec: 0.958540},mag: 5.17,bv: 0.69},
    {pos:{ra:0.288343,dec:-0.815394},mag: 3.31,bv: 0.89},
    {pos:{ra:0.296771,dec: 0.766932},mag: 5.03,bv: 0.11},
    {pos:{ra:0.295826,dec:-0.724084},mag: 5.21,bv: 0.16},
    {pos:{ra:0.293703,dec:-1.078182},mag: 5.37,bv: 0.88},
    {pos:{ra:0.299280,dec:-0.177713},mag: 3.45,bv: 1.16},
    {pos:{ra:0.303266,dec: 0.824528},mag: 4.25,bv:-0.07},
    {pos:{ra:0.308291,dec: 1.200413},mag: 5.29,bv:-0.02},
    {pos:{ra:0.304262,dec: 0.621696},mag: 2.06,bv: 1.58},
    {pos:{ra:0.298386,dec:-0.964222},mag: 3.92,bv:-0.08},
    {pos:{ra:0.310247,dec: 0.962544},mag: 4.33,bv: 0.17},
    {pos:{ra:0.310290,dec: 0.548465},mag: 5.16,bv: 0.23},
    {pos:{ra:0.311774,dec: 0.367125},mag: 4.66,bv: 1.03},
    {pos:{ra:0.312676,dec: 0.525165},mag: 4.51,bv: 1.09},
    {pos:{ra:0.321788,dec: 0.429065},mag: 4.65,bv: 1.04},
    {pos:{ra:0.321715,dec: 0.132214},mag: 5.24,bv: 0.32},
    {pos:{ra:0.324631,dec:-0.138283},mag: 5.13,bv: 0.46},
    {pos:{ra:0.328056,dec:-0.794673},mag: 4.96,bv: 0.58},
    {pos:{ra:0.334252,dec:-0.043638},mag: 5.41,bv: 0.90},
    {pos:{ra:0.330602,dec:-1.202115},mag: 4.86,bv: 0.47},
    {pos:{ra:0.339467,dec: 0.063084},mag: 5.16,bv: 0.07},
    {pos:{ra:0.349422,dec: 1.016334},mag: 4.98,bv: 0.68},
    {pos:{ra:0.346739,dec: 0.475849},mag: 4.76,bv: 0.03},
    {pos:{ra:0.353967,dec: 0.501574},mag: 5.23,bv: 1.39},
    {pos:{ra:0.359276,dec: 0.794629},mag: 4.88,bv: 1.08},
    {pos:{ra:0.374955,dec: 1.189093},mag: 4.74,bv: 1.05},
    {pos:{ra:0.366621,dec:-0.142826},mag: 3.60,bv: 1.06},
    {pos:{ra:0.374446,dec: 1.051304},mag: 2.68,bv: 0.13},
    {pos:{ra:0.369486,dec:-0.724181},mag: 5.42,bv: 1.04},
    {pos:{ra:0.373588,dec:-0.254799},mag: 4.90,bv: 1.23},
    {pos:{ra:0.376358,dec: 0.334618},mag: 5.38,bv: 0.39},
    {pos:{ra:0.378278,dec: 0.335806},mag: 5.50,bv: 1.11},
    {pos:{ra:0.382474,dec: 0.792496},mag: 4.83,bv: 0.42},
    {pos:{ra:0.662403,dec: 1.557954},mag: 2.02,bv: 0.60},
    {pos:{ra:0.385565,dec:-0.756048},mag: 3.41,bv: 1.57},
    {pos:{ra:0.393150,dec: 0.820431},mag: 5.27,bv: 1.00},
    {pos:{ra:0.390961,dec:-0.377505},mag: 5.12,bv: 0.02},
    {pos:{ra:0.393506,dec: 0.107231},mag: 4.84,bv: 1.37},
    {pos:{ra:0.399171,dec: 0.267835},mag: 3.62,bv: 0.97},
    {pos:{ra:0.398161,dec:-0.856482},mag: 3.95,bv: 0.99},
    {pos:{ra:0.409854,dec: 1.033792},mag: 4.71,bv: 1.00},
    {pos:{ra:0.429853,dec: 1.274788},mag: 5.28,bv: 0.96},
    {pos:{ra:0.422355,dec: 0.722663},mag: 4.09,bv: 0.54},
    {pos:{ra:0.418806,dec:-0.268786},mag: 5.42,bv: 1.21},
    {pos:{ra:0.427577,dec: 0.848725},mag: 3.57,bv: 1.28},
    {pos:{ra:0.433496,dec: 0.774684},mag: 4.98,bv: 0.89},
    {pos:{ra:0.426362,dec:-0.998968},mag: 0.46,bv:-0.16},
    {pos:{ra:0.438863,dec: 0.708201},mag: 4.94,bv:-0.09},
    {pos:{ra:0.449124,dec: 1.232595},mag: 5.18,bv:-0.04},
    {pos:{ra:0.444128,dec: 0.743748},mag: 4.95,bv: 0.62},
    {pos:{ra:0.442579,dec: 0.095775},mag: 4.44,bv: 1.36},
    {pos:{ra:0.447226,dec: 0.353754},mag: 5.24,bv: 0.84},
    {pos:{ra:0.452302,dec: 0.884683},mag: 4.07,bv:-0.04},
    {pos:{ra:0.445684,dec:-0.564212},mag: 5.25,bv: 1.05},
    {pos:{ra:0.448222,dec:-0.064407},mag: 4.99,bv: 1.38},
    {pos:{ra:0.454084,dec:-0.278162},mag: 3.50,bv: 0.72},
    {pos:{ra:0.459865,dec: 0.159833},mag: 4.26,bv: 0.96},
    {pos:{ra:0.462461,dec:-0.100066},mag: 5.34,bv: 1.52},
    {pos:{ra:0.460971,dec:-0.437249},mag: 5.31,bv: 0.39},
    {pos:{ra:0.462934,dec:-0.886913},mag: 5.49,bv: 1.60},
    {pos:{ra:0.462970,dec:-0.934134},mag: 5.04,bv: 0.04},
    {pos:{ra:0.478155,dec:-0.186513},mag: 4.67,bv: 0.33},
    {pos:{ra:0.486336,dec:-0.180380},mag: 3.73,bv: 1.14},
    {pos:{ra:0.499142,dec: 1.111251},mag: 3.38,bv:-0.15},
    {pos:{ra:0.494314,dec: 0.710868},mag: 5.40,bv: 1.32},
    {pos:{ra:0.493412,dec: 0.516249},mag: 3.41,bv: 0.49},
    {pos:{ra:0.495368,dec: 0.336776},mag: 4.83,bv: 0.00},
    {pos:{ra:0.495368,dec: 0.336737},mag: 4.75,bv:-0.04},
    {pos:{ra:0.506145,dec: 1.198784},mag: 4.99,bv:-0.10},
    {pos:{ra:0.495477,dec: 0.055632},mag: 4.62,bv: 0.94},
    {pos:{ra:0.500211,dec: 0.363169},mag: 2.64,bv: 0.13},
    {pos:{ra:0.495877,dec:-0.808131},mag: 4.41,bv: 1.59},
    {pos:{ra:0.499019,dec:-0.741712},mag: 5.11,bv:-0.06},
    {pos:{ra:0.512043,dec: 0.310974},mag: 5.10,bv: 0.92},
    {pos:{ra:0.509069,dec:-0.393169},mag: 4.85,bv: 1.42},
    {pos:{ra:0.505964,dec:-0.900745},mag: 3.70,bv: 0.85},
    {pos:{ra:0.521999,dec: 1.127856},mag: 5.26,bv: 0.01},
    {pos:{ra:0.514559,dec: 0.411830},mag: 4.79,bv: 0.28},
    {pos:{ra:0.501499,dec:-1.180667},mag: 4.69,bv: 0.95},
    {pos:{ra:0.511236,dec:-0.827024},mag: 4.83,bv: 0.88},
    {pos:{ra:0.532136,dec: 1.237560},mag: 4.54,bv: 0.16},
    {pos:{ra:0.538587,dec: 1.263992},mag: 3.98,bv:-0.01},
    {pos:{ra:0.545954,dec: 1.348815},mag: 5.38,bv: 0.31},
    {pos:{ra:0.522588,dec:-0.363455},mag: 5.41,bv: 1.65},
    {pos:{ra:0.523621,dec:-0.367877},mag: 4.00,bv: 1.57},
    {pos:{ra:0.533642,dec: 0.950986},mag: 5.04,bv:-0.08},
    {pos:{ra:0.518232,dec:-1.074594},mag: 2.86,bv: 0.28},
    {pos:{ra:0.547684,dec: 1.328457},mag: 5.22,bv: 0.95},
    {pos:{ra:0.529031,dec:-0.523628},mag: 5.35,bv: 0.88},
    {pos:{ra:0.532529,dec: 0.048234},mag: 5.23,bv: 0.00},
    {pos:{ra:0.532529,dec: 0.048234},mag: 4.33,bv: 0.03},
    {pos:{ra:0.536543,dec: 0.580913},mag: 5.50,bv: 0.03},
    {pos:{ra:0.531045,dec:-0.780400},mag: 5.14,bv: 1.49},
    {pos:{ra:0.540616,dec: 0.738793},mag: 2.26,bv: 1.37},
    {pos:{ra:0.540667,dec: 0.738812},mag: 4.84,bv: 0.03},
    {pos:{ra:0.537540,dec: 0.002240},mag: 5.43,bv: 0.15},
    {pos:{ra:0.543190,dec:-0.511328},mag: 4.69,bv:-0.17},
    {pos:{ra:0.552244,dec: 0.395288},mag: 5.03,bv: 0.11},
    {pos:{ra:0.554898,dec: 0.409498},mag: 2.00,bv: 1.15},
    {pos:{ra:0.560636,dec: 0.660767},mag: 4.82,bv: 0.12},
    {pos:{ra:0.565239,dec: 0.610642},mag: 3.00,bv: 0.14},
    {pos:{ra:0.564709,dec: 0.452734},mag: 4.98,bv: 0.33},
    {pos:{ra:0.577580,dec: 0.528888},mag: 4.94,bv: 0.78},
    {pos:{ra:0.581289,dec: 0.771988},mag: 4.83,bv: 1.48},
    {pos:{ra:0.582962,dec: 0.891267},mag: 5.31,bv: 0.93},
    {pos:{ra:0.579457,dec: 0.370199},mag: 5.27,bv: 0.43},
    {pos:{ra:0.580322,dec: 0.154403},mag: 4.37,bv: 0.89},
    {pos:{ra:0.579922,dec:-0.536233},mag: 5.28,bv:-0.02},
    {pos:{ra:0.593136,dec: 0.582222},mag: 5.28,bv:-0.01},
    {pos:{ra:0.598008,dec: 0.597324},mag: 4.87,bv: 0.61},
    {pos:{ra:0.599150,dec: 0.590745},mag: 4.01,bv: 0.02},
    {pos:{ra:0.607724,dec: 0.826937},mag: 5.30,bv:-0.01},
    {pos:{ra:0.595637,dec:-0.899058},mag: 3.56,bv:-0.12},
    {pos:{ra:0.606284,dec: 0.499906},mag: 5.03,bv: 0.04},
    {pos:{ra:0.608007,dec:-0.051967},mag: 3.04,bv: 1.42},
    {pos:{ra:0.621148,dec: 0.974689},mag: 5.17,bv: 0.37},
    {pos:{ra:0.619345,dec: 0.006909},mag: 5.28,bv: 1.65},
    {pos:{ra:0.620494,dec:-0.015446},mag: 5.42,bv: 0.31},
    {pos:{ra:0.619694,dec:-0.188108},mag: 5.46,bv: 0.35},
    {pos:{ra:0.630129,dec: 0.872781},mag: 5.19,bv: 0.98},
    {pos:{ra:0.621963,dec:-0.415674},mag: 5.20,bv: 0.60},
    {pos:{ra:0.635402,dec: 0.877527},mag: 4.71,bv: 1.53},
    {pos:{ra:0.631882,dec: 0.185189},mag: 5.47,bv:-0.10},
    {pos:{ra:0.618494,dec:-1.198333},mag: 4.09,bv: 0.03},
    {pos:{ra:0.650426,dec: 1.176396},mag: 4.52,bv: 0.12},
    {pos:{ra:0.636827,dec:-0.214511},mag: 4.89,bv:-0.03},
    {pos:{ra:0.632238,dec:-1.052642},mag: 5.35,bv: 0.39},
    {pos:{ra:0.623395,dec:-1.285362},mag: 5.01,bv: 1.09},
    {pos:{ra:0.646499,dec: 0.517829},mag: 5.29,bv: 0.00},
    {pos:{ra:0.646463,dec: 0.147655},mag: 4.28,bv:-0.06},
    {pos:{ra:0.641343,dec:-0.832590},mag: 4.25,bv:-0.14},
    {pos:{ra:0.645895,dec:-0.590115},mag: 5.14,bv: 0.10},
    {pos:{ra:0.663676,dec: 0.630888},mag: 5.15,bv: 1.47},
    {pos:{ra:0.661051,dec: 0.039570},mag: 5.25,bv: 1.27},
    {pos:{ra:0.663909,dec:-0.018064},mag: 5.35,bv: 1.02},
    {pos:{ra:0.663603,dec:-0.266071},mag: 4.75,bv: 0.45},
    {pos:{ra:0.689551,dec: 1.270920},mag: 5.16,bv: 0.88},
    {pos:{ra:0.671275,dec:-0.492750},mag: 4.90,bv:-0.05},
    {pos:{ra:0.679718,dec: 0.605411},mag: 5.35,bv: 1.66},
    {pos:{ra:0.680133,dec: 0.097622},mag: 4.86,bv: 0.87},
    {pos:{ra:0.685224,dec: 0.598018},mag: 5.30,bv: 1.55},
    {pos:{ra:0.692968,dec: 0.383299},mag: 5.43,bv: 0.16},
    {pos:{ra:0.661807,dec:-1.380720},mag: 5.28,bv: 0.98},
    {pos:{ra:0.686816,dec:-0.917049},mag: 5.31,bv: 0.27},
    {pos:{ra:0.695877,dec: 0.005735},mag: 4.07,bv:-0.22},
    {pos:{ra:0.696226,dec:-0.207209},mag: 4.84,bv: 0.45},
    {pos:{ra:0.701121,dec: 0.472301},mag: 5.30,bv: 0.09},
    {pos:{ra:0.707942,dec: 0.701516},mag: 4.91,bv: 0.59},
    {pos:{ra:0.697259,dec:-0.748601},mag: 4.75,bv: 0.06},
    {pos:{ra:0.701041,dec:-0.695611},mag: 4.11,bv: 1.02},
    {pos:{ra:0.716458,dec: 0.859196},mag: 4.12,bv: 0.49},
    {pos:{ra:0.715963,dec: 0.773128},mag: 5.43,bv: 0.90},
    {pos:{ra:0.713192,dec: 0.483582},mag: 4.66,bv:-0.13},
    {pos:{ra:0.701011,dec:-0.952077},mag: 5.21,bv: 0.40},
    {pos:{ra:0.712531,dec: 0.056476},mag: 3.47,bv: 0.09},
    {pos:{ra:0.696343,dec:-1.191483},mag: 4.11,bv:-0.06},
    {pos:{ra:0.709295,dec:-0.886632},mag: 5.41,bv: 0.56},
    {pos:{ra:0.716123,dec:-0.241878},mag: 4.25,bv:-0.14},
    {pos:{ra:0.719774,dec: 0.217221},mag: 5.18,bv: 0.24},
    {pos:{ra:0.719694,dec: 0.176526},mag: 4.27,bv: 0.31},
    {pos:{ra:0.720399,dec:-0.324151},mag: 4.47,bv: 0.48},
    {pos:{ra:0.732638,dec: 0.510460},mag: 4.51,bv: 1.11},
    {pos:{ra:0.744805,dec: 0.975561},mag: 3.76,bv: 1.68},
    {pos:{ra:0.738674,dec: 0.304807},mag: 5.22,bv:-0.06},
    {pos:{ra:0.722319,dec:-1.180133},mag: 4.84,bv: 0.06},
    {pos:{ra:0.741692,dec: 0.475786},mag: 3.63,bv:-0.10},
    {pos:{ra:0.744317,dec: 0.668786},mag: 4.23,bv: 0.34},
    {pos:{ra:0.737794,dec:-0.565588},mag: 4.46,bv: 0.99},
    {pos:{ra:0.748368,dec: 0.611908},mag: 4.53,bv: 1.56},
    {pos:{ra:0.741343,dec:-0.487674},mag: 5.39,bv: 0.02},
    {pos:{ra:0.748281,dec: 0.263230},mag: 5.49,bv:-0.09},
    {pos:{ra:0.746296,dec:-0.366592},mag: 4.75,bv: 0.91},
    {pos:{ra:0.744703,dec:-0.622666},mag: 5.47,bv: 1.25},
    {pos:{ra:0.737511,dec:-1.096183},mag: 5.26,bv: 0.10},
    {pos:{ra:0.760345,dec: 0.920879},mag: 3.95,bv: 0.74},
    {pos:{ra:0.757953,dec: 0.669116},mag: 5.33,bv: 0.41},
    {pos:{ra:0.758702,dec:-0.870750},mag: 4.00,bv: 2.11},
    {pos:{ra:0.743838,dec:-1.310165},mag: 4.75,bv: 1.33},
    {pos:{ra:0.773566,dec: 0.557356},mag: 5.11,bv:-0.01},
    {pos:{ra:0.769814,dec:-0.155300},mag: 3.89,bv: 1.11},
    {pos:{ra:0.770665,dec:-0.064791},mag: 5.17,bv: 0.08},
    {pos:{ra:0.779995,dec: 0.692246},mag: 4.70,bv: 0.06},
    {pos:{ra:0.812145,dec: 1.386116},mag: 5.49,bv: 1.57},
    {pos:{ra:0.781304,dec: 0.614060},mag: 4.93,bv: 1.23},
    {pos:{ra:0.774032,dec:-0.416469},mag: 5.45,bv: 0.23},
    {pos:{ra:0.784664,dec: 0.824159},mag: 5.47,bv: 0.89},
    {pos:{ra:0.781958,dec: 0.372458},mag: 4.63,bv: 0.04},
    {pos:{ra:0.781958,dec: 0.372458},mag: 4.63,bv: 0.04},
    {pos:{ra:0.789194,dec: 0.913709},mag: 5.28,bv:-0.05},
    {pos:{ra:0.779726,dec:-0.048564},mag: 5.23,bv: 0.00},
    {pos:{ra:0.784155,dec: 0.155465},mag: 4.70,bv:-0.12},
    {pos:{ra:0.777813,dec:-0.703450},mag: 3.24,bv: 0.14},
    {pos:{ra:0.777857,dec:-0.703445},mag: 4.35,bv: 0.08},
    {pos:{ra:0.780148,dec:-1.118257},mag: 4.99,bv: 0.13},
    {pos:{ra:0.795347,dec: 0.071379},mag: 2.53,bv: 1.64},
    {pos:{ra:0.806328,dec: 0.933863},mag: 2.93,bv: 0.70},
    {pos:{ra:0.797201,dec:-0.134133},mag: 5.32,bv: 0.94},
    {pos:{ra:0.809571,dec: 0.989703},mag: 4.76,bv: 1.02},
    {pos:{ra:0.795834,dec:-0.412324},mag: 4.09,bv: 0.16},
    {pos:{ra:0.807986,dec: 0.677891},mag: 3.39,bv: 1.65},
    {pos:{ra:0.804044,dec:-0.132660},mag: 5.26,bv: 0.20},
    {pos:{ra:0.837489,dec: 1.298414},mag: 4.87,bv: 0.02},
    {pos:{ra:0.801164,dec:-1.042621},mag: 5.11,bv: 0.34},
    {pos:{ra:0.814014,dec:-0.106266},mag: 5.27,bv: 1.60},
    {pos:{ra:0.821039,dec: 0.714809},mag: 2.12,bv:-0.05},
    {pos:{ra:0.824959,dec: 0.865916},mag: 4.05,bv: 0.59},
    {pos:{ra:0.826835,dec: 0.782906},mag: 3.80,bv: 0.98},
    {pos:{ra:0.834660,dec: 0.691354},mag: 4.63,bv: 1.11},
    {pos:{ra:0.836144,dec: 0.344295},mag: 4.35,bv: 1.03},
    {pos:{ra:0.874097,dec: 1.356727},mag: 5.45,bv: 0.19},
    {pos:{ra:0.841132,dec:-0.020876},mag: 5.06,bv: 0.57},
    {pos:{ra:0.838071,dec:-0.505918},mag: 3.87,bv: 0.52},
    {pos:{ra:0.856099,dec: 0.889032},mag: 5.03,bv: 1.15},
    {pos:{ra:0.850419,dec: 0.367295},mag: 4.89,bv:-0.01},
    {pos:{ra:0.863022,dec: 0.768381},mag: 5.47,bv:-0.06},
    {pos:{ra:0.854484,dec:-0.153933},mag: 4.80,bv: 0.23},
    {pos:{ra:0.872621,dec: 1.145847},mag: 4.84,bv:-0.15},
    {pos:{ra:0.866687,dec: 0.876543},mag: 5.15,bv:-0.06},
    {pos:{ra:0.868854,dec: 0.874323},mag: 5.03,bv:-0.06},
    {pos:{ra:0.867123,dec: 0.597300},mag: 4.82,bv: 1.49},
    {pos:{ra:0.865567,dec:-0.016236},mag: 5.38,bv: 1.04},
    {pos:{ra:0.865545,dec:-0.392898},mag: 4.88,bv: 0.90},
    {pos:{ra:0.869879,dec: 0.058822},mag: 4.83,bv: 0.68},
    {pos:{ra:0.874148,dec: 0.506989},mag: 4.47,bv: 1.55},
    {pos:{ra:0.878955,dec: 0.756241},mag: 4.95,bv: 0.04},
    {pos:{ra:0.870556,dec:-0.379745},mag: 3.69,bv: 1.62},
    {pos:{ra:0.878017,dec: 0.369084},mag: 5.28,bv:-0.07},
    {pos:{ra:0.872352,dec:-0.751708},mag: 4.27,bv: 0.71},
    {pos:{ra:0.893063,dec: 1.127240},mag: 5.23,bv: 2.08},
    {pos:{ra:0.864876,dec:-1.090942},mag: 5.24,bv: 0.60},
    {pos:{ra:0.886715,dec: 0.858935},mag: 5.29,bv:-0.07},
    {pos:{ra:0.884678,dec: 0.362015},mag: 5.09,bv: 1.24},
    {pos:{ra:0.891529,dec: 0.870241},mag: 1.79,bv: 0.48},
    {pos:{ra:0.891463,dec: 0.431518},mag: 5.50,bv: 1.19},
    {pos:{ra:0.893667,dec: 0.157584},mag: 3.60,bv: 0.89},
    {pos:{ra:0.907797,dec: 0.856307},mag: 4.98,bv:-0.09},
    {pos:{ra:0.912233,dec: 1.046155},mag: 4.21,bv: 0.41},
    {pos:{ra:0.903950,dec: 0.169869},mag: 3.74,bv:-0.09},
    {pos:{ra:0.915927,dec: 1.027626},mag: 4.54,bv: 0.56},
    {pos:{ra:0.913542,dec: 0.864093},mag: 4.67,bv:-0.09},
    {pos:{ra:0.916312,dec: 0.967819},mag: 5.09,bv: 0.05},
    {pos:{ra:0.918807,dec: 0.837676},mag: 4.36,bv: 1.35},
    {pos:{ra:0.918080,dec: 0.197857},mag: 5.14,bv:-0.03},
    {pos:{ra:0.925650,dec: 0.838170},mag: 5.47,bv:-0.10},
    {pos:{ra:0.920108,dec: 0.225787},mag: 4.11,bv: 1.12},
    {pos:{ra:0.926937,dec: 0.803845},mag: 5.31,bv: 0.40},
    {pos:{ra:0.918996,dec:-0.088580},mag: 4.73,bv:-0.09},
    {pos:{ra:0.913585,dec:-1.098467},mag: 4.72,bv: 0.40},
    {pos:{ra:0.929082,dec:-0.165079},mag: 3.73,bv: 0.88},
    {pos:{ra:0.944616,dec: 0.841123},mag: 4.23,bv:-0.06},
    {pos:{ra:0.932828,dec:-0.377563},mag: 4.27,bv:-0.11},
    {pos:{ra:0.943743,dec:-0.304856},mag: 5.23,bv:-0.13},
    {pos:{ra:0.946288,dec: 0.007010},mag: 4.28,bv: 0.58},
    {pos:{ra:0.969334,dec: 1.103339},mag: 5.10,bv: 1.63},
    {pos:{ra:0.947256,dec:-0.702927},mag: 4.58,bv: 1.04},
    {pos:{ra:0.972694,dec: 0.834049},mag: 3.01,bv:-0.13},
    {pos:{ra:0.970294,dec: 0.592801},mag: 4.97,bv:-0.01},
    {pos:{ra:0.986278,dec: 1.105579},mag: 4.80,bv: 0.80},
    {pos:{ra:0.978773,dec: 0.563538},mag: 3.83,bv: 0.05},
    {pos:{ra:0.969741,dec:-0.557429},mag: 5.00,bv:-0.16},
    {pos:{ra:0.982591,dec: 0.743137},mag: 3.77,bv: 0.42},
    {pos:{ra:0.974105,dec:-0.170402},mag: 3.54,bv: 0.92},
    {pos:{ra:1.000205,dec: 1.236934},mag: 5.44,bv: 0.09},
    {pos:{ra:0.980890,dec: 0.423931},mag: 5.46,bv:-0.04},
    {pos:{ra:0.981202,dec: 0.420857},mag: 3.70,bv:-0.11},
    {pos:{ra:0.972301,dec:-0.651245},mag: 4.59,bv: 1.20},
    {pos:{ra:0.982657,dec: 0.427034},mag: 4.30,bv:-0.11},
    {pos:{ra:0.979602,dec:-0.020299},mag: 5.25,bv:-0.10},
    {pos:{ra:1.005128,dec: 1.244982},mag: 4.63,bv: 0.03},
    {pos:{ra:0.985355,dec: 0.425298},mag: 3.87,bv:-0.07},
    {pos:{ra:0.984686,dec: 0.105592},mag: 5.35,bv:-0.12},
    {pos:{ra:1.001470,dec: 1.143646},mag: 4.47,bv: 1.88},
    {pos:{ra:0.987536,dec: 0.417977},mag: 4.18,bv:-0.06},
    {pos:{ra:0.986729,dec:-0.211214},mag: 4.42,bv: 1.63},
    {pos:{ra:0.992591,dec: 0.420712},mag: 2.87,bv:-0.09},
    {pos:{ra:0.996358,dec: 0.408776},mag: 5.45,bv:-0.07},
    {pos:{ra:0.989813,dec:-0.405784},mag: 4.23,bv: 0.42},
    {pos:{ra:0.996023,dec: 0.194488},mag: 5.07,bv:-0.13},
    {pos:{ra:0.978257,dec:-1.131095},mag: 3.85,bv: 1.13},
    {pos:{ra:1.001572,dec: 0.577554},mag: 5.11,bv: 0.07},
    {pos:{ra:0.999906,dec: 0.419810},mag: 3.63,bv:-0.09},
    {pos:{ra:1.000015,dec: 0.421264},mag: 5.09,bv:-0.08},
    {pos:{ra:0.993354,dec:-0.416693},mag: 5.24,bv: 0.07},
    {pos:{ra:1.004939,dec: 0.446446},mag: 5.26,bv: 0.21},
    {pos:{ra:0.997412,dec:-0.656632},mag: 5.40,bv: 0.01},
    {pos:{ra:0.997448,dec:-0.656603},mag: 4.73,bv:-0.03},
    {pos:{ra:1.001186,dec:-0.631814},mag: 4.17,bv: 0.95},
    {pos:{ra:1.015316,dec:-0.093574},mag: 5.48,bv:-0.10},
    {pos:{ra:1.021592,dec: 0.556474},mag: 2.85,bv: 0.12},
    {pos:{ra:1.035962,dec: 1.100818},mag: 5.03,bv:-0.09},
    {pos:{ra:1.034711,dec: 1.066551},mag: 5.00,bv: 1.45},
    {pos:{ra:1.029613,dec: 0.835513},mag: 5.37,bv:-0.08},
    {pos:{ra:0.991514,dec:-1.295713},mag: 3.24,bv: 1.62},
    {pos:{ra:1.032399,dec: 0.884800},mag: 5.28,bv: 0.41},
    {pos:{ra:1.022290,dec:-0.051570},mag: 4.79,bv: 0.94},
    {pos:{ra:1.019752,dec:-0.429569},mag: 4.65,bv:-0.13},
    {pos:{ra:1.019483,dec:-0.606192},mag: 5.11,bv:-0.13},
    {pos:{ra:1.031831,dec: 0.612281},mag: 5.49,bv:-0.03},
    {pos:{ra:1.037831,dec: 0.698311},mag: 2.89,bv:-0.18},
    {pos:{ra:1.042681,dec: 0.624673},mag: 4.04,bv: 0.01},
    {pos:{ra:1.091034,dec: 1.408456},mag: 5.10,bv: 0.56},
    {pos:{ra:1.038602,dec:-0.235770},mag: 2.95,bv: 1.59},
    {pos:{ra:1.050165,dec: 0.217996},mag: 3.47,bv:-0.12},
    {pos:{ra:1.046870,dec:-0.419165},mag: 4.66,bv:-0.13},
    {pos:{ra:1.066629,dec: 1.032459},mag: 5.06,bv: 0.50},
    {pos:{ra:1.053888,dec:-0.027048},mag: 5.28,bv:-0.15},
    {pos:{ra:1.041722,dec:-1.071637},mag: 4.56,bv: 1.62},
    {pos:{ra:1.058593,dec:-0.004693},mag: 5.38,bv: 0.50},
    {pos:{ra:1.060971,dec: 0.104531},mag: 3.91,bv: 0.03},
    {pos:{ra:1.066229,dec: 0.420726},mag: 5.47,bv: 0.86},
    {pos:{ra:1.063531,dec: 0.094868},mag: 5.33,bv:-0.08},
    {pos:{ra:1.064404,dec: 0.143069},mag: 5.46,bv: 0.37},
    {pos:{ra:1.067683,dec: 0.385403},mag: 4.36,bv: 1.07},
    {pos:{ra:1.065371,dec: 0.049339},mag: 5.36,bv: 0.50},
    {pos:{ra:1.075923,dec: 0.878798},mag: 4.29,bv: 0.02},
    {pos:{ra:1.051110,dec:-1.084887},mag: 4.51,bv: 1.65},
    {pos:{ra:1.052884,dec:-1.066028},mag: 4.97,bv: 1.42},
    {pos:{ra:1.076025,dec: 0.481711},mag: 5.20,bv:-0.13},
    {pos:{ra:1.077777,dec: 0.506170},mag: 5.23,bv: 0.34},
    {pos:{ra:1.084991,dec: 0.832740},mag: 4.04,bv:-0.03},
    {pos:{ra:1.087195,dec: 0.342245},mag: 5.50,bv: 1.07},
    {pos:{ra:1.094460,dec: 0.462178},mag: 5.41,bv: 0.34},
    {pos:{ra:1.087762,dec:-0.285987},mag: 5.37,bv:-0.15},
    {pos:{ra:1.092467,dec:-0.120845},mag: 5.44,bv: 0.94},
    {pos:{ra:1.098968,dec:-0.119337},mag: 4.04,bv: 0.33},
    {pos:{ra:1.094511,dec:-0.732927},mag: 4.93,bv: 0.33},
    {pos:{ra:1.112204,dec: 0.844904},mag: 4.14,bv: 0.95},
    {pos:{ra:1.178105,dec: 1.454567},mag: 5.46,bv: 0.87},
    {pos:{ra:1.112160,dec: 0.706572},mag: 4.71,bv: 1.01},
    {pos:{ra:1.106328,dec: 0.134672},mag: 5.29,bv: 0.36},
    {pos:{ra:1.108022,dec: 0.161681},mag: 4.84,bv: 0.80},
    {pos:{ra:1.120145,dec: 0.935705},mag: 5.19,bv: 0.05},
    {pos:{ra:1.110924,dec: 0.174727},mag: 5.22,bv:-0.10},
    {pos:{ra:1.165211,dec: 1.410648},mag: 5.43,bv: 1.17},
    {pos:{ra:1.110008,dec:-0.179008},mag: 4.87,bv: 1.17},
    {pos:{ra:1.114982,dec: 0.155199},mag: 4.29,bv:-0.06},
    {pos:{ra:1.126799,dec: 0.877823},mag: 4.61,bv: 0.04},
    {pos:{ra:1.113833,dec:-0.133566},mag: 4.43,bv: 0.82},
    {pos:{ra:1.108291,dec:-0.738177},mag: 3.86,bv: 1.10},
    {pos:{ra:1.137395,dec: 1.136917},mag: 5.27,bv: 0.81},
    {pos:{ra:1.122509,dec: 0.359165},mag: 4.94,bv: 0.26},
    {pos:{ra:1.131068,dec: 0.873518},mag: 5.45,bv: 0.22},
    {pos:{ra:1.142289,dec: 1.060035},mag: 5.39,bv: 1.49},
    {pos:{ra:1.110139,dec:-1.090375},mag: 3.35,bv: 0.91},
    {pos:{ra:1.117127,dec:-0.898612},mag: 4.25,bv: 0.30},
    {pos:{ra:1.131999,dec: 0.369001},mag: 5.35,bv:-0.08},
    {pos:{ra:1.111826,dec:-1.085454},mag: 5.45,bv: 1.10},
    {pos:{ra:1.132770,dec: 0.380021},mag: 5.38,bv:-0.14},
    {pos:{ra:1.136253,dec: 0.603302},mag: 4.93,bv: 0.94},
    {pos:{ra:1.133562,dec: 0.272751},mag: 3.65,bv: 0.99},
    {pos:{ra:1.125279,dec:-0.589892},mag: 3.56,bv:-0.12},
    {pos:{ra:1.136013,dec: 0.477362},mag: 4.95,bv: 1.15},
    {pos:{ra:1.141242,dec: 0.811559},mag: 4.85,bv:-0.03},
    {pos:{ra:1.119112,dec:-1.035014},mag: 4.44,bv: 1.08},
    {pos:{ra:1.137104,dec: 0.263462},mag: 5.26,bv: 0.22},
    {pos:{ra:1.131308,dec:-0.772623},mag: 5.34,bv: 1.08},
    {pos:{ra:1.137300,dec:-0.360231},mag: 5.38,bv:-0.02},
    {pos:{ra:1.145729,dec: 0.447313},mag: 5.37,bv:-0.05},
    {pos:{ra:1.147270,dec: 0.306174},mag: 3.76,bv: 0.98},
    {pos:{ra:1.152339,dec: 0.304453},mag: 4.80,bv: 0.15},
    {pos:{ra:1.151328,dec: 0.165123},mag: 5.12,bv: 0.07},
    {pos:{ra:1.150521,dec:-0.065372},mag: 5.17,bv: 0.08},
    {pos:{ra:1.157888,dec: 0.389102},mag: 4.22,bv: 0.13},
    {pos:{ra:1.158099,dec: 0.387458},mag: 5.28,bv: 0.25},
    {pos:{ra:1.158419,dec: 0.312904},mag: 4.29,bv: 0.05},
    {pos:{ra:1.161102,dec: 0.548712},mag: 5.28,bv: 0.97},
    {pos:{ra:1.161989,dec: 0.398173},mag: 4.28,bv: 0.26},
    {pos:{ra:1.152077,dec:-0.593708},mag: 3.96,bv: 1.49},
    {pos:{ra:1.162157,dec: 0.272591},mag: 4.49,bv: 0.25},
    {pos:{ra:1.142703,dec:-1.106301},mag: 5.24,bv: 0.96},
    {pos:{ra:1.163291,dec: 0.256801},mag: 4.69,bv: 0.98},
    {pos:{ra:1.171291,dec: 0.285531},mag: 4.97,bv: 1.13},
    {pos:{ra:1.172061,dec: 0.334759},mag: 3.53,bv: 1.01},
    {pos:{ra:1.171880,dec: 0.278593},mag: 3.84,bv: 0.95},
    {pos:{ra:1.172258,dec: 0.276998},mag: 3.40,bv: 0.18},
    {pos:{ra:1.173021,dec: 0.227722},mag: 5.03,bv: 0.23},
    {pos:{ra:1.180548,dec: 0.282637},mag: 4.78,bv: 0.17},
    {pos:{ra:1.180926,dec: 0.273876},mag: 5.48,bv: 0.26},
    {pos:{ra:1.180810,dec: 0.239537},mag: 5.40,bv: 0.26},
    {pos:{ra:1.186293,dec:-0.000766},mag: 4.91,bv: 1.32},
    {pos:{ra:1.181741,dec:-0.784593},mag: 5.07,bv:-0.19},
    {pos:{ra:1.194889,dec: 0.259084},mag: 4.65,bv: 0.25},
    {pos:{ra:1.196394,dec:-0.143665},mag: 5.11,bv: 1.70},
    {pos:{ra:1.196401,dec:-0.156561},mag: 5.26,bv: 1.47},
    {pos:{ra:1.193413,dec:-0.519526},mag: 4.51,bv: 0.98},
    {pos:{ra:1.207288,dec: 0.720205},mag: 4.25,bv: 1.22},
    {pos:{ra:1.203928,dec: 0.288139},mag: 0.85,bv: 1.54},
    {pos:{ra:1.202772,dec: 0.177340},mag: 4.25,bv: 0.18},
    {pos:{ra:1.205666,dec:-0.058512},mag: 3.93,bv:-0.21},
    {pos:{ra:1.202314,dec:-0.533411},mag: 3.82,bv: 0.98},
    {pos:{ra:1.195536,dec:-0.960716},mag: 3.27,bv:-0.10},
    {pos:{ra:1.221592,dec: 0.933281},mag: 5.35,bv: 0.32},
    {pos:{ra:1.221345,dec: 0.926416},mag: 5.05,bv: 1.07},
    {pos:{ra:1.209637,dec: 0.017424},mag: 5.31,bv:-0.12},
    {pos:{ra:1.213695,dec: 0.218355},mag: 4.27,bv: 0.12},
    {pos:{ra:1.211266,dec:-0.043168},mag: 5.23,bv: 0.28},
    {pos:{ra:1.218036,dec: 0.275757},mag: 5.07,bv: 0.15},
    {pos:{ra:1.218567,dec: 0.277822},mag: 4.69,bv: 0.15},
    {pos:{ra:1.217818,dec: 0.137372},mag: 5.39,bv: 0.26},
    {pos:{ra:1.213789,dec:-0.249650},mag: 3.87,bv: 1.09},
    {pos:{ra:1.216902,dec:-0.211587},mag: 5.01,bv: 0.07},
    {pos:{ra:1.221978,dec: 0.212891},mag: 5.46,bv:-0.12},
    {pos:{ra:1.218800,dec:-0.250615},mag: 5.45,bv: 1.06},
    {pos:{ra:1.207593,dec:-1.083457},mag: 5.40,bv: 1.58},
    {pos:{ra:1.234406,dec: 0.756862},mag: 5.29,bv: 0.00},
    {pos:{ra:1.223658,dec:-0.343335},mag: 4.32,bv: 1.61},
    {pos:{ra:1.231526,dec: 0.400674},mag: 4.28,bv:-0.13},
    {pos:{ra:1.224181,dec:-0.730663},mag: 4.45,bv: 0.34},
    {pos:{ra:1.230712,dec:-0.648293},mag: 5.05,bv: 0.37},
    {pos:{ra:1.241060,dec: 0.194536},mag: 5.40,bv: 0.25},
    {pos:{ra:1.256659,dec: 0.990600},mag: 5.30,bv: 0.25},
    {pos:{ra:1.233831,dec:-0.881066},mag: 5.31,bv: 0.98},
    {pos:{ra:1.248034,dec: 0.204300},mag: 5.37,bv: 0.19},
    {pos:{ra:1.245736,dec:-0.056806},mag: 4.02,bv:-0.15},
    {pos:{ra:1.310502,dec: 1.417101},mag: 5.07,bv: 1.28},
    {pos:{ra:1.274469,dec: 1.108376},mag: 5.44,bv: 1.57},
    {pos:{ra:1.240718,dec:-1.042534},mag: 5.27,bv: 0.20},
    {pos:{ra:1.264971,dec: 0.654295},mag: 4.88,bv: 1.44},
    {pos:{ra:1.283035,dec: 1.157900},mag: 4.29,bv: 0.03},
    {pos:{ra:1.264666,dec: 0.121499},mag: 3.19,bv: 0.45},
    {pos:{ra:1.268033,dec: 0.155339},mag: 4.36,bv: 0.01},
    {pos:{ra:1.271363,dec: 0.328815},mag: 5.10,bv: 0.21},
    {pos:{ra:1.266207,dec:-0.283044},mag: 5.03,bv: 0.98},
    {pos:{ra:1.276854,dec: 0.640589},mag: 4.78,bv: 1.41},
    {pos:{ra:1.270629,dec: 0.097826},mag: 3.69,bv:-0.17},
    {pos:{ra:1.276417,dec: 0.248719},mag: 4.74,bv: 1.84},
    {pos:{ra:1.277996,dec:-0.095169},mag: 4.39,bv: 0.25},
    {pos:{ra:1.280112,dec: 0.043774},mag: 5.33,bv: 1.64},
    {pos:{ra:1.283915,dec: 0.042596},mag: 3.72,bv:-0.18},
    {pos:{ra:1.297158,dec: 0.938153},mag: 4.47,bv:-0.02},
    {pos:{ra:1.286228,dec: 0.199423},mag: 5.19,bv: 0.12},
    {pos:{ra:1.286729,dec: 0.177165},mag: 4.65,bv: 0.09},
    {pos:{ra:1.286293,dec: 0.135772},mag: 5.33,bv: 1.22},
    {pos:{ra:1.295878,dec: 0.578858},mag: 2.69,bv: 1.53},
    {pos:{ra:1.293165,dec: 0.235872},mag: 4.07,bv: 1.15},
    {pos:{ra:1.297529,dec: 0.299387},mag: 5.48,bv: 1.31},
    {pos:{ra:1.305754,dec: 0.661310},mag: 4.94,bv: 0.04},
    {pos:{ra:1.302663,dec: 0.029918},mag: 4.47,bv: 1.40},
    {pos:{ra:1.323912,dec: 1.054916},mag: 4.03,bv: 0.92},
    {pos:{ra:1.317585,dec: 0.764861},mag: 2.99,bv: 0.54},
    {pos:{ra:1.308299,dec:-0.179129},mag: 5.38,bv: 0.80},
    {pos:{ra:1.308692,dec:-0.218821},mag: 4.79,bv: 0.26},
    {pos:{ra:1.319811,dec: 0.716909},mag: 3.75,bv: 1.22},
    {pos:{ra:1.315273,dec:-0.125208},mag: 4.81,bv:-0.19},
    {pos:{ra:1.322501,dec: 0.376817},mag: 4.64,bv: 0.16},
    {pos:{ra:1.315222,dec:-0.349972},mag: 4.91,bv:-0.05},
    {pos:{ra:1.335795,dec: 1.029264},mag: 5.08,bv:-0.08},
    {pos:{ra:1.318436,dec:-0.458585},mag: 5.02,bv: 1.07},
    {pos:{ra:1.287995,dec:-1.307896},mag: 5.47,bv: 1.52},
    {pos:{ra:1.338129,dec: 0.900551},mag: 5.00,bv: 0.33},
    {pos:{ra:1.328930,dec: 0.268853},mag: 4.68,bv:-0.06},
    {pos:{ra:1.337424,dec: 0.719677},mag: 3.17,bv:-0.18},
    {pos:{ra:1.362986,dec: 1.290613},mag: 5.43,bv:-0.12},
    {pos:{ra:1.321258,dec:-0.857854},mag: 5.38,bv: 0.42},
    {pos:{ra:1.328225,dec:-0.619301},mag: 4.55,bv: 1.20},
    {pos:{ra:1.332828,dec:-0.390450},mag: 3.19,bv: 1.46},
    {pos:{ra:1.341504,dec: 0.325417},mag: 5.00,bv: 0.65},
    {pos:{ra:1.338500,dec:-0.081245},mag: 5.12,bv:-0.06},
    {pos:{ra:1.343060,dec: 0.356367},mag: 5.30,bv: 0.09},
    {pos:{ra:1.344383,dec: 0.423509},mag: 5.50,bv: 0.06},
    {pos:{ra:1.330668,dec:-0.865295},mag: 5.03,bv: 1.49},
    {pos:{ra:1.343387,dec: 0.148324},mag: 5.34,bv: 0.33},
    {pos:{ra:1.343249,dec:-0.088774},mag: 2.79,bv: 0.13},
    {pos:{ra:1.349692,dec: 0.171556},mag: 5.43,bv: 0.24},
    {pos:{ra:1.347074,dec:-0.077774},mag: 5.12,bv: 0.44},
    {pos:{ra:1.333039,dec:-1.003089},mag: 4.72,bv: 0.52},
    {pos:{ra:1.351321,dec: 0.272223},mag: 4.82,bv: 0.32},
    {pos:{ra:1.320851,dec:-1.244672},mag: 5.31,bv: 1.00},
    {pos:{ra:1.348907,dec:-0.152789},mag: 4.27,bv:-0.19},
    {pos:{ra:1.360019,dec: 0.280048},mag: 5.18,bv: 1.49},
    {pos:{ra:1.407426,dec: 1.382844},mag: 5.05,bv: 0.47},
    {pos:{ra:1.367589,dec: 0.671680},mag: 4.86,bv: 0.18},
    {pos:{ra:1.342013,dec:-1.106534},mag: 5.20,bv: 1.65},
    {pos:{ra:1.362659,dec:-0.207156},mag: 4.45,bv:-0.10},
    {pos:{ra:1.366993,dec: 0.049936},mag: 4.46,bv: 1.19},
    {pos:{ra:1.365422,dec:-0.282840},mag: 3.31,bv:-0.11},
    {pos:{ra:1.366731,dec:-0.225870},mag: 4.36,bv:-0.10},
    {pos:{ra:1.376221,dec: 0.570509},mag: 5.02,bv: 0.23},
    {pos:{ra:1.381821,dec: 0.802818},mag: 0.08,bv: 0.80},
    {pos:{ra:1.373291,dec: 0.089991},mag: 5.50,bv: 1.37},
    {pos:{ra:1.372432,dec:-0.143146},mag: 0.12,bv:-0.03},
    {pos:{ra:1.388693,dec: 0.746865},mag: 5.48,bv: 1.65},
    {pos:{ra:1.376214,dec:-0.470250},mag: 5.07,bv:-0.10},
    {pos:{ra:1.388315,dec: 0.582445},mag: 4.54,bv: 1.27},
    {pos:{ra:1.392518,dec: 0.699862},mag: 4.71,bv: 0.63},
    {pos:{ra:1.391900,dec: 0.589020},mag: 5.41,bv:-0.19},
    {pos:{ra:1.385821,dec:-0.119458},mag: 3.60,bv:-0.11},
    {pos:{ra:1.386097,dec:-0.235964},mag: 5.50,bv: 0.93},
    {pos:{ra:1.393107,dec: 0.385655},mag: 4.94,bv: 0.93},
    {pos:{ra:1.396329,dec: 0.592680},mag: 5.03,bv: 0.27},
    {pos:{ra:1.385290,dec:-0.609038},mag: 4.83,bv: 1.00},
    {pos:{ra:1.369022,dec:-1.172604},mag: 4.83,bv: 1.28},
    {pos:{ra:1.392715,dec: 0.045306},mag: 5.34,bv: 0.41},
    {pos:{ra:1.404146,dec: 0.729625},mag: 5.23,bv:-0.15},
    {pos:{ra:1.411375,dec: 1.004340},mag: 5.28,bv:-0.03},
    {pos:{ra:1.394409,dec:-0.229976},mag: 4.29,bv:-0.26},
    {pos:{ra:1.396198,dec:-0.214947},mag: 5.30,bv:-0.12},
    {pos:{ra:1.398220,dec:-0.370698},mag: 4.71,bv:-0.05},
    {pos:{ra:1.403950,dec:-0.006676},mag: 4.73,bv:-0.17},
    {pos:{ra:1.393507,dec:-0.883243},mag: 5.45,bv: 0.51},
    {pos:{ra:1.408626,dec: 0.061862},mag: 5.00,bv:-0.15},
    {pos:{ra:1.403986,dec:-0.432371},mag: 5.06,bv: 0.67},
    {pos:{ra:1.416567,dec: 0.652501},mag: 4.99,bv: 1.42},
    {pos:{ra:1.415564,dec: 0.303396},mag: 4.99,bv: 0.53},
    {pos:{ra:1.411550,dec:-0.243076},mag: 5.25,bv:-0.21},
    {pos:{ra:1.413484,dec:-0.136276},mag: 4.14,bv: 0.96},
    {pos:{ra:1.415818,dec:-0.015558},mag: 5.08,bv: 0.96},
    {pos:{ra:1.415797,dec:-0.041835},mag: 3.36,bv:-0.17},
    {pos:{ra:1.416975,dec: 0.032226},mag: 4.95,bv:-0.20},
    {pos:{ra:1.418655,dec: 0.110824},mag: 1.64,bv:-0.22},
    {pos:{ra:1.423716,dec: 0.499295},mag: 1.65,bv:-0.13},
    {pos:{ra:1.440638,dec: 1.100731},mag: 5.42,bv: 1.71},
    {pos:{ra:1.429636,dec: 0.601717},mag: 5.07,bv: 1.40},
    {pos:{ra:1.427541,dec: 0.313500},mag: 5.42,bv:-0.10},
    {pos:{ra:1.429577,dec: 0.382872},mag: 4.88,bv:-0.15},
    {pos:{ra:1.426094,dec: 0.054028},mag: 4.59,bv:-0.21},
    {pos:{ra:1.430123,dec: 0.277056},mag: 5.50,bv: 0.01},
    {pos:{ra:1.436733,dec: 0.438960},mag: 5.47,bv:-0.04},
    {pos:{ra:1.432239,dec:-0.362321},mag: 2.84,bv: 0.82},
    {pos:{ra:1.438733,dec:-0.019063},mag: 4.71,bv: 1.57},
    {pos:{ra:1.423847,dec:-1.028217},mag: 5.14,bv: 1.00},
    {pos:{ra:1.443322,dec: 0.103813},mag: 4.20,bv:-0.14},
    {pos:{ra:1.445314,dec: 0.057460},mag: 5.46,bv:-0.18},
    {pos:{ra:1.451801,dec: 0.561855},mag: 4.76,bv: 0.34},
    {pos:{ra:1.449554,dec: 0.324534},mag: 4.38,bv: 2.07},
    {pos:{ra:1.449656,dec: 0.297719},mag: 5.46,bv:-0.04},
    {pos:{ra:1.448652,dec:-0.005221},mag: 2.23,bv:-0.22},
    {pos:{ra:1.448318,dec:-0.127433},mag: 4.62,bv:-0.26},
    {pos:{ra:1.440588,dec:-0.821662},mag: 5.46,bv: 0.62},
    {pos:{ra:1.451627,dec:-0.027785},mag: 5.35,bv:-0.19},
    {pos:{ra:1.445184,dec:-0.619078},mag: 3.87,bv: 1.14},
    {pos:{ra:1.451808,dec:-0.311056},mag: 2.58,bv: 0.21},
    {pos:{ra:1.455270,dec:-0.020178},mag: 5.34,bv:-0.18},
    {pos:{ra:1.458564,dec: 0.065746},mag: 5.36,bv: 0.05},
    {pos:{ra:1.463684,dec: 0.419567},mag: 5.38,bv:-0.09},
    {pos:{ra:1.460928,dec: 0.165622},mag: 4.41,bv:-0.16},
    {pos:{ra:1.452354,dec:-0.672180},mag: 5.48,bv: 1.22},
    {pos:{ra:1.462317,dec: 0.173384},mag: 3.54,bv:-0.18},
    {pos:{ra:1.461910,dec:-0.104754},mag: 4.78,bv:-0.25},
    {pos:{ra:1.463400,dec:-0.084445},mag: 4.59,bv:-0.19},
    {pos:{ra:1.462913,dec:-0.094068},mag: 5.13,bv: 0.02},
    {pos:{ra:1.463379,dec:-0.094529},mag: 5.08,bv:-0.09},
    {pos:{ra:1.463604,dec:-0.103149},mag: 2.77,bv:-0.24},
    {pos:{ra:1.464586,dec:-0.084750},mag: 5.26,bv: 0.24},
    {pos:{ra:1.467007,dec:-0.020978},mag: 1.70,bv:-0.19},
    {pos:{ra:1.470025,dec: 0.162151},mag: 4.09,bv: 0.95},
    {pos:{ra:1.473254,dec: 0.369006},mag: 3.00,bv:-0.19},
    {pos:{ra:1.477574,dec: 0.532194},mag: 5.40,bv: 0.45},
    {pos:{ra:1.452958,dec:-1.120981},mag: 5.34,bv: 1.04},
    {pos:{ra:1.455714,dec:-1.090651},mag: 3.76,bv: 0.82},
    {pos:{ra:1.482381,dec: 0.451987},mag: 5.18,bv:-0.15},
    {pos:{ra:1.478061,dec:-0.045379},mag: 3.81,bv:-0.24},
    {pos:{ra:1.479974,dec: 0.071932},mag: 4.57,bv:-0.11},
    {pos:{ra:1.473683,dec:-0.500725},mag: 5.31,bv: 0.46},
    {pos:{ra:1.478665,dec:-0.125892},mag: 4.80,bv: 0.13},
    {pos:{ra:1.489180,dec: 0.288571},mag: 4.86,bv:-0.13},
    {pos:{ra:1.486839,dec:-0.033908},mag: 2.05,bv:-0.21},
    {pos:{ra:1.486846,dec:-0.033908},mag: 4.21,bv: 0.00},
    {pos:{ra:1.487210,dec:-0.019703},mag: 4.95,bv:-0.21},
    {pos:{ra:1.448107,dec:-1.332404},mag: 5.19,bv: 1.13},
    {pos:{ra:1.481995,dec:-0.594706},mag: 2.64,bv:-0.12},
    {pos:{ra:1.482788,dec:-0.569486},mag: 5.45,bv: 0.92},
    {pos:{ra:1.494336,dec: 0.025739},mag: 4.91,bv: 1.17},
    {pos:{ra:1.509274,dec: 0.869635},mag: 5.47,bv: 0.03},
    {pos:{ra:1.493355,dec:-0.605067},mag: 5.29,bv:-0.05},
    {pos:{ra:1.503005,dec:-0.391797},mag: 3.60,bv: 0.47},
    {pos:{ra:1.515978,dec: 0.309432},mag: 5.49,bv: 0.30},
    {pos:{ra:1.517193,dec: 0.242596},mag: 5.29,bv:-0.17},
    {pos:{ra:1.523563,dec: 0.683839},mag: 4.52,bv: 0.94},
    {pos:{ra:1.509703,dec:-0.563853},mag: 5.17,bv:-0.28},
    {pos:{ra:1.513877,dec:-0.258692},mag: 3.55,bv: 0.10},
    {pos:{ra:1.518451,dec: 0.112646},mag: 5.27,bv: 0.23},
    {pos:{ra:1.522872,dec: 0.428784},mag: 4.86,bv: 1.01},
    {pos:{ra:1.517375,dec:-0.168768},mag: 2.06,bv:-0.17},
    {pos:{ra:1.511702,dec:-0.813275},mag: 5.31,bv: 1.04},
    {pos:{ra:1.525192,dec: 0.220804},mag: 4.91,bv:-0.07},
    {pos:{ra:1.531701,dec: 0.651105},mag: 4.74,bv: 1.62},
    {pos:{ra:1.533664,dec: 0.683272},mag: 3.97,bv: 1.13},
    {pos:{ra:1.504357,dec:-1.147302},mag: 4.35,bv: 0.21},
    {pos:{ra:1.515317,dec:-0.891277},mag: 3.85,bv: 0.17},
    {pos:{ra:1.525454,dec:-0.252787},mag: 5.49,bv: 0.88},
    {pos:{ra:1.548820,dec: 1.045249},mag: 5.20,bv: 0.02},
    {pos:{ra:1.548311,dec: 0.972270},mag: 4.99,bv: 0.05},
    {pos:{ra:1.533126,dec:-0.131215},mag: 5.35,bv:-0.20},
    {pos:{ra:1.541678,dec: 0.481924},mag: 4.58,bv:-0.02},
    {pos:{ra:1.532930,dec:-0.364410},mag: 3.81,bv: 0.99},
    {pos:{ra:1.537810,dec: 0.032376},mag: 4.78,bv: 1.38},
    {pos:{ra:1.531352,dec:-0.624275},mag: 3.12,bv: 1.16},
    {pos:{ra:1.526414,dec:-0.980293},mag: 4.51,bv: 1.10},
    {pos:{ra:1.546282,dec: 0.353885},mag: 4.41,bv: 0.59},
    {pos:{ra:1.531032,dec:-0.909472},mag: 5.17,bv: 0.99},
    {pos:{ra:1.540755,dec:-0.589946},mag: 4.87,bv:-0.15},
    {pos:{ra:1.549729,dec: 0.129276},mag: 0.50,bv: 1.85},
    {pos:{ra:1.552565,dec: 0.352120},mag: 5.40,bv: 0.99},
    {pos:{ra:1.526698,dec:-1.167645},mag: 5.11,bv:-0.14},
    {pos:{ra:1.568731,dec: 0.947447},mag: 3.72,bv: 1.00},
    {pos:{ra:1.562048,dec: 0.452981},mag: 4.82,bv:-0.06},
    {pos:{ra:1.555110,dec:-0.247274},mag: 3.71,bv: 0.33},
    {pos:{ra:1.551154,dec:-0.647881},mag: 4.97,bv: 1.11},
    {pos:{ra:1.568738,dec: 0.784482},mag: 1.90,bv: 0.03},
    {pos:{ra:1.570513,dec: 0.801751},mag: 4.26,bv: 1.72},
    {pos:{ra:1.554863,dec:-0.547728},mag: 5.50,bv: 0.00},
    {pos:{ra:1.548267,dec:-0.918659},mag: 5.29,bv: 0.31},
    {pos:{ra:1.569582,dec: 0.649481},mag: 2.62,bv:-0.08},
    {pos:{ra:1.545060,dec:-1.101128},mag: 4.65,bv: 1.05},
    {pos:{ra:1.565677,dec: 0.009653},mag: 5.22,bv: 0.01},
    {pos:{ra:1.560048,dec:-0.615810},mag: 4.36,bv:-0.18},
    {pos:{ra:1.566746,dec:-0.166824},mag: 5.03,bv: 0.19},
    {pos:{ra:1.571044,dec:-0.053654},mag: 4.53,bv: 1.22},
    {pos:{ra:1.567073,dec:-0.747268},mag: 3.96,bv: 1.14},
    {pos:{ra:1.581196,dec: 0.168381},mag: 4.12,bv: 0.16},
    {pos:{ra:1.528378,dec:-1.385118},mag: 5.47,bv:-0.08},
    {pos:{ra:1.578825,dec:-0.184971},mag: 4.95,bv:-0.12},
    {pos:{ra:1.585872,dec: 0.343665},mag: 5.14,bv:-0.11},
    {pos:{ra:1.588773,dec: 0.406022},mag: 4.16,bv: 0.82},
    {pos:{ra:1.587901,dec: 0.351480},mag: 4.63,bv: 0.28},
    {pos:{ra:1.585014,dec:-0.458750},mag: 5.04,bv: 1.34},
    {pos:{ra:1.589231,dec:-0.117097},mag: 5.21,bv:-0.06},
    {pos:{ra:1.599529,dec: 0.671651},mag: 5.36,bv: 0.25},
    {pos:{ra:1.592548,dec:-0.287708},mag: 4.93,bv: 0.24},
    {pos:{ra:1.614364,dec: 1.028624},mag: 5.36,bv: 1.09},
    {pos:{ra:1.599791,dec:-0.073197},mag: 5.38,bv:-0.13},
    {pos:{ra:1.597653,dec:-0.260670},mag: 4.67,bv: 0.05},
    {pos:{ra:1.603834,dec: 0.257756},mag: 4.42,bv:-0.17},
    {pos:{ra:1.599303,dec:-0.403355},mag: 5.47,bv: 0.08},
    {pos:{ra:1.626872,dec: 1.147001},mag: 5.32,bv: 1.34},
    {pos:{ra:1.604365,dec:-0.334507},mag: 5.31,bv: 1.68},
    {pos:{ra:1.603638,dec:-0.650189},mag: 5.02,bv:-0.11},
    {pos:{ra:1.609913,dec:-0.391434},mag: 5.50,bv:-0.01},
    {pos:{ra:1.605187,dec:-0.735724},mag: 5.50,bv: 0.00},
    {pos:{ra:1.601587,dec:-1.084805},mag: 5.05,bv: 1.25},
    {pos:{ra:1.623396,dec: 0.281531},mag: 4.95,bv:-0.14},
    {pos:{ra:1.622894,dec: 0.247992},mag: 4.48,bv:-0.18},
    {pos:{ra:1.639199,dec: 1.047183},mag: 5.35,bv: 1.34},
    {pos:{ra:1.622560,dec:-0.114324},mag: 5.05,bv:-0.20},
    {pos:{ra:1.653030,dec: 1.209857},mag: 4.80,bv: 0.03},
    {pos:{ra:1.615731,dec:-0.959383},mag: 4.81,bv:-0.23},
    {pos:{ra:1.648958,dec: 1.073644},mag: 4.98,bv: 1.83},
    {pos:{ra:1.635708,dec: 0.392815},mag: 3.28,bv: 1.60},
    {pos:{ra:1.637897,dec: 0.514838},mag: 4.35,bv: 1.02},
    {pos:{ra:1.635584,dec: 0.334342},mag: 5.20,bv: 0.44},
    {pos:{ra:1.608917,dec:-1.201543},mag: 5.06,bv:-0.08},
    {pos:{ra:1.638072,dec: 0.281749},mag: 5.30,bv:-0.14},
    {pos:{ra:1.635613,dec:-0.109515},mag: 3.98,bv: 1.32},
    {pos:{ra:1.639519,dec: 0.219058},mag: 5.33,bv:-0.02},
    {pos:{ra:1.656419,dec: 1.029933},mag: 4.48,bv: 0.01},
    {pos:{ra:1.642544,dec: 0.214191},mag: 5.04,bv: 0.42},
    {pos:{ra:1.639511,dec:-0.239430},mag: 5.01,bv:-0.08},
    {pos:{ra:1.619884,dec:-1.144752},mag: 5.01,bv: 1.62},
    {pos:{ra:1.645453,dec: 0.173529},mag: 5.39,bv: 0.10},
    {pos:{ra:1.643017,dec:-0.613318},mag: 4.37,bv: 1.00},
    {pos:{ra:1.648005,dec:-0.293492},mag: 5.14,bv: 1.30},
    {pos:{ra:1.615477,dec:-1.304687},mag: 5.09,bv: 0.72},
    {pos:{ra:1.665779,dec: 0.932917},mag: 5.36,bv: 0.43},
    {pos:{ra:1.653016,dec:-0.163891},mag: 5.36,bv: 1.24},
    {pos:{ra:1.656812,dec:-0.136538},mag: 5.27,bv:-0.19},
    {pos:{ra:1.658034,dec:-0.051390},mag: 4.90,bv: 1.60},
    {pos:{ra:1.659430,dec:-0.524704},mag: 3.02,bv:-0.19},
    {pos:{ra:1.670978,dec: 0.392937},mag: 2.88,bv: 1.64},
    {pos:{ra:1.679436,dec: 0.860239},mag: 4.91,bv: 1.97},
    {pos:{ra:1.687799,dec: 1.019573},mag: 5.21,bv: 1.53},
    {pos:{ra:1.669844,dec:-0.313388},mag: 1.98,bv:-0.23},
    {pos:{ra:1.667284,dec:-0.583575},mag: 3.85,bv: 0.88},
    {pos:{ra:1.674505,dec: 0.080159},mag: 4.44,bv: 0.18},
    {pos:{ra:1.676265,dec:-0.201241},mag: 5.22,bv: 1.24},
    {pos:{ra:1.675305,dec:-0.919716},mag:-0.72,bv: 0.15},
    {pos:{ra:1.689610,dec: 0.005221},mag: 5.20,bv: 1.18},
    {pos:{ra:1.697173,dec: 0.352770},mag: 4.15,bv:-0.13},
    {pos:{ra:1.692795,dec:-0.083116},mag: 5.06,bv:-0.17},
    {pos:{ra:1.696533,dec:-0.122745},mag: 4.60,bv:-0.10},
    {pos:{ra:1.696569,dec:-0.122774},mag: 5.40,bv:-0.07},
    {pos:{ra:1.693704,dec:-0.568628},mag: 4.48,bv:-0.17},
    {pos:{ra:1.709572,dec: 0.201489},mag: 5.23,bv: 0.15},
    {pos:{ra:1.681959,dec:-1.216325},mag: 5.38,bv: 0.97},
    {pos:{ra:1.707732,dec:-0.216275},mag: 5.15,bv: 1.27},
    {pos:{ra:1.709703,dec:-0.142385},mag: 5.43,bv: 1.38},
    {pos:{ra:1.700903,dec:-0.876839},mag: 5.27,bv: 0.41},
    {pos:{ra:1.714364,dec: 0.127986},mag: 4.50,bv: 0.00},
    {pos:{ra:1.709790,dec:-0.408727},mag: 4.33,bv:-0.24},
    {pos:{ra:1.699405,dec:-0.992268},mag: 5.22,bv: 1.09},
    {pos:{ra:1.717542,dec:-0.021298},mag: 5.10,bv:-0.14},
    {pos:{ra:1.724393,dec: 0.489080},mag: 5.27,bv:-0.03},
    {pos:{ra:1.711972,dec:-0.657931},mag: 5.24,bv: 1.00},
    {pos:{ra:1.772535,dec: 1.388666},mag: 5.45,bv: 0.50},
    {pos:{ra:1.730268,dec: 0.670997},mag: 5.29,bv: 2.61},
    {pos:{ra:1.718386,dec:-0.632372},mag: 5.42,bv: 1.44},
    {pos:{ra:1.723760,dec:-0.400810},mag: 4.54,bv:-0.05},
    {pos:{ra:1.740180,dec: 0.696430},mag: 5.20,bv:-0.07},
    {pos:{ra:1.735345,dec: 0.286219},mag: 1.93,bv: 0.00},
    {pos:{ra:1.742413,dec: 0.741571},mag: 4.79,bv: 1.23},
    {pos:{ra:1.730858,dec:-0.336078},mag: 3.95,bv: 1.06},
    {pos:{ra:1.723411,dec:-0.924598},mag: 4.39,bv:-0.02},
    {pos:{ra:1.736123,dec:-0.318304},mag: 4.43,bv: 1.15},
    {pos:{ra:1.735701,dec:-0.564435},mag: 5.27,bv: 1.18},
    {pos:{ra:1.742180,dec:-0.246891},mag: 4.82,bv: 1.50},
    {pos:{ra:1.735563,dec:-0.753914},mag: 3.17,bv:-0.11},
    {pos:{ra:1.749598,dec: 0.172710},mag: 4.66,bv:-0.25},
    {pos:{ra:1.758783,dec: 0.777098},mag: 5.02,bv: 1.48},
    {pos:{ra:1.739337,dec:-0.841603},mag: 4.93,bv: 0.87},
    {pos:{ra:1.755823,dec: 0.307968},mag: 5.21,bv: 0.06},
    {pos:{ra:1.753794,dec:-0.159998},mag: 5.19,bv: 1.53},
    {pos:{ra:1.772535,dec: 1.037453},mag: 4.87,bv: 0.08},
    {pos:{ra:1.762484,dec: 0.438621},mag: 2.98,bv: 1.40},
    {pos:{ra:1.775109,dec: 0.997790},mag: 5.35,bv: 0.96},
    {pos:{ra:1.762732,dec: 0.230868},mag: 4.49,bv: 1.16},
    {pos:{ra:1.766091,dec: 0.505636},mag: 5.44,bv: 1.45},
    {pos:{ra:1.774731,dec: 0.760571},mag: 5.25,bv: 0.56},
    {pos:{ra:1.768411,dec: 0.225070},mag: 3.36,bv: 0.43},
    {pos:{ra:1.778752,dec: 0.851536},mag: 5.22,bv: 1.12},
    {pos:{ra:1.793115,dec: 1.179353},mag: 5.14,bv:-0.17},
    {pos:{ra:1.767793,dec:-0.291751},mag:-1.46,bv: 0.00},
    {pos:{ra:1.764848,dec:-0.542283},mag: 5.20,bv:-0.12},
    {pos:{ra:1.771458,dec:-0.258241},mag: 5.32,bv: 0.07},
    {pos:{ra:1.777312,dec: 0.140276},mag: 4.77,bv: 1.40},
    {pos:{ra:1.775225,dec:-0.251778},mag: 5.29,bv:-0.04},
    {pos:{ra:1.779625,dec: 0.042101},mag: 4.47,bv: 1.11},
    {pos:{ra:1.778571,dec:-0.157051},mag: 5.07,bv: 1.80},
    {pos:{ra:1.805121,dec: 1.202328},mag: 5.12,bv:-0.13},
    {pos:{ra:1.792300,dec: 0.729223},mag: 5.02,bv: 1.27},
    {pos:{ra:1.777429,dec:-0.661999},mag: 5.26,bv:-0.08},
    {pos:{ra:1.802423,dec: 1.037574},mag: 5.33,bv: 0.65},
    {pos:{ra:1.784439,dec:-0.264325},mag: 5.39,bv:-0.10},
    {pos:{ra:1.775349,dec:-0.894758},mag: 5.40,bv: 1.34},
    {pos:{ra:1.832887,dec: 1.343511},mag: 4.55,bv: 1.36},
    {pos:{ra:1.795726,dec: 0.379803},mag: 5.27,bv:-0.02},
    {pos:{ra:1.788272,dec:-0.567382},mag: 3.96,bv:-0.23},
    {pos:{ra:1.801129,dec: 0.592733},mag: 3.60,bv: 0.10},
    {pos:{ra:1.788570,dec:-0.813580},mag: 5.14,bv: 0.45},
    {pos:{ra:1.792773,dec:-0.599821},mag: 4.99,bv: 1.38},
    {pos:{ra:1.781065,dec:-1.081081},mag: 3.27,bv: 0.21},
    {pos:{ra:1.788686,dec:-0.883394},mag: 2.93,bv: 1.20},
    {pos:{ra:1.788330,dec:-0.935884},mag: 4.40,bv: 0.92},
    {pos:{ra:1.820706,dec: 1.019665},mag: 4.35,bv: 0.85},
    {pos:{ra:1.809230,dec: 0.229996},mag: 4.65,bv: 0.30},
    {pos:{ra:1.804445,dec:-0.352978},mag: 4.83,bv:-0.21},
    {pos:{ra:1.808205,dec:-0.019669},mag: 5.45,bv: 0.18},
    {pos:{ra:1.807245,dec:-0.210113},mag: 4.07,bv: 1.43},
    {pos:{ra:1.806990,dec:-0.422088},mag: 3.87,bv: 1.73},
    {pos:{ra:1.822204,dec: 0.787042},mag: 4.90,bv: 0.03},
    {pos:{ra:1.813499,dec:-0.351446},mag: 4.68,bv: 0.37},
    {pos:{ra:1.815622,dec:-0.245107},mag: 5.00,bv: 1.18},
    {pos:{ra:1.814183,dec:-0.400403},mag: 5.30,bv:-0.18},
    {pos:{ra:1.815739,dec:-0.297651},mag: 4.37,bv:-0.07},
    {pos:{ra:1.795289,dec:-1.238544},mag: 5.40,bv:-0.11},
    {pos:{ra:1.821971,dec:-0.429884},mag: 5.46,bv: 0.36},
    {pos:{ra:1.816306,dec:-0.850344},mag: 4.95,bv: 1.69},
    {pos:{ra:2.009347,dec: 1.518785},mag: 5.07,bv: 1.63},
    {pos:{ra:1.826596,dec:-0.505661},mag: 1.50,bv:-0.21},
    {pos:{ra:1.825694,dec:-0.595361},mag: 5.06,bv:-0.16},
    {pos:{ra:1.843126,dec: 0.422636},mag: 5.18,bv: 0.94},
    {pos:{ra:1.841061,dec:-0.099872},mag: 5.20,bv: 1.68},
    {pos:{ra:1.840093,dec:-0.487553},mag: 3.47,bv: 1.73},
    {pos:{ra:1.845308,dec:-0.073987},mag: 4.99,bv:-0.20},
    {pos:{ra:1.848449,dec: 0.191143},mag: 5.13,bv: 1.39},
    {pos:{ra:1.850522,dec: 0.359019},mag: 3.79,bv: 0.79},
    {pos:{ra:1.836341,dec:-0.897143},mag: 5.14,bv: 1.61},
    {pos:{ra:1.845795,dec:-0.415970},mag: 3.02,bv:-0.08},
    {pos:{ra:1.848994,dec:-0.272853},mag: 4.12,bv:-0.12},
    {pos:{ra:1.831905,dec:-1.185360},mag: 5.17,bv: 1.40},
    {pos:{ra:1.850253,dec:-0.738924},mag: 5.20,bv: 0.20},
    {pos:{ra:1.849591,dec:-0.865402},mag: 4.93,bv: 0.13},
    {pos:{ra:1.846820,dec:-1.032852},mag: 5.50,bv:-0.11},
    {pos:{ra:1.861735,dec:-0.197120},mag: 5.39,bv: 0.05},
    {pos:{ra:1.851380,dec:-0.990470},mag: 5.17,bv:-0.04},
    {pos:{ra:1.869102,dec: 0.278046},mag: 5.44,bv: 1.03},
    {pos:{ra:1.817644,dec:-1.386145},mag: 5.45,bv: 0.05},
    {pos:{ra:1.869211,dec:-0.460651},mag: 1.84,bv: 0.68},
    {pos:{ra:1.883450,dec: 0.686273},mag: 4.90,bv: 1.45},
    {pos:{ra:1.881203,dec: 0.527880},mag: 4.41,bv: 1.26},
    {pos:{ra:1.877225,dec:-0.073953},mag: 4.92,bv: 1.03},
    {pos:{ra:1.871218,dec:-0.692125},mag: 4.83,bv:-0.18},
    {pos:{ra:1.891021,dec: 0.897603},mag: 5.47,bv: 1.67},
    {pos:{ra:1.882308,dec:-0.005270},mag: 5.45,bv: 0.29},
    {pos:{ra:1.877640,dec:-0.479815},mag: 5.46,bv: 1.00},
    {pos:{ra:1.884367,dec:-0.008601},mag: 4.15,bv:-0.01},
    {pos:{ra:1.902038,dec: 1.040871},mag: 5.20,bv: 1.07},
    {pos:{ra:1.890941,dec: 0.282026},mag: 5.00,bv: 1.66},
    {pos:{ra:1.879683,dec:-0.854028},mag: 5.14,bv: 1.24},
    {pos:{ra:1.886105,dec:-0.706839},mag: 5.31,bv: 0.06},
    {pos:{ra:1.895137,dec: 0.054304},mag: 5.35,bv: 1.19},
    {pos:{ra:1.870767,dec:-1.230438},mag: 3.78,bv: 1.04},
    {pos:{ra:1.887399,dec:-0.816106},mag: 4.49,bv: 0.32},
    {pos:{ra:1.968179,dec: 1.438350},mag: 4.96,bv: 1.66},
    {pos:{ra:1.894788,dec:-0.459938},mag: 4.66,bv:-0.19},
    {pos:{ra:1.890293,dec:-0.788593},mag: 4.89,bv:-0.02},
    {pos:{ra:1.891675,dec:-0.779110},mag: 5.10,bv: 1.56},
    {pos:{ra:1.897224,dec:-0.467273},mag: 3.85,bv:-0.17},
    {pos:{ra:1.913455,dec: 0.863327},mag: 5.05,bv: 0.08},
    {pos:{ra:1.899573,dec:-0.535579},mag: 5.36,bv:-0.17},
    {pos:{ra:1.903463,dec:-0.272024},mag: 5.46,bv: 0.08},
    {pos:{ra:1.896460,dec:-0.842499},mag: 4.76,bv:-0.10},
    {pos:{ra:1.911543,dec: 0.288682},mag: 3.58,bv: 0.11},
    {pos:{ra:1.905085,dec:-0.406933},mag: 4.79,bv: 1.71},
    {pos:{ra:1.904954,dec:-0.486617},mag: 4.64,bv: 1.60},
    {pos:{ra:1.906009,dec:-0.638664},mag: 5.03,bv:-0.17},
    {pos:{ra:1.907398,dec:-0.647474},mag: 2.70,bv: 1.62},
    {pos:{ra:1.920400,dec: 0.383662},mag: 3.53,bv: 0.34},
    {pos:{ra:1.914066,dec:-0.428633},mag: 4.98,bv:-0.15},
    {pos:{ra:1.914219,dec:-0.435532},mag: 4.40,bv:-0.15},
    {pos:{ra:1.932378,dec: 0.964842},mag: 5.45,bv: 0.00},
    {pos:{ra:1.914859,dec:-0.464010},mag: 5.28,bv: 0.96},
    {pos:{ra:1.912474,dec:-0.641132},mag: 4.66,bv:-0.10},
    {pos:{ra:1.913913,dec:-0.641282},mag: 5.11,bv:-0.16},
    {pos:{ra:1.913579,dec:-0.684348},mag: 5.25,bv: 0.01},
    {pos:{ra:1.928778,dec: 0.641593},mag: 5.13,bv: 1.08},
    {pos:{ra:1.928356,dec: 0.356808},mag: 5.10,bv: 1.52},
    {pos:{ra:1.924095,dec:-0.250629},mag: 5.45,bv: 0.98},
    {pos:{ra:1.906030,dec:-1.186077},mag: 3.98,bv: 0.79},
    {pos:{ra:1.937934,dec: 0.709864},mag: 5.19,bv: 1.23},
    {pos:{ra:1.935025,dec: 0.437215},mag: 5.03,bv: 0.90},
    {pos:{ra:1.929571,dec:-0.331903},mag: 4.96,bv:-0.04},
    {pos:{ra:1.922677,dec:-0.909074},mag: 5.39,bv:-0.07},
    {pos:{ra:1.949155,dec: 0.858901},mag: 4.64,bv:-0.02},
    {pos:{ra:1.932996,dec:-0.557177},mag: 5.43,bv:-0.15},
    {pos:{ra:1.941548,dec: 0.203675},mag: 5.30,bv: 0.10},
    {pos:{ra:1.944849,dec: 0.485168},mag: 3.79,bv: 1.03},
    {pos:{ra:1.935068,dec:-0.485798},mag: 5.38,bv: 1.53},
    {pos:{ra:1.935272,dec:-0.562035},mag: 5.39,bv:-0.18},
    {pos:{ra:1.940232,dec:-0.282763},mag: 5.33,bv:-0.05},
    {pos:{ra:1.937730,dec:-0.511435},mag: 2.45,bv:-0.08},
    {pos:{ra:1.944508,dec: 0.161899},mag: 4.99,bv: 1.01},
    {pos:{ra:1.940501,dec:-0.555170},mag: 5.35,bv: 1.07},
    {pos:{ra:1.951060,dec: 0.144678},mag: 2.90,bv:-0.09},
    {pos:{ra:1.953634,dec: 0.374286},mag: 5.22,bv: 0.39},
    {pos:{ra:1.963205,dec: 0.866949},mag: 5.36,bv: 0.45},
    {pos:{ra:1.954921,dec: 0.121160},mag: 5.25,bv: 0.22},
    {pos:{ra:1.959619,dec: 0.554743},mag: 4.18,bv: 0.32},
    {pos:{ra:1.955481,dec: 0.155780},mag: 4.32,bv: 1.43},
    {pos:{ra:1.960616,dec: 0.490753},mag: 5.05,bv: 0.11},
    {pos:{ra:1.962674,dec: 0.487228},mag: 5.01,bv: 1.11},
    {pos:{ra:1.947635,dec:-0.890438},mag: 5.10,bv: 1.06},
    {pos:{ra:1.962608,dec: 0.209556},mag: 4.54,bv: 1.28},
    {pos:{ra:1.962870,dec:-0.401852},mag: 4.85,bv: 0.23},
    {pos:{ra:1.959547,dec:-0.677401},mag: 5.43,bv:-0.16},
    {pos:{ra:1.971378,dec: 0.298209},mag: 5.42,bv: 1.13},
    {pos:{ra:1.960136,dec:-0.755752},mag: 3.25,bv: 1.51},
    {pos:{ra:1.972651,dec: 0.033413},mag: 5.25,bv: 0.22},
    {pos:{ra:1.966586,dec:-0.540393},mag: 4.65,bv: 0.93},
    {pos:{ra:1.979240,dec: 0.276227},mag: 5.25,bv: 0.05},
    {pos:{ra:1.983567,dec: 0.556561},mag: 2.88,bv: 0.04},
    {pos:{ra:1.983567,dec: 0.556556},mag: 1.98,bv: 0.03},
    {pos:{ra:1.985945,dec: 0.540373},mag: 5.33,bv: 1.01},
    {pos:{ra:1.980069,dec:-0.253490},mag: 4.97,bv: 1.41},
    {pos:{ra:1.989334,dec: 0.469421},mag: 4.06,bv: 1.54},
    {pos:{ra:1.981181,dec:-0.389141},mag: 4.45,bv: 0.51},
    {pos:{ra:1.986970,dec:-0.495140},mag: 4.64,bv:-0.11},
    {pos:{ra:1.995253,dec:-0.071752},mag: 5.13,bv: 0.44},
    {pos:{ra:2.003485,dec: 0.603608},mag: 4.90,bv: 0.40},
    {pos:{ra:1.988199,dec:-0.916889},mag: 4.94,bv: 1.40},
    {pos:{ra:1.995646,dec:-0.610317},mag: 4.53,bv:-0.09},
    {pos:{ra:2.004845,dec: 0.308482},mag: 5.05,bv: 1.56},
    {pos:{ra:2.004081,dec: 0.091193},mag: 0.38,bv: 0.42},
    {pos:{ra:1.999711,dec:-0.442698},mag: 4.70,bv:-0.11},
    {pos:{ra:2.020248,dec: 1.024688},mag: 4.99,bv: 0.08},
    {pos:{ra:2.001987,dec:-0.467777},mag: 4.50,bv:-0.17},
    {pos:{ra:2.002023,dec:-0.467811},mag: 4.62,bv: 0.00},
    {pos:{ra:2.008816,dec:-0.266400},mag: 4.94,bv: 1.56},
    {pos:{ra:2.004758,dec:-0.668607},mag: 4.84,bv:-0.19},
    {pos:{ra:2.024887,dec: 0.880237},mag: 5.27,bv: 0.00},
    {pos:{ra:2.012568,dec:-0.166698},mag: 3.93,bv: 1.02},
    {pos:{ra:2.021579,dec: 0.504114},mag: 4.28,bv: 1.12},
    {pos:{ra:2.012641,dec:-0.672538},mag: 5.42,bv:-0.15},
    {pos:{ra:2.025084,dec: 0.450019},mag: 5.31,bv: 1.54},
    {pos:{ra:2.026531,dec: 0.425826},mag: 3.57,bv: 0.93},
    {pos:{ra:2.030320,dec: 0.489148},mag: 1.14,bv: 1.00},
    {pos:{ra:2.022575,dec:-0.495867},mag: 4.59,bv: 1.63},
    {pos:{ra:2.023746,dec:-0.505355},mag: 3.96,bv: 0.18},
    {pos:{ra:2.020015,dec:-0.788423},mag: 5.06,bv: 0.78},
    {pos:{ra:2.036167,dec: 0.654804},mag: 5.18,bv: 1.58},
    {pos:{ra:2.023266,dec:-0.714431},mag: 5.17,bv: 1.10},
    {pos:{ra:2.033847,dec: 0.323060},mag: 4.88,bv: 1.45},
    {pos:{ra:2.034487,dec: 0.187943},mag: 5.30,bv: 0.01},
    {pos:{ra:2.039875,dec: 0.583211},mag: 5.14,bv: 1.60},
    {pos:{ra:2.033468,dec:-0.118202},mag: 5.49,bv: 1.38},
    {pos:{ra:2.033083,dec:-0.254188},mag: 5.04,bv: 0.33},
    {pos:{ra:2.030058,dec:-0.662677},mag: 3.61,bv: 1.73},
    {pos:{ra:2.031491,dec:-0.596432},mag: 5.37,bv: 0.60},
    {pos:{ra:2.015070,dec:-1.267216},mag: 3.95,bv: 1.04},
    {pos:{ra:2.041795,dec:-0.212809},mag: 5.48,bv: 0.48},
    {pos:{ra:2.042413,dec:-0.452690},mag: 4.50,bv:-0.05},
    {pos:{ra:2.039490,dec:-0.672146},mag: 5.08,bv:-0.10},
    {pos:{ra:2.039963,dec:-0.813474},mag: 5.23,bv:-0.14},
    {pos:{ra:2.046522,dec:-0.434800},mag: 5.33,bv: 0.76},
    {pos:{ra:2.049395,dec:-0.300691},mag: 5.18,bv: 1.28},
    {pos:{ra:2.047686,dec:-0.433884},mag: 3.34,bv: 1.24},
    {pos:{ra:2.043511,dec:-0.821662},mag: 4.71,bv: 1.06},
    {pos:{ra:2.047438,dec:-0.809367},mag: 4.11,bv:-0.18},
    {pos:{ra:2.058180,dec: 0.030839},mag: 5.14,bv:-0.12},
    {pos:{ra:2.058492,dec:-0.242567},mag: 5.17,bv: 0.60},
    {pos:{ra:2.071320,dec: 0.830161},mag: 5.45,bv: 1.46},
    {pos:{ra:2.066019,dec: 0.467152},mag: 4.97,bv: 0.09},
    {pos:{ra:2.095246,dec: 1.290113},mag: 5.41,bv: 1.42},
    {pos:{ra:2.060630,dec:-0.605721},mag: 5.01,bv: 0.44},
    {pos:{ra:2.060434,dec:-0.708182},mag: 3.73,bv: 1.04},
    {pos:{ra:2.115274,dec: 1.387183},mag: 5.42,bv:-0.06},
    {pos:{ra:2.062303,dec:-0.678288},mag: 4.49,bv:-0.19},
    {pos:{ra:2.064106,dec:-0.634670},mag: 5.43,bv: 1.16},
    {pos:{ra:2.075480,dec: 0.347039},mag: 5.35,bv:-0.04},
    {pos:{ra:2.064121,dec:-0.865911},mag: 4.63,bv:-0.23},
    {pos:{ra:2.065175,dec:-0.839557},mag: 4.24,bv:-0.14},
    {pos:{ra:2.069015,dec:-0.626181},mag: 5.49,bv:-0.19},
    {pos:{ra:2.080687,dec:-0.399331},mag: 4.20,bv: 0.72},
    {pos:{ra:2.087167,dec: 0.038829},mag: 5.29,bv: 0.92},
    {pos:{ra:2.084221,dec:-0.529441},mag: 4.79,bv: 0.15},
    {pos:{ra:2.081152,dec:-0.759223},mag: 5.35,bv:-0.18},
    {pos:{ra:2.082643,dec:-0.769860},mag: 5.09,bv:-0.17},
    {pos:{ra:2.080338,dec:-0.924714},mag: 3.47,bv:-0.18},
    {pos:{ra:2.085072,dec:-0.795482},mag: 5.17,bv: 1.27},
    {pos:{ra:2.093239,dec:-0.064223},mag: 4.93,bv: 1.21},
    {pos:{ra:2.090446,dec:-0.406846},mag: 5.11,bv: 1.12},
    {pos:{ra:2.086716,dec:-0.859487},mag: 4.41,bv:-0.17},
    {pos:{ra:2.093813,dec:-0.321126},mag: 4.61,bv: 0.08},
    {pos:{ra:2.092097,dec:-0.685866},mag: 5.24,bv: 0.39},
    {pos:{ra:2.099726,dec:-0.024304},mag: 4.68,bv: 1.49},
    {pos:{ra:2.104278,dec: 0.040744},mag: 4.39,bv: 1.25},
    {pos:{ra:2.109747,dec: 0.485100},mag: 4.94,bv: 1.12},
    {pos:{ra:2.092766,dec:-1.057442},mag: 5.17,bv: 1.74},
    {pos:{ra:2.095850,dec:-1.109462},mag: 4.82,bv:-0.17},
    {pos:{ra:2.116539,dec: 0.228953},mag: 5.12,bv: 0.01},
    {pos:{ra:2.110038,dec:-0.698190},mag: 2.25,bv:-0.26},
    {pos:{ra:2.113026,dec:-0.570286},mag: 5.31,bv: 1.91},
    {pos:{ra:2.131294,dec: 0.898961},mag: 4.84,bv: 0.05},
    {pos:{ra:2.128269,dec: 0.376671},mag: 5.30,bv: 0.63},
    {pos:{ra:2.150304,dec: 1.195100},mag: 5.32,bv: 1.04},
    {pos:{ra:2.126247,dec:-0.358748},mag: 5.38,bv: 0.10},
    {pos:{ra:2.127309,dec:-0.424188},mag: 2.81,bv: 0.43},
    {pos:{ra:2.123513,dec:-0.790048},mag: 5.05,bv: 1.50},
    {pos:{ra:2.131891,dec:-0.052079},mag: 4.34,bv: 0.97},
    {pos:{ra:2.133781,dec:-0.335889},mag: 4.40,bv:-0.15},
    {pos:{ra:2.136276,dec:-0.770088},mag: 5.21,bv:-0.19},
    {pos:{ra:2.135796,dec:-0.826341},mag: 4.27,bv:-0.23},
    {pos:{ra:2.135992,dec:-0.826181},mag: 1.78,bv:-0.22},
    {pos:{ra:2.143577,dec:-0.225618},mag: 4.72,bv: 0.95},
    {pos:{ra:2.144792,dec:-0.135656},mag: 5.36,bv: 0.89},
    {pos:{ra:2.136806,dec:-0.836667},mag: 5.23,bv:-0.21},
    {pos:{ra:2.133716,dec:-1.069930},mag: 4.76,bv: 0.43},
    {pos:{ra:2.128996,dec:-1.197596},mag: 4.35,bv:-0.11},
    {pos:{ra:2.143955,dec:-0.691475},mag: 4.45,bv: 1.62},
    {pos:{ra:2.144275,dec:-0.750269},mag: 4.75,bv: 0.18},
    {pos:{ra:2.152573,dec:-0.275558},mag: 4.99,bv: 1.07},
    {pos:{ra:2.153271,dec:-0.626568},mag: 4.78,bv:-0.11},
    {pos:{ra:2.155365,dec:-0.633947},mag: 5.08,bv:-0.19},
    {pos:{ra:2.155693,dec:-0.704206},mag: 4.44,bv: 1.17},
    {pos:{ra:2.153751,dec:-0.820164},mag: 5.13,bv:-0.14},
    {pos:{ra:2.166455,dec: 0.160318},mag: 3.52,bv: 1.48},
    {pos:{ra:2.161001,dec:-1.098089},mag: 5.16,bv: 0.09},
    {pos:{ra:2.181945,dec: 0.475040},mag: 5.14,bv: 0.47},
    {pos:{ra:2.175357,dec:-0.639828},mag: 4.45,bv: 0.22},
    {pos:{ra:2.194031,dec: 0.753774},mag: 4.25,bv: 1.55},
    {pos:{ra:2.174309,dec:-1.145169},mag: 5.07,bv: 1.15},
    {pos:{ra:2.187697,dec:-0.576909},mag: 4.83,bv: 1.45},
    {pos:{ra:2.187552,dec:-0.636774},mag: 5.20,bv:-0.19},
    {pos:{ra:2.192686,dec:-0.846315},mag: 4.82,bv:-0.15},
    {pos:{ra:2.180862,dec:-1.248172},mag: 5.37,bv:-0.06},
    {pos:{ra:2.207463,dec: 0.132024},mag: 5.13,bv: 0.94},
    {pos:{ra:2.192628,dec:-1.038641},mag: 1.86,bv: 1.28},
    {pos:{ra:2.206358,dec:-0.068179},mag: 3.90,bv:-0.02},
    {pos:{ra:2.203747,dec:-0.419684},mag: 5.28,bv: 1.48},
    {pos:{ra:2.175233,dec:-1.342502},mag: 4.07,bv: 0.39},
    {pos:{ra:2.211034,dec: 0.220862},mag: 5.50,bv: 1.60},
    {pos:{ra:2.226451,dec: 1.059730},mag: 3.36,bv: 0.84},
    {pos:{ra:2.207253,dec:-0.735714},mag: 5.47,bv:-0.15},
    {pos:{ra:2.205733,dec:-0.902825},mag: 5.17,bv:-0.16},
    {pos:{ra:2.190708,dec:-1.281072},mag: 5.29,bv: 0.01},
    {pos:{ra:2.184461,dec:-1.352359},mag: 4.35,bv: 1.16},
    {pos:{ra:2.206692,dec:-1.154307},mag: 3.77,bv: 1.13},
    {pos:{ra:2.214859,dec:-0.926571},mag: 5.09,bv: 0.25},
    {pos:{ra:2.245381,dec: 1.136995},mag: 5.47,bv: 0.18},
    {pos:{ra:2.232254,dec: 0.315808},mag: 5.35,bv: 1.56},
    {pos:{ra:2.221273,dec:-0.836522},mag: 5.33,bv:-0.14},
    {pos:{ra:2.222939,dec:-0.780599},mag: 4.99,bv:-0.16},
    {pos:{ra:2.237112,dec: 0.356765},mag: 5.33,bv: 1.25},
    {pos:{ra:2.231905,dec:-0.341692},mag: 5.42,bv:-0.06},
    {pos:{ra:2.269859,dec: 1.122732},mag: 4.60,bv: 1.17},
    {pos:{ra:2.245919,dec:-0.871690},mag: 5.01,bv: 1.33},
    {pos:{ra:2.258703,dec: 0.099547},mag: 4.16,bv: 0.00},
    {pos:{ra:2.248537,dec:-1.012451},mag: 4.86,bv: 1.00},
    {pos:{ra:2.248231,dec:-1.016218},mag: 5.26,bv:-0.14},
    {pos:{ra:2.263503,dec: 0.058318},mag: 4.44,bv: 1.21},
    {pos:{ra:2.259634,dec:-0.458236},mag: 5.27,bv:-0.04},
    {pos:{ra:2.273371,dec: 0.799952},mag: 5.37,bv: 0.99},
    {pos:{ra:2.258652,dec:-0.750302},mag: 4.14,bv: 0.11},
    {pos:{ra:2.265146,dec:-0.395526},mag: 5.05,bv: 0.73},
    {pos:{ra:2.269037,dec:-0.217735},mag: 4.98,bv: 1.42},
    {pos:{ra:2.257205,dec:-1.097003},mag: 5.47,bv: 1.02},
    {pos:{ra:2.267655,dec:-0.515939},mag: 4.89,bv: 0.90},
    {pos:{ra:2.269379,dec:-0.616247},mag: 3.97,bv: 0.94},
    {pos:{ra:2.270332,dec:-0.702742},mag: 5.20,bv:-0.01},
    {pos:{ra:2.266295,dec:-0.932699},mag: 5.48,bv:-0.16},
    {pos:{ra:2.276440,dec:-0.278264},mag: 4.88,bv: 1.06},
    {pos:{ra:2.268754,dec:-0.925984},mag: 5.19,bv:-0.14},
    {pos:{ra:2.271662,dec:-0.814177},mag: 3.84,bv: 0.71},
    {pos:{ra:2.270208,dec:-0.923662},mag: 3.62,bv:-0.18},
    {pos:{ra:2.283262,dec: 0.374698},mag: 4.66,bv: 0.02},
    {pos:{ra:2.274244,dec:-0.825836},mag: 4.77,bv: 0.12},
    {pos:{ra:2.283000,dec: 0.059317},mag: 4.30,bv:-0.20},
    {pos:{ra:2.277429,dec:-0.792569},mag: 5.23,bv: 0.21},
    {pos:{ra:2.271619,dec:-1.043028},mag: 4.33,bv:-0.11},
    {pos:{ra:2.284956,dec:-0.126250},mag: 4.62,bv: 0.84},
    {pos:{ra:2.264943,dec:-1.228484},mag: 5.20,bv: 0.01},
    {pos:{ra:2.289370,dec: 0.316850},mag: 3.94,bv: 1.08},
    {pos:{ra:2.279509,dec:-0.927012},mag: 4.86,bv:-0.17},
    {pos:{ra:2.284600,dec:-0.579212},mag: 3.68,bv:-0.18},
    {pos:{ra:2.298148,dec: 0.501957},mag: 4.02,bv: 1.01},
    {pos:{ra:2.284949,dec:-0.869572},mag: 5.16,bv:-0.20},
    {pos:{ra:2.288127,dec:-0.744368},mag: 4.07,bv: 0.87},
    {pos:{ra:2.298497,dec: 0.112031},mag: 3.38,bv: 0.68},
    {pos:{ra:2.296744,dec:-0.236453},mag: 4.32,bv: 0.90},
    {pos:{ra:2.289450,dec:-0.954841},mag: 1.96,bv: 0.04},
    {pos:{ra:2.300562,dec:-0.033113},mag: 5.29,bv: 0.04},
    {pos:{ra:2.295232,dec:-0.803579},mag: 3.91,bv: 0.00},
    {pos:{ra:2.305725,dec: 0.101888},mag: 4.36,bv:-0.04},
    {pos:{ra:2.297333,dec:-0.801329},mag: 5.46,bv: 0.27},
    {pos:{ra:2.298199,dec:-0.990819},mag: 4.49,bv:-0.17},
    {pos:{ra:2.309776,dec:-0.060093},mag: 5.31,bv:-0.09},
    {pos:{ra:2.274709,dec:-1.378170},mag: 5.47,bv:-0.10},
    {pos:{ra:2.321055,dec: 0.763174},mag: 5.15,bv: 0.98},
    {pos:{ra:2.311943,dec:-0.572129},mag: 5.21,bv: 0.87},
    {pos:{ra:2.311049,dec:-0.703726},mag: 5.48,bv: 0.06},
    {pos:{ra:2.314881,dec:-0.483631},mag: 4.01,bv: 1.27},
    {pos:{ra:2.311667,dec:-0.790775},mag: 4.93,bv: 0.05},
    {pos:{ra:2.314997,dec:-0.812087},mag: 5.10,bv:-0.21},
    {pos:{ra:2.331084,dec: 0.533712},mag: 5.39,bv: 1.05},
    {pos:{ra:2.315092,dec:-1.165759},mag: 5.35,bv: 0.42},
    {pos:{ra:2.337265,dec: 0.487427},mag: 5.22,bv: 1.00},
    {pos:{ra:2.336094,dec: 0.103770},mag: 3.11,bv: 1.00},
    {pos:{ra:2.338421,dec: 0.202914},mag: 5.41,bv: 1.46},
    {pos:{ra:2.329338,dec:-0.829395},mag: 5.33,bv: 0.26},
    {pos:{ra:2.342857,dec: 0.574393},mag: 5.45,bv: 0.12},
    {pos:{ra:2.336669,dec:-0.483141},mag: 4.89,bv: 0.11},
    {pos:{ra:2.344188,dec: 0.267433},mag: 5.20,bv: 0.15},
    {pos:{ra:2.352733,dec: 0.838485},mag: 3.14,bv: 0.19},
    {pos:{ra:2.334582,dec:-1.058450},mag: 3.84,bv:-0.10},
    {pos:{ra:2.349591,dec: 0.206957},mag: 4.25,bv: 0.14},
    {pos:{ra:2.340152,dec:-0.920201},mag: 4.69,bv:-0.12},
    {pos:{ra:2.354202,dec: 0.565812},mag: 5.20,bv: 0.93},
    {pos:{ra:2.367299,dec: 1.180361},mag: 4.76,bv: 1.53},
    {pos:{ra:2.358987,dec: 0.729247},mag: 3.97,bv: 0.44},
    {pos:{ra:2.342988,dec:-1.033749},mag: 4.92,bv:-0.19},
    {pos:{ra:2.351271,dec:-0.824401},mag: 5.18,bv: 0.25},
    {pos:{ra:2.356587,dec:-0.720016},mag: 4.45,bv: 0.65},
    {pos:{ra:2.372011,dec: 0.823039},mag: 3.60,bv: 0.00},
    {pos:{ra:2.368143,dec: 0.426781},mag: 5.45,bv:-0.04},
    {pos:{ra:2.353584,dec:-1.031204},mag: 5.16,bv: 0.42},
    {pos:{ra:2.363801,dec:-0.910858},mag: 5.23,bv:-0.12},
    {pos:{ra:2.392817,dec: 1.167160},mag: 5.14,bv: 1.51},
    {pos:{ra:2.384687,dec: 0.671118},mag: 4.56,bv: 1.04},
    {pos:{ra:2.382258,dec: 0.088876},mag: 4.97,bv: 1.22},
    {pos:{ra:2.374324,dec:-0.822011},mag: 3.75,bv: 1.20},
    {pos:{ra:2.366870,dec:-1.158831},mag: 4.00,bv: 0.14},
    {pos:{ra:2.401515,dec: 1.171722},mag: 4.80,bv: 0.49},
    {pos:{ra:2.394904,dec: 0.900672},mag: 4.48,bv: 0.27},
    {pos:{ra:2.391108,dec: 0.517563},mag: 5.43,bv: 0.89},
    {pos:{ra:2.389996,dec: 0.186193},mag: 5.24,bv:-0.11},
    {pos:{ra:2.403835,dec: 1.108522},mag: 4.67,bv: 0.35},
    {pos:{ra:2.397028,dec: 0.384768},mag: 5.14,bv: 0.97},
    {pos:{ra:2.391312,dec:-0.451313},mag: 4.58,bv: 1.59},
    {pos:{ra:2.391087,dec:-0.758040},mag: 2.21,bv: 1.66},
    {pos:{ra:2.398046,dec:-0.153376},mag: 5.46,bv: 1.01},
    {pos:{ra:2.380796,dec:-1.231136},mag: 4.71,bv:-0.15},
    {pos:{ra:2.378651,dec:-1.267158},mag: 4.48,bv: 0.61},
    {pos:{ra:2.418779,dec: 1.072039},mag: 5.13,bv: 0.58},
    {pos:{ra:2.416423,dec: 0.754292},mag: 5.32,bv:-0.14},
    {pos:{ra:2.404511,dec:-0.783095},mag: 5.00,bv: 0.23},
    {pos:{ra:2.404046,dec:-1.029167},mag: 3.44,bv:-0.19},
    {pos:{ra:2.425273,dec: 0.990324},mag: 5.27,bv: 1.56},
    {pos:{ra:2.426829,dec: 0.942861},mag: 4.83,bv: 0.19},
    {pos:{ra:2.405398,dec:-1.087641},mag: 3.97,bv:-0.18},
    {pos:{ra:2.418874,dec: 0.040390},mag: 3.88,bv:-0.06},
    {pos:{ra:2.422648,dec: 0.260776},mag: 5.34,bv: 1.32},
    {pos:{ra:2.419063,dec:-0.754462},mag: 5.25,bv:-0.14},
    {pos:{ra:2.341730,dec:-1.495102},mag: 5.42,bv: 0.31},
    {pos:{ra:2.418590,dec:-0.969875},mag: 5.27,bv: 0.99},
    {pos:{ra:2.429040,dec:-0.110882},mag: 5.24,bv: 1.17},
    {pos:{ra:2.424313,dec:-0.673173},mag: 4.94,bv: 1.11},
    {pos:{ra:2.429011,dec:-0.152624},mag: 5.47,bv:-0.09},
    {pos:{ra:2.424924,dec:-0.652986},mag: 4.62,bv: 0.45},
    {pos:{ra:2.413790,dec:-1.216795},mag: 1.68,bv: 0.00},
    {pos:{ra:2.438421,dec: 0.642325},mag: 3.82,bv: 0.06},
    {pos:{ra:2.427688,dec:-0.772585},mag: 5.12,bv: 1.67},
    {pos:{ra:2.430167,dec:-0.687684},mag: 5.33,bv: 1.17},
    {pos:{ra:2.426895,dec:-1.004287},mag: 4.34,bv: 1.63},
    {pos:{ra:2.450973,dec: 0.989587},mag: 5.47,bv: 1.61},
    {pos:{ra:2.430764,dec:-1.034549},mag: 2.25,bv: 0.18},
    {pos:{ra:2.435156,dec:-0.891010},mag: 5.26,bv:-0.07},
    {pos:{ra:2.448064,dec: 0.600262},mag: 3.13,bv: 1.55},
    {pos:{ra:2.442472,dec:-0.209003},mag: 4.79,bv: 0.93},
    {pos:{ra:2.445570,dec:-0.166781},mag: 4.80,bv: 0.93},
    {pos:{ra:2.431622,dec:-1.198857},mag: 5.39,bv: 0.42},
    {pos:{ra:2.449977,dec:-0.453184},mag: 4.72,bv: 1.63},
    {pos:{ra:2.432218,dec:-1.307155},mag: 5.29,bv: 0.02},
    {pos:{ra:2.447592,dec:-1.089168},mag: 4.81,bv: 0.94},
    {pos:{ra:2.463772,dec: 0.456966},mag: 4.46,bv: 1.23},
    {pos:{ra:2.457445,dec:-0.503246},mag: 4.69,bv: 0.92},
    {pos:{ra:2.452682,dec:-0.960120},mag: 2.50,bv:-0.18},
    {pos:{ra:2.481277,dec: 0.795894},mag: 5.41,bv: 0.98},
    {pos:{ra:2.476564,dec:-0.151121},mag: 1.98,bv: 1.44},
    {pos:{ra:2.475342,dec:-0.389974},mag: 4.69,bv: 1.14},
    {pos:{ra:2.477408,dec:-0.105961},mag: 5.38,bv: 0.64},
    {pos:{ra:2.518016,dec: 1.419413},mag: 4.29,bv: 1.48},
    {pos:{ra:2.470957,dec:-0.931642},mag: 5.11,bv:-0.11},
    {pos:{ra:2.480367,dec: 0.158069},mag: 5.41,bv: 0.60},
    {pos:{ra:2.493763,dec: 1.100639},mag: 3.67,bv: 0.33},
    {pos:{ra:2.483378,dec:-0.048326},mag: 4.60,bv: 0.46},
    {pos:{ra:2.483800,dec:-0.627470},mag: 4.51,bv: 1.44},
    {pos:{ra:2.493814,dec: 0.612664},mag: 5.37,bv: 1.53},
    {pos:{ra:2.486694,dec:-0.464078},mag: 5.48,bv: 1.36},
    {pos:{ra:2.506649,dec: 1.218768},mag: 4.56,bv: 0.77},
    {pos:{ra:2.494599,dec: 0.400868},mag: 4.31,bv: 1.54},
    {pos:{ra:2.499559,dec: 0.901938},mag: 3.17,bv: 0.46},
    {pos:{ra:2.474470,dec:-1.249695},mag: 5.47,bv: 1.08},
    {pos:{ra:2.495646,dec: 0.169573},mag: 5.07,bv: 1.37},
    {pos:{ra:2.495581,dec: 0.197217},mag: 4.97,bv: 1.05},
    {pos:{ra:2.487472,dec:-0.899145},mag: 5.45,bv:-0.10},
    {pos:{ra:2.490149,dec:-0.706277},mag: 3.60,bv: 0.36},
    {pos:{ra:2.495741,dec:-0.020682},mag: 4.57,bv: 0.10},
    {pos:{ra:2.461576,dec:-1.409998},mag: 5.36,bv: 0.45},
    {pos:{ra:2.508147,dec: 0.908468},mag: 4.50,bv: 0.01},
    {pos:{ra:2.505522,dec: 0.635256},mag: 4.55,bv: 0.92},
    {pos:{ra:2.492425,dec:-0.995439},mag: 3.13,bv: 1.55},
    {pos:{ra:2.497224,dec:-0.709467},mag: 5.35,bv: 0.90},
    {pos:{ra:2.501093,dec:-0.368541},mag: 5.01,bv: 1.02},
    {pos:{ra:2.509187,dec: 0.691524},mag: 4.81,bv: 0.99},
    {pos:{ra:2.511791,dec: 0.625007},mag: 5.41,bv: 0.77},
    {pos:{ra:2.503420,dec:-0.855299},mag: 5.12,bv:-0.12},
    {pos:{ra:2.505188,dec:-0.894573},mag: 5.01,bv:-0.18},
    {pos:{ra:2.494097,dec:-1.275501},mag: 5.47,bv: 1.56},
    {pos:{ra:2.506489,dec:-1.033749},mag: 4.08,bv: 0.01},
    {pos:{ra:2.518561,dec: 0.119308},mag: 5.00,bv: 1.05},
    {pos:{ra:2.523579,dec: 0.702316},mag: 5.25,bv: 0.22},
    {pos:{ra:2.523986,dec: 0.081143},mag: 4.68,bv: 1.32},
    {pos:{ra:2.516881,dec:-0.861412},mag: 4.35,bv: 0.17},
    {pos:{ra:2.543614,dec: 1.261044},mag: 5.17,bv: 1.04},
    {pos:{ra:2.518532,dec:-0.936694},mag: 5.45,bv: 0.15},
    {pos:{ra:2.522110,dec:-0.753827},mag: 5.50,bv: 1.00},
    {pos:{ra:2.530102,dec:-0.019945},mag: 3.91,bv: 1.32},
    {pos:{ra:2.532065,dec:-0.250144},mag: 5.06,bv:-0.15},
    {pos:{ra:2.535745,dec: 0.172652},mag: 3.52,bv: 0.49},
    {pos:{ra:2.527891,dec:-1.070377},mag: 4.52,bv:-0.07},
    {pos:{ra:2.536327,dec:-0.411752},mag: 4.77,bv:-0.12},
    {pos:{ra:2.504053,dec:-1.412694},mag: 5.11,bv:-0.14},
    {pos:{ra:2.540501,dec:-0.417405},mag: 4.94,bv: 0.53},
    {pos:{ra:2.533818,dec:-1.012005},mag: 5.32,bv: 0.20},
    {pos:{ra:2.547010,dec: 0.244724},mag: 5.35,bv: 1.63},
    {pos:{ra:2.559213,dec: 0.997073},mag: 5.20,bv: 1.62},
    {pos:{ra:2.549061,dec:-0.484668},mag: 4.79,bv: 0.51},
    {pos:{ra:2.556260,dec: 0.414937},mag: 2.98,bv: 0.80},
    {pos:{ra:2.568208,dec: 0.803220},mag: 5.09,bv: 0.62},
    {pos:{ra:2.553620,dec:-1.090967},mag: 3.69,bv: 1.22},
    {pos:{ra:2.578680,dec: 1.030418},mag: 3.80,bv: 0.29},
    {pos:{ra:2.561714,dec:-1.135720},mag: 3.01,bv: 0.28},
    {pos:{ra:2.583553,dec: 0.943603},mag: 4.59,bv: 0.03},
    {pos:{ra:2.574150,dec:-0.798188},mag: 5.08,bv:-0.10},
    {pos:{ra:2.582578,dec: 0.425778},mag: 5.32,bv: 0.23},
    {pos:{ra:2.558405,dec:-1.339996},mag: 5.45,bv: 0.89},
    {pos:{ra:2.580811,dec:-0.259123},mag: 4.12,bv: 0.92},
    {pos:{ra:2.586418,dec: 0.453907},mag: 3.88,bv: 1.22},
    {pos:{ra:2.585298,dec:-0.141459},mag: 5.05,bv: 0.04},
    {pos:{ra:2.581691,dec:-0.812412},mag: 4.58,bv: 1.20},
    {pos:{ra:2.599304,dec: 0.869523},mag: 5.27,bv: 0.07},
    {pos:{ra:2.592708,dec:-0.452608},mag: 4.88,bv: 1.23},
    {pos:{ra:2.595610,dec:-0.331777},mag: 4.94,bv: 1.57},
    {pos:{ra:2.607893,dec: 0.716555},mag: 5.14,bv: 0.46},
    {pos:{ra:2.610242,dec: 0.217201},mag: 5.26,bv:-0.04},
    {pos:{ra:2.617390,dec: 0.991556},mag: 5.48,bv: 1.46},
    {pos:{ra:2.604308,dec:-0.952387},mag: 3.54,bv:-0.08},
    {pos:{ra:2.613070,dec:-0.626418},mag: 5.23,bv: 0.31},
    {pos:{ra:2.618925,dec: 0.140397},mag: 4.70,bv: 1.60},
    {pos:{ra:2.622408,dec: 0.557172},mag: 5.36,bv: 0.66},
    {pos:{ra:2.640356,dec:-0.228022},mag: 4.60,bv:-0.09},
    {pos:{ra:2.650413,dec: 0.615136},mag: 4.48,bv: 0.18},
    {pos:{ra:2.649992,dec: 0.292566},mag: 3.52,bv:-0.03},
    {pos:{ra:2.644996,dec:-0.826762},mag: 5.08,bv: 0.88},
    {pos:{ra:2.652486,dec: 0.174489},mag: 4.37,bv: 1.45},
    {pos:{ra:2.652631,dec:-0.006487},mag: 4.49,bv:-0.04},
    {pos:{ra:2.654522,dec: 0.208867},mag: 1.35,bv:-0.11},
    {pos:{ra:2.656995,dec:-0.904274},mag: 4.86,bv:-0.12},
    {pos:{ra:2.662056,dec:-0.223683},mag: 5.31,bv: 0.36},
    {pos:{ra:2.664194,dec:-0.215621},mag: 3.61,bv: 1.01},
    {pos:{ra:2.655998,dec:-1.148693},mag: 5.28,bv: 0.98},
    {pos:{ra:2.676375,dec:-0.894190},mag: 5.28,bv: 0.25},
    {pos:{ra:2.682295,dec:-0.735167},mag: 3.85,bv: 0.05},
    {pos:{ra:2.688854,dec: 0.511566},mag: 5.35,bv: 0.01},
    {pos:{ra:2.676942,dec:-1.158428},mag: 5.16,bv: 0.21},
    {pos:{ra:2.690818,dec: 0.408708},mag: 3.44,bv: 0.31},
    {pos:{ra:2.692592,dec: 0.748998},mag: 3.45,bv: 0.03},
    {pos:{ra:2.690767,dec: 0.239605},mag: 5.41,bv: 1.61},
    {pos:{ra:2.677931,dec:-1.222395},mag: 3.32,bv:-0.08},
    {pos:{ra:2.694919,dec:-0.140829},mag: 5.24,bv: 0.31},
    {pos:{ra:2.697086,dec:-0.506005},mag: 5.34,bv: 0.24},
    {pos:{ra:2.692534,dec:-1.070449},mag: 3.40,bv: 1.54},
    {pos:{ra:2.704104,dec: 0.339830},mag: 4.79,bv: 0.45},
    {pos:{ra:2.705137,dec: 0.346302},mag: 2.61,bv: 1.15},
    {pos:{ra:2.705158,dec: 0.346283},mag: 3.80,bv: 0.00},
    {pos:{ra:2.747548,dec: 1.470479},mag: 5.50,bv: 0.00},
    {pos:{ra:2.703573,dec:-0.960445},mag: 4.57,bv: 1.62},
    {pos:{ra:2.715420,dec: 0.724302},mag: 3.05,bv: 1.59},
    {pos:{ra:2.723288,dec: 1.144349},mag: 4.97,bv:-0.06},
    {pos:{ra:2.709245,dec:-0.978136},mag: 4.50,bv:-0.12},
    {pos:{ra:2.715412,dec:-0.726930},mag: 4.83,bv: 1.12},
    {pos:{ra:2.723339,dec: 0.588501},mag: 5.50,bv: 1.18},
    {pos:{ra:2.753591,dec: 1.440920},mag: 5.26,bv: 0.37},
    {pos:{ra:2.720481,dec:-0.663400},mag: 5.33,bv: 0.25},
    {pos:{ra:2.718212,dec:-1.167654},mag: 4.99,bv:-0.13},
    {pos:{ra:2.731069,dec: 0.589853},mag: 4.74,bv: 0.25},
    {pos:{ra:2.731833,dec:-0.293850},mag: 3.81,bv: 1.48},
    {pos:{ra:2.739658,dec: 0.640662},mag: 4.21,bv: 0.90},
    {pos:{ra:2.724437,dec:-1.292096},mag: 4.00,bv: 0.35},
    {pos:{ra:2.736465,dec:-0.542235},mag: 4.25,bv: 1.45},
    {pos:{ra:2.737578,dec:-1.005988},mag: 4.66,bv: 0.51},
    {pos:{ra:2.751628,dec: 0.977045},mag: 4.84,bv: 0.52},
    {pos:{ra:2.739636,dec:-1.025197},mag: 3.82,bv: 0.31},
    {pos:{ra:2.746617,dec:-0.047807},mag: 5.21,bv:-0.06},
    {pos:{ra:2.750166,dec:-0.011117},mag: 5.09,bv:-0.14},
    {pos:{ra:2.743992,dec:-1.120017},mag: 5.29,bv: 1.86},
    {pos:{ra:2.771110,dec: 1.321442},mag: 4.84,bv: 0.96},
    {pos:{ra:2.758478,dec: 0.246741},mag: 5.46,bv: 1.68},
    {pos:{ra:2.762994,dec: 0.705559},mag: 4.75,bv: 0.23},
    {pos:{ra:2.761162,dec: 0.162432},mag: 3.85,bv:-0.14},
    {pos:{ra:2.754842,dec:-0.937513},mag: 4.89,bv: 0.50},
    {pos:{ra:2.750355,dec:-1.256516},mag: 4.74,bv: 0.04},
    {pos:{ra:2.757722,dec:-1.076611},mag: 3.32,bv:-0.09},
    {pos:{ra:2.771416,dec: 0.996282},mag: 5.16,bv: 0.34},
    {pos:{ra:2.753402,dec:-1.277959},mag: 4.93,bv: 1.68},
    {pos:{ra:2.761758,dec:-0.820363},mag: 5.02,bv: 1.04},
    {pos:{ra:2.766412,dec:-0.414433},mag: 5.08,bv: 1.60},
    {pos:{ra:2.769838,dec: 0.121363},mag: 5.08,bv: 0.94},
    {pos:{ra:2.771648,dec:-0.690501},mag: 5.38,bv: 2.88},
    {pos:{ra:2.773277,dec:-1.004573},mag: 4.45,bv: 1.62},
    {pos:{ra:2.780433,dec:-0.478438},mag: 4.89,bv: 1.62},
    {pos:{ra:2.781851,dec:-0.233603},mag: 4.82,bv: 2.68},
    {pos:{ra:2.776550,dec:-1.039600},mag: 5.08,bv: 1.18},
    {pos:{ra:2.786942,dec: 0.558088},mag: 4.71,bv: 0.81},
    {pos:{ra:2.780753,dec:-0.841700},mag: 3.84,bv: 0.30},
    {pos:{ra:2.781386,dec:-1.025090},mag: 5.45,bv: 0.50},
    {pos:{ra:2.786345,dec:-0.294553},mag: 4.91,bv: 0.92},
    {pos:{ra:2.772754,dec:-1.371965},mag: 4.11,bv: 1.58},
    {pos:{ra:2.787080,dec:-1.032939},mag: 4.66,bv: 1.48},
    {pos:{ra:2.801006,dec: 1.146967},mag: 5.12,bv: 1.20},
    {pos:{ra:2.789502,dec:-0.970461},mag: 4.28,bv: 1.04},
    {pos:{ra:2.805915,dec: 1.205606},mag: 5.00,bv: 1.38},
    {pos:{ra:2.808009,dec: 0.806410},mag: 5.18,bv: 0.33},
    {pos:{ra:2.807435,dec: 0.404713},mag: 5.08,bv: 0.04},
    {pos:{ra:2.802272,dec:-1.125151},mag: 4.82,bv:-0.14},
    {pos:{ra:2.804206,dec:-1.033511},mag: 5.38,bv: 0.26},
    {pos:{ra:2.805428,dec:-1.123895},mag: 2.76,bv:-0.22},
    {pos:{ra:2.807951,dec:-1.057088},mag: 4.57,bv: 1.71},
    {pos:{ra:2.818118,dec: 0.535506},mag: 5.24,bv:-0.06},
    {pos:{ra:2.810482,dec:-1.116332},mag: 4.82,bv:-0.13},
    {pos:{ra:2.820488,dec: 0.329717},mag: 5.49,bv: 1.12},
    {pos:{ra:2.820547,dec: 0.247745},mag: 5.48,bv: 0.91},
    {pos:{ra:2.822488,dec:-0.301884},mag: 5.42,bv: 0.11},
    {pos:{ra:2.822067,dec:-0.862542},mag: 2.69,bv: 0.90},
    {pos:{ra:2.819907,dec:-1.125999},mag: 5.34,bv:-0.10},
    {pos:{ra:2.820867,dec:-1.121607},mag: 5.23,bv:-0.07},
    {pos:{ra:2.822888,dec:-0.990600},mag: 5.23,bv:-0.08},
    {pos:{ra:2.822430,dec:-1.123701},mag: 4.85,bv:-0.15},
    {pos:{ra:2.832917,dec: 0.184050},mag: 5.34,bv: 0.03},
    {pos:{ra:2.815485,dec:-1.404462},mag: 5.47,bv: 0.95},
    {pos:{ra:2.834524,dec:-0.282632},mag: 3.11,bv: 1.25},
    {pos:{ra:2.817747,dec:-1.405693},mag: 4.45,bv:-0.19},
    {pos:{ra:2.851759,dec: 0.952688},mag: 5.10,bv: 1.36},
    {pos:{ra:2.850610,dec: 0.597164},mag: 3.83,bv: 1.04},
    {pos:{ra:2.853519,dec: 0.753808},mag: 4.71,bv:-0.05},
    {pos:{ra:2.847134,dec:-0.999036},mag: 5.25,bv: 0.16},
    {pos:{ra:2.851395,dec:-0.351490},mag: 5.24,bv: 0.47},
    {pos:{ra:2.852428,dec:-0.037161},mag: 5.45,bv: 0.96},
    {pos:{ra:2.851403,dec:-1.027184},mag: 3.78,bv: 0.95},
    {pos:{ra:2.861206,dec: 0.584807},mag: 5.03,bv: 1.10},
    {pos:{ra:2.860653,dec: 0.431964},mag: 4.50,bv: 0.01},
    {pos:{ra:2.865474,dec:-0.648176},mag: 4.60,bv: 1.03},
    {pos:{ra:2.877466,dec: 0.705641},mag: 5.05,bv: 0.61},
    {pos:{ra:2.880862,dec: 0.794581},mag: 5.47,bv: 1.47},
    {pos:{ra:2.878812,dec:-0.319376},mag: 4.08,bv: 1.09},
    {pos:{ra:2.883458,dec: 0.684382},mag: 5.08,bv: 0.24},
    {pos:{ra:2.882237,dec: 0.063137},mag: 4.84,bv: 1.16},
    {pos:{ra:2.880470,dec:-0.736980},mag: 4.39,bv: 0.11},
    {pos:{ra:2.883051,dec: 0.106489},mag: 4.99,bv: 0.16},
    {pos:{ra:2.887829,dec: 0.984060},mag: 2.37,bv:-0.02},
    {pos:{ra:2.887771,dec:-0.043367},mag: 4.74,bv: 1.62},
    {pos:{ra:2.889960,dec: 0.352203},mag: 4.42,bv: 0.05},
    {pos:{ra:2.896061,dec: 1.077755},mag: 1.79,bv: 1.07},
    {pos:{ra:2.893967,dec:-0.197285},mag: 5.50,bv: 0.94},
    {pos:{ra:2.901683,dec: 0.128039},mag: 4.63,bv: 0.33},
    {pos:{ra:2.901188,dec:-0.624910},mag: 5.43,bv: 0.03},
    {pos:{ra:2.903057,dec:-0.476363},mag: 4.94,bv: 0.36},
    {pos:{ra:2.908329,dec:-1.089507},mag: 4.61,bv: 1.03},
    {pos:{ra:2.911544,dec:-0.744184},mag: 5.15,bv: 0.03},
    {pos:{ra:2.917892,dec:-0.490098},mag: 5.44,bv: 0.07},
    {pos:{ra:2.921957,dec: 0.776647},mag: 3.01,bv: 1.14},
    {pos:{ra:2.917274,dec:-1.029308},mag: 3.91,bv: 1.23},
    {pos:{ra:2.917172,dec:-1.081183},mag: 5.13,bv: 0.22},
    {pos:{ra:2.930662,dec:-0.398386},mag: 4.48,bv: 0.03},
    {pos:{ra:2.934560,dec:-0.856976},mag: 5.36,bv: 0.18},
    {pos:{ra:2.934771,dec:-1.052739},mag: 4.60,bv: 0.55},
    {pos:{ra:2.935440,dec:-1.119973},mag: 5.23,bv:-0.06},
    {pos:{ra:2.939833,dec:-0.001217},mag: 5.42,bv:-0.03},
    {pos:{ra:2.941352,dec: 0.358205},mag: 2.56,bv: 0.12},
    {pos:{ra:2.941927,dec: 0.269295},mag: 3.34,bv:-0.01},
    {pos:{ra:2.946130,dec: 0.403093},mag: 4.63,bv: 1.66},
    {pos:{ra:2.949017,dec: 0.232260},mag: 5.32,bv: 1.20},
    {pos:{ra:2.952493,dec:-0.063734},mag: 4.47,bv: 0.21},
    {pos:{ra:2.955235,dec: 0.035091},mag: 5.18,bv: 1.52},
    {pos:{ra:2.959126,dec: 0.550288},mag: 4.87,bv: 0.00},
    {pos:{ra:2.959133,dec: 0.550288},mag: 4.41,bv: 0.59},
    {pos:{ra:2.960420,dec: 0.577602},mag: 3.48,bv: 1.40},
    {pos:{ra:2.963271,dec: 0.666464},mag: 4.78,bv: 0.12},
    {pos:{ra:2.964187,dec:-0.257935},mag: 3.56,bv: 1.12},
    {pos:{ra:2.972019,dec: 0.105234},mag: 4.05,bv:-0.06},
    {pos:{ra:2.971452,dec:-0.951049},mag: 3.89,bv:-0.15},
    {pos:{ra:2.979393,dec: 0.758918},mag: 4.99,bv: 0.99},
    {pos:{ra:2.981742,dec:-0.327773},mag: 5.09,bv: 0.42},
    {pos:{ra:2.981073,dec:-0.631193},mag: 5.00,bv: 1.46},
    {pos:{ra:2.984186,dec: 0.183769},mag: 3.94,bv: 0.41},
    {pos:{ra:2.984680,dec: 0.024570},mag: 5.39,bv: 0.94},
    {pos:{ra:2.981735,dec:-1.133679},mag: 5.11,bv:-0.08},
    {pos:{ra:2.987175,dec:-0.189533},mag: 4.83,bv: 1.56},
    {pos:{ra:2.988360,dec:-0.308642},mag: 4.08,bv: 0.21},
    {pos:{ra:2.991014,dec:-0.629419},mag: 5.22,bv: 0.99},
    {pos:{ra:2.992018,dec:-1.116536},mag: 5.17,bv: 0.50},
    {pos:{ra:2.995807,dec:-1.066663},mag: 5.30,bv:-0.08},
    {pos:{ra:3.001690,dec: 0.049849},mag: 4.95,bv: 1.00},
    {pos:{ra:3.006635,dec: 0.686559},mag: 5.31,bv: 0.01},
    {pos:{ra:3.004519,dec:-0.744805},mag: 5.08,bv:-0.03},
    {pos:{ra:3.012067,dec:-0.052423},mag: 4.77,bv: 1.54},
    {pos:{ra:3.016816,dec: 1.210056},mag: 3.84,bv: 1.62},
    {pos:{ra:3.020932,dec: 1.066091},mag: 5.48,bv: 0.50},
    {pos:{ra:3.018409,dec:-1.037462},mag: 5.13,bv: 1.08},
    {pos:{ra:3.018605,dec:-1.038747},mag: 5.15,bv: 0.49},
    {pos:{ra:3.023354,dec:-0.542574},mag: 5.04,bv: 1.58},
    {pos:{ra:3.023790,dec:-0.556023},mag: 3.54,bv: 0.94},
    {pos:{ra:3.026495,dec:-0.708376},mag: 5.39,bv: 0.12},
    {pos:{ra:3.031470,dec:-0.947088},mag: 4.62,bv:-0.08},
    {pos:{ra:3.037076,dec: 1.209911},mag: 5.20,bv: 1.01},
    {pos:{ra:3.032277,dec:-0.857597},mag: 5.50,bv: 1.04},
    {pos:{ra:3.036553,dec:-0.831504},mag: 5.25,bv: 0.25},
    {pos:{ra:3.035913,dec:-1.099902},mag: 3.13,bv:-0.04},
    {pos:{ra:3.039847,dec:-0.171081},mag: 4.70,bv:-0.08},
    {pos:{ra:3.041011,dec:-0.014380},mag: 4.30,bv: 1.00},
    {pos:{ra:3.041280,dec:-1.069596},mag: 5.15,bv: 1.12},
    {pos:{ra:3.043701,dec:-0.833346},mag: 5.44,bv: 1.24},
    {pos:{ra:3.047607,dec: 0.141968},mag: 5.36,bv: 1.57},
    {pos:{ra:3.046130,dec:-1.079074},mag: 5.15,bv:-0.02},
    {pos:{ra:3.048516,dec:-0.230417},mag: 5.48,bv: 0.52},
    {pos:{ra:3.052101,dec:-1.141407},mag: 5.17,bv: 0.80},
    {pos:{ra:3.055257,dec:-0.606410},mag: 4.70,bv:-0.07},
    {pos:{ra:3.057751,dec: 0.372676},mag: 5.26,bv: 0.98},
    {pos:{ra:3.058908,dec: 0.596932},mag: 5.33,bv: 0.72},
    {pos:{ra:3.058224,dec:-1.083675},mag: 4.94,bv: 1.15},
    {pos:{ra:3.061889,dec:-0.567227},mag: 5.22,bv: 1.48},
    {pos:{ra:3.065118,dec: 1.164920},mag: 5.30,bv: 1.28},
    {pos:{ra:3.069685,dec:-1.090647},mag: 5.03,bv: 0.80},
    {pos:{ra:3.075110,dec:-0.320282},mag: 4.73,bv: 0.97},
    {pos:{ra:3.077386,dec: 0.144135},mag: 4.85,bv: 0.18},
    {pos:{ra:3.079895,dec: 0.113960},mag: 4.03,bv: 1.51},
    {pos:{ra:3.080724,dec: 0.833909},mag: 3.71,bv: 1.18},
    {pos:{ra:3.079335,dec:-0.797441},mag: 5.29,bv:-0.12},
    {pos:{ra:3.078790,dec:-1.164634},mag: 3.64,bv: 0.16},
    {pos:{ra:3.084549,dec: 0.970898},mag: 5.27,bv: 1.27},
    {pos:{ra:3.082746,dec:-1.067763},mag: 4.11,bv: 0.90},
    {pos:{ra:3.082768,dec:-0.706868},mag: 4.91,bv: 0.66},
    {pos:{ra:3.086258,dec:-1.006992},mag: 5.41,bv: 1.67},
    {pos:{ra:3.089167,dec: 0.352886},mag: 4.53,bv: 0.55},
    {pos:{ra:3.088862,dec: 0.143917},mag: 5.32,bv: 0.02},
    {pos:{ra:3.090273,dec:-1.166137},mag: 4.72,bv: 1.54},
    {pos:{ra:3.092513,dec:-0.466871},mag: 5.11,bv: 1.60},
    {pos:{ra:3.093858,dec: 0.254328},mag: 2.14,bv: 0.09},
    {pos:{ra:3.096585,dec:-1.113316},mag: 4.32,bv:-0.15},
    {pos:{ra:3.097712,dec:-1.225672},mag: 4.97,bv: 1.40},
    {pos:{ra:3.100992,dec: 0.030800},mag: 3.61,bv: 0.55},
    {pos:{ra:3.102955,dec:-0.788428},mag: 4.46,bv: 1.30},
    {pos:{ra:3.106046,dec:-1.138061},mag: 4.90,bv:-0.11},
    {pos:{ra:3.110657,dec:-0.591807},mag: 4.28,bv:-0.10},
    {pos:{ra:3.114671,dec: 0.937150},mag: 2.44,bv: 0.00},
    {pos:{ra:3.118503,dec:-0.448792},mag: 5.30,bv: 0.88},
    {pos:{ra:3.124205,dec:-0.299339},mag: 5.18,bv:-0.02},
    {pos:{ra:3.133971,dec:-0.982921},mag: 5.44,bv:-0.08},
    {pos:{ra:3.139942,dec:-1.365230},mag: 4.91,bv:-0.06},
    {pos:{ra:3.141367,dec: 0.063797},mag: 5.37,bv: 0.00},
    {pos:{ra:3.145403,dec: 0.115439},mag: 4.66,bv: 0.13},
    {pos:{ra:3.145316,dec:-0.343112},mag: 5.26,bv:-0.20},
    {pos:{ra:3.150814,dec: 0.751287},mag: 5.21,bv: 0.26},
    {pos:{ra:3.154792,dec:-1.105016},mag: 4.33,bv: 0.27},
    {pos:{ra:3.157562,dec:-0.740616},mag: 5.15,bv: 0.41},
    {pos:{ra:3.160442,dec:-1.102447},mag: 4.72,bv:-0.08},
    {pos:{ra:3.161860,dec:-1.192569},mag: 5.35,bv:-0.01},
    {pos:{ra:3.162427,dec:-1.335511},mag: 5.04,bv: 1.49},
    {pos:{ra:3.164318,dec: 0.152421},mag: 4.12,bv: 0.98},
    {pos:{ra:3.171620,dec:-1.127720},mag: 4.15,bv: 0.34},
    {pos:{ra:3.175757,dec:-1.315401},mag: 5.18,bv: 1.30},
    {pos:{ra:3.176877,dec:-0.884208},mag: 4.47,bv:-0.15},
    {pos:{ra:3.177568,dec:-0.849849},mag: 5.34,bv:-0.01},
    {pos:{ra:3.178063,dec:-0.885275},mag: 2.60,bv:-0.12},
    {pos:{ra:3.178303,dec:-0.431601},mag: 4.02,bv: 0.32},
    {pos:{ra:3.180463,dec:-0.719624},mag: 5.48,bv:-0.07},
    {pos:{ra:3.185771,dec:-0.394789},mag: 3.00,bv: 1.33},
    {pos:{ra:3.189873,dec:-0.411941},mag: 5.46,bv: 0.06},
    {pos:{ra:3.192433,dec:-0.914005},mag: 3.96,bv:-0.15},
    {pos:{ra:3.194818,dec: 1.354662},mag: 5.14,bv: 0.33},
    {pos:{ra:3.202868,dec:-0.798032},mag: 5.31,bv: 1.43},
    {pos:{ra:3.207675,dec:-1.025362},mag: 2.80,bv:-0.23},
    {pos:{ra:3.208904,dec: 0.995405},mag: 3.31,bv: 0.08},
    {pos:{ra:3.210562,dec:-0.306165},mag: 2.59,bv:-0.11},
    {pos:{ra:3.211420,dec: 0.260035},mag: 5.10,bv: 0.06},
    {pos:{ra:3.212897,dec: 0.417924},mag: 4.95,bv: 0.97},
    {pos:{ra:3.213595,dec: 0.577030},mag: 5.00,bv: 1.14},
    {pos:{ra:3.218249,dec:-1.186140},mag: 4.11,bv: 1.58},
    {pos:{ra:3.221638,dec:-1.384259},mag: 4.26,bv:-0.12},
    {pos:{ra:3.222030,dec:-1.117064},mag: 4.04,bv:-0.17},
    {pos:{ra:3.224474,dec:-0.962428},mag: 5.00,bv: 1.59},
    {pos:{ra:3.223761,dec: 1.311799},mag: 5.38,bv:-0.02},
    {pos:{ra:3.228452,dec:-0.011640},mag: 3.89,bv: 0.02},
    {pos:{ra:3.228037,dec: 0.854935},mag: 5.29,bv: 1.66},
    {pos:{ra:3.230386,dec: 0.057814},mag: 4.96,bv: 1.16},
    {pos:{ra:3.231310,dec:-0.387739},mag: 5.21,bv:-0.10},
    {pos:{ra:3.231986,dec: 0.310543},mag: 4.74,bv: 1.01},
    {pos:{ra:3.232910,dec:-0.236764},mag: 5.14,bv: 1.05},
    {pos:{ra:3.234793,dec:-1.054198},mag: 3.59,bv: 1.42},
    {pos:{ra:3.238117,dec:-1.178480},mag: 5.15,bv: 0.19},
    {pos:{ra:3.241171,dec:-1.006638},mag: 5.39,bv:-0.10},
    {pos:{ra:3.239789,dec: 0.451100},mag: 4.81,bv: 0.49},
    {pos:{ra:3.244524,dec:-0.618070},mag: 5.32,bv:-0.08},
    {pos:{ra:3.246422,dec: 0.899931},mag: 4.80,bv: 0.87},
    {pos:{ra:3.247658,dec: 0.455507},mag: 5.18,bv: 0.08},
    {pos:{ra:3.254377,dec: 0.681003},mag: 5.02,bv: 0.96},
    {pos:{ra:3.257286,dec:-1.101695},mag: 4.86,bv:-0.12},
    {pos:{ra:3.257650,dec:-1.101288},mag: 1.33,bv:-0.24},
    {pos:{ra:3.257693,dec:-1.101293},mag: 1.73,bv:-0.26},
    {pos:{ra:3.257337,dec:-0.897986},mag: 4.82,bv:-0.14},
    {pos:{ra:3.256792,dec: 0.475922},mag: 4.95,bv: 0.27},
    {pos:{ra:3.259133,dec: 0.493375},mag: 4.36,bv: 1.13},
    {pos:{ra:3.259351,dec: 0.468194},mag: 5.00,bv: 0.08},
    {pos:{ra:3.261489,dec:-1.029604},mag: 5.50,bv: 1.45},
    {pos:{ra:3.263940,dec:-0.876689},mag: 3.91,bv:-0.19},
    {pos:{ra:3.265402,dec:-0.681401},mag: 5.44,bv:-0.08},
    {pos:{ra:3.267744,dec: 0.452263},mag: 5.29,bv:-0.05},
    {pos:{ra:3.270085,dec: 0.420779},mag: 5.48,bv: 0.43},
    {pos:{ra:3.271903,dec:-0.288251},mag: 2.95,bv:-0.05},
    {pos:{ra:3.272296,dec: 1.019374},mag: 5.35,bv: 0.20},
    {pos:{ra:3.277576,dec:-0.996816},mag: 1.63,bv: 1.59},
    {pos:{ra:3.272979,dec: 1.207787},mag: 4.95,bv: 1.62},
    {pos:{ra:3.276899,dec: 0.428779},mag: 5.46,bv: 0.05},
    {pos:{ra:3.279786,dec:-1.037143},mag: 5.48,bv: 0.63},
    {pos:{ra:3.283255,dec:-1.258959},mag: 3.87,bv:-0.15},
    {pos:{ra:3.281524,dec:-0.282675},mag: 4.31,bv: 0.38},
    {pos:{ra:3.288986,dec:-0.164968},mag: 5.48,bv:-0.03},
    {pos:{ra:3.288411,dec: 0.580278},mag: 5.42,bv: 1.00},
    {pos:{ra:3.288818,dec: 0.721825},mag: 4.26,bv: 0.59},
    {pos:{ra:3.291633,dec:-0.408349},mag: 2.65,bv: 0.89},
    {pos:{ra:3.287691,dec: 1.218036},mag: 3.87,bv:-0.13},
    {pos:{ra:3.293662,dec: 0.394953},mag: 4.81,bv: 0.00},
    {pos:{ra:3.294876,dec: 0.320738},mag: 5.02,bv: 1.15},
    {pos:{ra:3.297618,dec:-0.715968},mag: 5.13,bv: 0.22},
    {pos:{ra:3.293145,dec: 1.222113},mag: 4.94,bv: 1.31},
    {pos:{ra:3.303836,dec:-1.206643},mag: 2.69,bv:-0.20},
    {pos:{ra:3.300367,dec: 1.038243},mag: 5.50,bv: 0.00},
    {pos:{ra:3.306104,dec:-0.847202},mag: 3.86,bv: 0.05},
    {pos:{ra:3.306104,dec:-0.473663},mag: 5.45,bv: 0.32},
    {pos:{ra:3.312839,dec:-0.139549},mag: 4.66,bv: 1.23},
    {pos:{ra:3.312293,dec: 0.367610},mag: 5.46,bv: 0.96},
    {pos:{ra:3.315580,dec:-0.697914},mag: 4.64,bv:-0.08},
    {pos:{ra:3.322743,dec:-0.854508},mag: 2.17,bv:-0.01},
    {pos:{ra:3.324605,dec:-1.041714},mag: 4.93,bv:-0.04},
    {pos:{ra:3.323369,dec:-0.025298},mag: 3.65,bv: 0.36},
    {pos:{ra:3.323369,dec:-0.025298},mag: 3.68,bv: 0.00},
    {pos:{ra:3.324350,dec: 0.178644},mag: 4.88,bv: 0.09},
    {pos:{ra:3.328510,dec:-1.100580},mag: 5.31,bv: 0.27},
    {pos:{ra:3.327427,dec:-0.851949},mag: 4.66,bv: 1.09},
    {pos:{ra:3.333615,dec:-0.494345},mag: 5.48,bv: 1.34},
    {pos:{ra:3.340698,dec:-1.064321},mag: 4.69,bv: 1.05},
    {pos:{ra:3.343534,dec:-1.188710},mag: 3.05,bv:-0.18},
    {pos:{ra:3.338509,dec: 0.793082},mag: 4.99,bv: 2.54},
    {pos:{ra:3.340640,dec: 0.133925},mag: 5.22,bv: 0.33},
    {pos:{ra:3.343956,dec:-0.985917},mag: 4.65,bv:-0.16},
    {pos:{ra:3.345120,dec: 0.289332},mag: 5.12,bv: 1.35},
    {pos:{ra:3.349810,dec:-1.041763},mag: 1.25,bv:-0.23},
    {pos:{ra:3.349170,dec: 1.165710},mag: 5.43,bv: 1.56},
    {pos:{ra:3.381474,dec:-1.485682},mag: 5.46,bv: 1.02},
    {pos:{ra:3.362755,dec:-0.593402},mag: 4.91,bv:-0.04},
    {pos:{ra:3.367169,dec: 0.480673},mag: 4.94,bv: 0.67},
    {pos:{ra:3.373351,dec:-0.854222},mag: 4.33,bv: 1.37},
    {pos:{ra:3.374754,dec:-0.701254},mag: 4.27,bv: 0.21},
    {pos:{ra:3.356385,dec: 1.455828},mag: 5.28,bv:-0.03},
    {pos:{ra:3.374143,dec: 0.370795},mag: 4.90,bv: 0.90},
    {pos:{ra:3.380063,dec:-1.032304},mag: 4.62,bv:-0.15},
    {pos:{ra:3.379801,dec:-0.997940},mag: 4.03,bv:-0.17},
    {pos:{ra:3.379888,dec:-0.997776},mag: 5.17,bv:-0.12},
    {pos:{ra:3.378754,dec:-0.166485},mag: 4.79,bv: 1.60},
    {pos:{ra:3.377336,dec: 0.976681},mag: 1.77,bv:-0.02},
    {pos:{ra:3.382986,dec:-0.749023},mag: 5.47,bv: 1.68},
    {pos:{ra:3.385720,dec:-0.991977},mag: 5.32,bv: 0.01},
    {pos:{ra:3.384208,dec: 0.059298},mag: 3.38,bv: 1.58},
    {pos:{ra:3.390622,dec:-0.893584},mag: 5.16,bv:-0.06},
    {pos:{ra:3.386062,dec: 0.668781},mag: 2.90,bv:-0.12},
    {pos:{ra:3.383648,dec: 1.142119},mag: 5.24,bv: 0.28},
    {pos:{ra:3.398694,dec: 0.303852},mag: 4.78,bv: 1.56},
    {pos:{ra:3.413297,dec:-1.248764},mag: 3.62,bv: 1.18},
    {pos:{ra:3.404592,dec: 0.537300},mag: 4.90,bv: 1.17},
    {pos:{ra:3.403036,dec: 1.162341},mag: 5.32,bv: 1.29},
    {pos:{ra:3.406577,dec: 0.983779},mag: 4.93,bv: 0.36},
    {pos:{ra:3.412889,dec: 0.191274},mag: 2.83,bv: 0.94},
    {pos:{ra:3.418896,dec:-0.864413},mag: 4.85,bv: 0.02},
    {pos:{ra:3.430786,dec:-0.845850},mag: 4.71,bv:-0.14},
    {pos:{ra:3.433542,dec:-0.871026},mag: 4.27,bv:-0.19},
    {pos:{ra:3.428445,dec: 0.624808},mag: 5.25,bv:-0.08},
    {pos:{ra:3.434713,dec: 0.482142},mag: 4.80,bv: 1.48},
    {pos:{ra:3.437848,dec:-0.187453},mag: 5.19,bv: 1.14},
    {pos:{ra:3.442902,dec:-0.403486},mag: 4.95,bv: 1.05},
    {pos:{ra:3.446807,dec:-0.096672},mag: 4.38,bv:-0.01},
    {pos:{ra:3.446974,dec: 0.305947},mag: 5.22,bv: 0.45},
    {pos:{ra:3.446974,dec: 0.305947},mag: 5.22,bv: 0.00},
    {pos:{ra:3.453076,dec:-0.756930},mag: 5.25,bv: 1.05},
    {pos:{ra:3.457017,dec:-1.045816},mag: 4.60,bv:-0.08},
    {pos:{ra:3.455985,dec:-0.659788},mag: 4.85,bv: 0.70},
    {pos:{ra:3.456007,dec:-0.282719},mag: 5.04,bv: 0.46},
    {pos:{ra:3.455199,dec: 0.486564},mag: 4.26,bv: 0.57},
    {pos:{ra:3.465555,dec:-1.031548},mag: 4.92,bv: 0.48},
    {pos:{ra:3.469925,dec:-1.184982},mag: 4.80,bv:-0.08},
    {pos:{ra:3.465271,dec:-0.347859},mag: 5.33,bv: 0.87},
    {pos:{ra:3.463242,dec: 0.700798},mag: 4.92,bv: 1.06},
    {pos:{ra:3.473118,dec:-0.348072},mag: 5.22,bv: 1.03},
    {pos:{ra:3.478514,dec:-1.165594},mag: 4.87,bv: 1.50},
    {pos:{ra:3.477067,dec:-0.549885},mag: 5.10,bv: 0.96},
    {pos:{ra:3.476587,dec: 0.164483},mag: 5.22,bv: 0.59},
    {pos:{ra:3.478703,dec: 0.238683},mag: 5.33,bv: 1.31},
    {pos:{ra:3.480208,dec: 0.095465},mag: 4.80,bv: 1.67},
    {pos:{ra:3.479932,dec: 0.708124},mag: 4.73,bv: 0.30},
    {pos:{ra:3.483699,dec:-0.319594},mag: 4.74,bv: 0.71},
    {pos:{ra:3.485953,dec:-0.404422},mag: 3.00,bv: 0.92},
    {pos:{ra:3.482986,dec: 0.867114},mag: 5.15,bv:-0.07},
    {pos:{ra:3.493407,dec:-0.920627},mag: 5.48,bv:-0.13},
    {pos:{ra:3.493262,dec:-0.640749},mag: 2.75,bv: 0.04},
    {pos:{ra:3.502141,dec:-1.064447},mag: 4.53,bv:-0.13},
    {pos:{ra:3.508148,dec:-1.126363},mag: 4.53,bv: 0.85},
    {pos:{ra:3.512991,dec:-1.307038},mag: 5.05,bv: 1.11},
    {pos:{ra:3.503829,dec:-0.309539},mag: 5.37,bv: 0.99},
    {pos:{ra:3.513486,dec:-1.125480},mag: 5.31,bv: 0.40},
    {pos:{ra:3.507785,dec: 0.958627},mag: 2.27,bv: 0.02},
    {pos:{ra:3.507850,dec: 0.958564},mag: 3.95,bv: 0.13},
    {pos:{ra:3.513319,dec:-0.194803},mag: 0.98,bv:-0.23},
    {pos:{ra:3.517406,dec:-0.693860},mag: 5.09,bv: 1.20},
    {pos:{ra:3.513457,dec: 0.959723},mag: 4.01,bv: 0.16},
    {pos:{ra:3.519980,dec:-0.221793},mag: 5.25,bv: 1.52},
    {pos:{ra:3.523180,dec:-0.278792},mag: 4.76,bv: 1.09},
    {pos:{ra:3.531761,dec:-0.893003},mag: 5.06,bv: 0.07},
    {pos:{ra:3.527441,dec: 0.240487},mag: 4.98,bv: 0.71},
    {pos:{ra:3.533041,dec:-0.406337},mag: 4.97,bv: 1.60},
    {pos:{ra:3.527536,dec: 1.046252},mag: 5.40,bv:-0.01},
    {pos:{ra:3.538851,dec:-0.687791},mag: 3.88,bv: 1.17},
    {pos:{ra:3.542866,dec:-0.109185},mag: 4.69,bv: 1.62},
    {pos:{ra:3.547244,dec:-0.177413},mag: 5.21,bv: 0.96},
    {pos:{ra:3.552320,dec: 0.063860},mag: 4.94,bv: 0.03},
    {pos:{ra:3.554770,dec:-0.010399},mag: 3.37,bv: 0.11},
    {pos:{ra:3.555221,dec: 0.648957},mag: 4.98,bv: 0.40},
    {pos:{ra:3.553730,dec: 0.855493},mag: 4.70,bv: 0.12},
    {pos:{ra:3.566842,dec: 0.633467},mag: 4.82,bv: 0.23},
    {pos:{ra:3.577430,dec:-0.933165},mag: 2.30,bv:-0.22},
    {pos:{ra:3.565635,dec: 1.243411},mag: 5.50,bv: 1.20},
    {pos:{ra:3.586732,dec:-1.026031},mag: 5.38,bv:-0.03},
    {pos:{ra:3.585539,dec:-0.952252},mag: 5.01,bv:-0.05},
    {pos:{ra:3.575772,dec: 0.923652},mag: 5.46,bv: 0.10},
    {pos:{ra:3.584965,dec:-0.151897},mag: 5.01,bv: 1.63},
    {pos:{ra:3.581146,dec: 0.954375},mag: 4.66,bv: 1.64},
    {pos:{ra:3.591284,dec: 0.061751},mag: 5.36,bv: 1.11},
    {pos:{ra:3.602738,dec:-0.576725},mag: 4.23,bv: 0.38},
    {pos:{ra:3.606963,dec:-0.897671},mag: 4.65,bv: 0.96},
    {pos:{ra:3.608207,dec:-0.632716},mag: 5.15,bv:-0.02},
    {pos:{ra:3.611261,dec:-0.878269},mag: 5.45,bv: 1.36},
    {pos:{ra:3.610315,dec:-0.311716},mag: 5.43,bv: 1.62},
    {pos:{ra:3.609610,dec: 0.304676},mag: 4.50,bv: 0.48},
    {pos:{ra:3.608454,dec: 0.672698},mag: 5.50,bv: 1.03},
    {pos:{ra:3.619398,dec:-0.727589},mag: 3.41,bv:-0.22},
    {pos:{ra:3.610824,dec: 0.860680},mag: 1.86,bv:-0.19},
    {pos:{ra:3.619137,dec:-0.601280},mag: 4.19,bv: 1.50},
    {pos:{ra:3.619886,dec:-0.741309},mag: 3.04,bv:-0.17},
    {pos:{ra:3.620998,dec:-0.316501},mag: 4.97,bv: 1.06},
    {pos:{ra:3.619275,dec: 0.275723},mag: 4.07,bv: 1.52},
    {pos:{ra:3.620307,dec: 0.371130},mag: 4.91,bv: 1.43},
    {pos:{ra:3.630634,dec:-0.921737},mag: 5.25,bv:-0.09},
    {pos:{ra:3.629529,dec:-0.575862},mag: 4.56,bv:-0.13},
    {pos:{ra:3.629376,dec: 0.601164},mag: 4.74,bv: 1.66},
    {pos:{ra:3.635557,dec:-0.557245},mag: 4.73,bv:-0.14},
    {pos:{ra:3.627805,dec: 1.129635},mag: 4.65,bv: 1.58},
    {pos:{ra:3.645731,dec:-0.825337},mag: 2.55,bv:-0.22},
    {pos:{ra:3.642073,dec:-0.026233},mag: 5.15,bv: 1.08},
    {pos:{ra:3.642000,dec: 0.321102},mag: 2.68,bv: 0.58},
    {pos:{ra:3.654930,dec:-1.111542},mag: 4.71,bv: 1.11},
    {pos:{ra:3.650225,dec: 0.479825},mag: 5.01,bv: 1.42},
    {pos:{ra:3.657650,dec:-0.734798},mag: 3.83,bv:-0.21},
    {pos:{ra:3.659432,dec:-0.781971},mag: 3.87,bv:-0.20},
    {pos:{ra:3.658726,dec:-0.435847},mag: 5.15,bv:-0.10},
    {pos:{ra:3.672711,dec:-0.795933},mag: 4.34,bv: 0.60},
    {pos:{ra:3.688448,dec:-1.340355},mag: 5.50,bv: 1.55},
    {pos:{ra:3.672376,dec: 0.026956},mag: 4.26,bv: 0.10},
    {pos:{ra:3.675576,dec:-0.478744},mag: 5.48,bv: 1.34},
    {pos:{ra:3.681874,dec:-1.053709},mag: 0.61,bv:-0.23},
    {pos:{ra:3.691575,dec:-0.718722},mag: 4.36,bv:-0.19},
    {pos:{ra:3.692993,dec:-0.465697},mag: 3.27,bv: 1.12},
    {pos:{ra:3.694353,dec:-0.634776},mag: 2.06,bv: 1.01},
    {pos:{ra:3.694484,dec:-0.162548},mag: 5.46,bv: 0.34},
    {pos:{ra:3.684339,dec: 1.123570},mag: 3.65,bv:-0.05},
    {pos:{ra:3.708447,dec:-0.932689},mag: 4.75,bv: 0.94},
    {pos:{ra:3.699793,dec: 0.765404},mag: 5.27,bv: 1.59},
    {pos:{ra:3.701356,dec: 0.863206},mag: 5.25,bv: 1.65},
    {pos:{ra:3.712497,dec:-0.284523},mag: 4.91,bv: 1.72},
    {pos:{ra:3.744735,dec:-1.413852},mag: 4.91,bv: 0.25},
    {pos:{ra:3.710563,dec: 0.437932},mag: 4.83,bv: 0.54},
    {pos:{ra:3.720896,dec:-0.475796},mag: 5.08,bv: 1.16},
    {pos:{ra:3.718700,dec: 0.042053},mag: 5.01,bv:-0.12},
    {pos:{ra:3.721464,dec:-0.179308},mag: 4.19,bv: 1.33},
    {pos:{ra:3.730423,dec:-0.996336},mag: 5.07,bv:-0.08},
    {pos:{ra:3.703799,dec: 1.353459},mag: 4.82,bv: 1.36},
    {pos:{ra:3.724024,dec: 0.903911},mag: 4.54,bv: 0.20},
    {pos:{ra:3.729972,dec: 0.176288},mag: 5.29,bv: 1.00},
    {pos:{ra:3.732394,dec:-0.317664},mag: 5.43,bv:-0.03},
    {pos:{ra:3.717842,dec: 1.211826},mag: 5.24,bv: 1.58},
    {pos:{ra:3.762835,dec:-1.398164},mag: 5.06,bv:-0.10},
    {pos:{ra:3.735070,dec:-0.104729},mag: 4.08,bv: 0.52},
    {pos:{ra:3.782630,dec:-1.460278},mag: 4.32,bv: 1.31},
    {pos:{ra:3.733528,dec: 0.334798},mag:-0.04,bv: 1.23},
    {pos:{ra:3.751840,dec:-1.069417},mag: 5.23,bv: 0.29},
    {pos:{ra:3.735724,dec: 0.896527},mag: 4.75,bv: 0.20},
    {pos:{ra:3.736677,dec: 0.804393},mag: 4.18,bv: 0.08},
    {pos:{ra:3.749854,dec:-0.803860},mag: 3.55,bv:-0.18},
    {pos:{ra:3.753876,dec:-0.984133},mag: 4.33,bv: 0.12},
    {pos:{ra:3.748574,dec:-0.233370},mag: 4.52,bv: 0.13},
    {pos:{ra:3.743717,dec: 0.619757},mag: 4.81,bv: 1.06},
    {pos:{ra:3.755548,dec:-0.788666},mag: 4.77,bv: 0.31},
    {pos:{ra:3.749280,dec: 0.226966},mag: 5.41,bv: 0.38},
    {pos:{ra:3.750458,dec:-0.039541},mag: 5.14,bv: 1.02},
    {pos:{ra:3.754887,dec:-0.661223},mag: 4.05,bv:-0.03},
    {pos:{ra:3.751382,dec: 0.284610},mag: 4.86,bv: 1.23},
    {pos:{ra:3.763875,dec:-1.020310},mag: 4.92,bv: 0.86},
    {pos:{ra:3.765708,dec:-0.689618},mag: 4.42,bv:-0.18},
    {pos:{ra:3.765970,dec:-0.484397},mag: 4.77,bv: 1.31},
    {pos:{ra:3.767199,dec: 0.147422},mag: 5.12,bv:-0.02},
    {pos:{ra:3.773445,dec:-0.432953},mag: 5.32,bv: 0.96},
    {pos:{ra:3.770733,dec: 0.101578},mag: 5.10,bv: 0.12},
    {pos:{ra:3.779234,dec:-0.789262},mag: 4.56,bv:-0.15},
    {pos:{ra:3.779423,dec:-0.792021},mag: 4.35,bv: 0.43},
    {pos:{ra:3.775133,dec: 0.904968},mag: 4.05,bv: 0.50},
    {pos:{ra:3.780630,dec: 0.335573},mag: 5.39,bv: 0.23},
    {pos:{ra:3.788121,dec:-0.514727},mag: 4.97,bv:-0.07},
    {pos:{ra:3.788244,dec:-0.038887},mag: 4.81,bv: 0.70},
    {pos:{ra:3.790397,dec:-0.120437},mag: 5.42,bv: 1.49},
    {pos:{ra:3.796716,dec:-0.791012},mag: 5.50,bv:-0.08},
    {pos:{ra:3.797611,dec:-0.864272},mag: 5.37,bv: 0.05},
    {pos:{ra:3.807501,dec:-0.880640},mag: 4.42,bv:-0.19},
    {pos:{ra:3.804076,dec: 0.530081},mag: 3.58,bv: 1.30},
    {pos:{ra:3.785292,dec: 1.321146},mag: 4.25,bv: 1.44},
    {pos:{ra:3.805160,dec: 0.668607},mag: 3.03,bv: 0.19},
    {pos:{ra:3.820118,dec:-0.735792},mag: 2.31,bv:-0.19},
    {pos:{ra:3.816511,dec: 0.519148},mag: 4.46,bv: 0.36},
    {pos:{ra:3.828096,dec:-0.805188},mag: 5.41,bv: 1.01},
    {pos:{ra:3.830503,dec:-0.862644},mag: 4.05,bv:-0.15},
    {pos:{ra:3.837972,dec:-1.061776},mag:-0.01,bv: 0.71},
    {pos:{ra:3.837986,dec:-1.061781},mag: 1.33,bv: 0.88},
    {pos:{ra:3.850662,dec:-1.134032},mag: 3.19,bv: 0.24},
    {pos:{ra:3.834648,dec: 0.775004},mag: 5.39,bv: 0.00},
    {pos:{ra:3.848145,dec:-0.827082},mag: 2.30,bv:-0.20},
    {pos:{ra:3.874020,dec:-1.379591},mag: 3.83,bv: 1.43},
    {pos:{ra:3.848276,dec:-0.659623},mag: 4.00,bv:-0.17},
    {pos:{ra:3.842895,dec: 0.286554},mag: 4.94,bv:-0.03},
    {pos:{ra:3.844735,dec: 0.239605},mag: 4.83,bv: 0.00},
    {pos:{ra:3.844735,dec: 0.239605},mag: 4.43,bv: 0.05},
    {pos:{ra:3.846909,dec: 0.142448},mag: 4.86,bv: 1.00},
    {pos:{ra:3.862799,dec:-1.097390},mag: 5.36,bv: 0.29},
    {pos:{ra:3.855680,dec:-0.613895},mag: 4.05,bv: 1.35},
    {pos:{ra:3.853076,dec:-0.098757},mag: 3.88,bv: 0.38},
    {pos:{ra:3.861483,dec:-0.614215},mag: 4.92,bv: 0.01},
    {pos:{ra:3.854661,dec: 0.462997},mag: 4.81,bv: 1.66},
    {pos:{ra:3.870362,dec:-0.914266},mag: 5.21,bv: 0.98},
    {pos:{ra:3.865911,dec:-0.444065},mag: 4.94,bv: 0.35},
    {pos:{ra:3.862596,dec: 0.296085},mag: 4.60,bv: 0.98},
    {pos:{ra:3.861483,dec: 0.472548},mag: 5.12,bv: 0.00},
    {pos:{ra:3.861483,dec: 0.472533},mag: 2.70,bv: 0.97},
    {pos:{ra:3.866988,dec: 0.033035},mag: 3.72,bv:-0.01},
    {pos:{ra:3.873526,dec:-0.455313},mag: 5.24,bv: 0.94},
    {pos:{ra:3.880383,dec:-0.246945},mag: 5.31,bv: 0.07},
    {pos:{ra:3.884616,dec:-0.487999},mag: 4.41,bv: 1.40},
    {pos:{ra:3.890513,dec:-0.760537},mag: 4.32,bv:-0.15},
    {pos:{ra:3.886354,dec:-0.279204},mag: 5.15,bv: 0.41},
    {pos:{ra:3.887190,dec:-0.279980},mag: 2.75,bv: 0.15},
    {pos:{ra:3.887794,dec:-0.040128},mag: 4.94,bv: 0.98},
    {pos:{ra:3.917748,dec:-1.338018},mag: 5.34,bv: 1.45},
    {pos:{ra:3.885510,dec: 0.650518},mag: 5.48,bv: 1.02},
    {pos:{ra:3.895800,dec:-0.659793},mag: 5.03,bv:-0.16},
    {pos:{ra:3.889415,dec: 0.333377},mag: 4.55,bv: 0.76},
    {pos:{ra:3.907690,dec:-1.049190},mag: 5.20,bv: 1.16},
    {pos:{ra:3.902273,dec:-0.430088},mag: 5.30,bv: 1.32},
    {pos:{ra:3.912737,dec:-1.095732},mag: 5.11,bv: 0.00},
    {pos:{ra:3.889641,dec: 1.034874},mag: 5.46,bv: 1.36},
    {pos:{ra:3.910796,dec:-0.921704},mag: 5.38,bv: 0.13},
    {pos:{ra:3.908425,dec:-0.590896},mag: 5.32,bv: 0.04},
    {pos:{ra:3.886434,dec: 1.294259},mag: 2.08,bv: 1.47},
    {pos:{ra:3.912890,dec:-0.199137},mag: 5.46,bv: 1.49},
    {pos:{ra:3.914701,dec:-0.075859},mag: 4.49,bv: 0.32},
    {pos:{ra:3.920584,dec:-0.752828},mag: 2.68,bv:-0.22},
    {pos:{ra:3.923333,dec:-0.734856},mag: 3.13,bv:-0.20},
    {pos:{ra:3.931238,dec:-0.148683},mag: 4.92,bv: 0.00},
    {pos:{ra:3.916446,dec: 1.150739},mag: 4.60,bv: 1.59},
    {pos:{ra:3.947949,dec:-1.117563},mag: 5.17,bv: 0.93},
    {pos:{ra:3.940030,dec:-0.569734},mag: 5.44,bv:-0.12},
    {pos:{ra:3.936190,dec: 0.436473},mag: 4.81,bv: 1.50},
    {pos:{ra:3.939644,dec: 0.036502},mag: 4.40,bv: 1.04},
    {pos:{ra:3.935485,dec: 0.704948},mag: 3.50,bv: 0.97},
    {pos:{ra:3.944750,dec:-0.441253},mag: 3.29,bv: 1.70},
    {pos:{ra:3.949331,dec:-0.821197},mag: 4.72,bv:-0.14},
    {pos:{ra:3.949331,dec:-0.821197},mag: 4.82,bv: 0.00},
    {pos:{ra:3.950197,dec:-0.716758},mag: 5.15,bv: 1.01},
    {pos:{ra:3.946386,dec: 0.470323},mag: 4.54,bv: 1.24},
    {pos:{ra:3.943528,dec: 0.831727},mag: 4.76,bv: 0.65},
    {pos:{ra:3.955905,dec:-0.283737},mag: 5.20,bv: 1.58},
    {pos:{ra:3.965577,dec:-0.790280},mag: 4.05,bv:-0.18},
    {pos:{ra:3.958850,dec: 0.434049},mag: 4.93,bv: 0.43},
    {pos:{ra:3.954385,dec: 0.952189},mag: 5.25,bv: 0.96},
    {pos:{ra:3.979067,dec:-0.850635},mag: 3.87,bv:-0.05},
    {pos:{ra:3.980594,dec:-0.909302},mag: 3.41,bv: 0.92},
    {pos:{ra:3.982950,dec:-0.776681},mag: 4.82,bv:-0.17},
    {pos:{ra:3.980318,dec:-0.345430},mag: 4.54,bv:-0.08},
    {pos:{ra:3.990790,dec:-0.550113},mag: 4.91,bv: 0.37},
    {pos:{ra:4.000927,dec:-1.063909},mag: 5.09,bv:-0.06},
    {pos:{ra:4.003996,dec:-1.110214},mag: 4.86,bv: 1.25},
    {pos:{ra:3.997095,dec:-0.724156},mag: 5.16,bv: 0.58},
    {pos:{ra:4.003407,dec:-1.026273},mag: 4.07,bv: 0.09},
    {pos:{ra:4.009501,dec:-1.198682},mag: 2.89,bv: 0.00},
    {pos:{ra:3.993270,dec: 0.086210},mag: 5.33,bv: 1.09},
    {pos:{ra:3.990201,dec: 0.509011},mag: 5.26,bv: 0.03},
    {pos:{ra:3.998477,dec:-0.390944},mag: 5.50,bv: 1.38},
    {pos:{ra:4.009087,dec:-1.055861},mag: 5.46,bv:-0.10},
    {pos:{ra:3.994637,dec: 0.581452},mag: 3.47,bv: 0.95},
    {pos:{ra:4.007858,dec:-0.835576},mag: 4.27,bv:-0.08},
    {pos:{ra:4.001196,dec:-0.163765},mag: 2.61,bv:-0.11},
    {pos:{ra:4.004796,dec:-0.526197},mag: 4.34,bv: 1.10},
    {pos:{ra:3.990863,dec: 1.175421},mag: 5.13,bv: 0.53},
    {pos:{ra:4.011261,dec: 0.030810},mag: 5.06,bv: 0.54},
    {pos:{ra:4.020242,dec:-0.709433},mag: 3.22,bv:-0.22},
    {pos:{ra:4.023588,dec:-0.836498},mag: 5.00,bv: 0.50},
    {pos:{ra:4.028998,dec:-1.035344},mag: 4.51,bv: 0.19},
    {pos:{ra:4.022141,dec:-0.632881},mag: 3.56,bv: 1.54},
    {pos:{ra:4.025958,dec:-0.779978},mag: 3.37,bv:-0.18},
    {pos:{ra:4.018766,dec: 0.012484},mag: 5.35,bv: 1.19},
    {pos:{ra:4.028031,dec:-0.643304},mag: 4.54,bv:-0.15},
    {pos:{ra:4.001596,dec: 1.253563},mag: 5.02,bv: 1.37},
    {pos:{ra:4.022155,dec: 0.574805},mag: 5.37,bv:-0.07},
    {pos:{ra:4.034976,dec:-0.693075},mag: 5.37,bv:-0.11},
    {pos:{ra:4.032576,dec:-0.180157},mag: 4.94,bv: 0.44},
    {pos:{ra:4.037543,dec:-0.676029},mag: 4.60,bv: 0.00},
    {pos:{ra:4.025704,dec: 0.690826},mag: 5.50,bv: 1.59},
    {pos:{ra:4.064494,dec:-1.280887},mag: 5.49,bv:-0.12},
    {pos:{ra:4.033849,dec: 0.652356},mag: 4.31,bv: 0.31},
    {pos:{ra:4.017435,dec: 1.253738},mag: 3.05,bv: 0.05},
    {pos:{ra:4.046124,dec:-0.641719},mag: 5.45,bv:-0.15},
    {pos:{ra:4.039521,dec: 0.269270},mag: 5.17,bv: 1.66},
    {pos:{ra:4.041703,dec: 0.599273},mag: 5.46,bv: 1.40},
    {pos:{ra:4.055295,dec:-0.815641},mag: 5.24,bv: 1.74},
    {pos:{ra:4.035769,dec: 1.029153},mag: 3.29,bv: 1.16},
    {pos:{ra:4.051942,dec: 0.032153},mag: 5.17,bv: 0.23},
    {pos:{ra:4.048415,dec: 0.507993},mag: 3.68,bv: 0.28},
    {pos:{ra:4.061948,dec: 0.712671},mag: 5.02,bv: 1.59},
    {pos:{ra:4.070632,dec:-0.294136},mag: 5.50,bv:-0.14},
    {pos:{ra:4.087212,dec:-1.157449},mag: 4.11,bv: 1.17},
    {pos:{ra:4.065672,dec: 0.713830},mag: 5.02,bv: 0.07},
    {pos:{ra:4.078056,dec:-0.489512},mag: 5.15,bv: 1.30},
    {pos:{ra:4.080325,dec:-0.718499},mag: 2.78,bv:-0.20},
    {pos:{ra:4.076122,dec:-0.175658},mag: 4.62,bv: 1.01},
    {pos:{ra:4.070675,dec: 0.547321},mag: 4.14,bv:-0.13},
    {pos:{ra:4.077278,dec:-0.160279},mag: 5.17,bv:-0.09},
    {pos:{ra:4.083576,dec:-0.784676},mag: 4.54,bv:-0.18},
    {pos:{ra:4.084950,dec:-0.774873},mag: 5.43,bv: 1.50},
    {pos:{ra:4.082005,dec:-0.258125},mag: 3.91,bv: 1.01},
    {pos:{ra:4.078842,dec: 0.183914},mag: 3.80,bv: 0.26},
    {pos:{ra:4.078842,dec: 0.183943},mag: 3.80,bv: 0.26},
    {pos:{ra:4.078347,dec: 0.466260},mag: 2.23,bv:-0.02},
    {pos:{ra:4.088543,dec:-0.491048},mag: 3.58,bv: 1.38},
    {pos:{ra:4.093030,dec:-0.742943},mag: 4.33,bv: 1.42},
    {pos:{ra:4.096397,dec:-0.914077},mag: 5.44,bv: 0.00},
    {pos:{ra:4.080798,dec: 0.680853},mag: 5.11,bv: 1.64},
    {pos:{ra:4.086223,dec: 0.174707},mag: 5.26,bv: 0.95},
    {pos:{ra:4.095662,dec:-0.519720},mag: 3.66,bv:-0.17},
    {pos:{ra:4.096760,dec:-0.336882},mag: 5.38,bv: 0.86},
    {pos:{ra:4.100506,dec:-0.600602},mag: 4.67,bv: 0.99},
    {pos:{ra:4.092041,dec: 0.704299},mag: 5.24,bv: 0.88},
    {pos:{ra:4.102753,dec:-0.415704},mag: 4.96,bv: 1.33},
    {pos:{ra:4.106709,dec:-0.779483},mag: 4.64,bv: 0.40},
    {pos:{ra:4.064065,dec: 1.350003},mag: 4.96,bv: 1.58},
    {pos:{ra:4.098811,dec: 0.639416},mag: 5.07,bv:-0.12},
    {pos:{ra:4.113036,dec:-0.653189},mag: 5.24,bv: 0.98},
    {pos:{ra:4.110018,dec:-0.343461},mag: 4.74,bv: 1.57},
    {pos:{ra:4.113232,dec:-0.605814},mag: 4.75,bv:-0.14},
    {pos:{ra:4.108294,dec: 0.343311},mag: 4.52,bv: 0.04},
    {pos:{ra:4.109334,dec: 0.224231},mag: 5.33,bv: 0.04},
    {pos:{ra:4.119297,dec:-0.273542},mag: 5.41,bv: 0.23},
    {pos:{ra:4.113494,dec: 0.458944},mag: 3.84,bv: 0.00},
    {pos:{ra:4.120148,dec: 0.112147},mag: 2.65,bv: 1.17},
    {pos:{ra:4.128111,dec:-0.031493},mag: 5.40,bv:-0.03},
    {pos:{ra:4.128525,dec: 0.269164},mag: 3.67,bv: 0.06},
    {pos:{ra:4.129638,dec: 0.128335},mag: 4.43,bv: 0.60},
    {pos:{ra:4.139659,dec: 0.316632},mag: 4.09,bv: 1.62},
    {pos:{ra:4.143499,dec:-0.059870},mag: 3.53,bv:-0.04},
    {pos:{ra:4.149339,dec:-0.586906},mag: 3.95,bv:-0.04},
    {pos:{ra:4.149426,dec:-0.449447},mag: 4.64,bv:-0.05},
    {pos:{ra:4.130612,dec: 1.092566},mag: 5.19,bv: 0.04},
    {pos:{ra:4.146430,dec: 0.038334},mag: 5.23,bv: 1.02},
    {pos:{ra:4.143390,dec: 0.454978},mag: 4.63,bv: 0.80},
    {pos:{ra:4.169126,dec:-1.197349},mag: 5.09,bv: 1.13},
    {pos:{ra:4.148720,dec: 0.078152},mag: 3.71,bv: 0.15},
    {pos:{ra:4.148190,dec: 0.264131},mag: 5.20,bv: 0.00},
    {pos:{ra:4.150655,dec:-0.053940},mag: 5.11,bv: 0.12},
    {pos:{ra:4.167592,dec:-1.107072},mag: 2.85,bv: 0.29},
    {pos:{ra:4.150677,dec: 0.366131},mag: 4.76,bv: 1.54},
    {pos:{ra:4.150531,dec: 0.622341},mag: 4.82,bv: 1.00},
    {pos:{ra:4.159708,dec:-0.351984},mag: 5.03,bv:-0.01},
    {pos:{ra:4.119232,dec: 1.357769},mag: 4.32,bv: 0.04},
    {pos:{ra:4.160916,dec:-0.442043},mag: 4.59,bv:-0.07},
    {pos:{ra:4.162159,dec:-0.428183},mag: 5.39,bv:-0.02},
    {pos:{ra:4.162305,dec:-0.418496},mag: 5.42,bv:-0.04},
    {pos:{ra:4.161847,dec:-0.291984},mag: 4.15,bv: 1.02},
    {pos:{ra:4.156829,dec: 0.740921},mag: 4.62,bv: 0.56},
    {pos:{ra:4.165126,dec: 0.354491},mag: 5.44,bv: 1.59},
    {pos:{ra:4.175228,dec:-0.592825},mag: 5.12,bv: 0.12},
    {pos:{ra:4.175199,dec:-0.509883},mag: 3.88,bv:-0.20},
    {pos:{ra:4.165367,dec: 0.752911},mag: 5.37,bv: 1.65},
    {pos:{ra:4.173315,dec: 0.273348},mag: 3.85,bv: 0.48},
    {pos:{ra:4.170435,dec: 0.662299},mag: 5.45,bv: 0.33},
    {pos:{ra:4.180892,dec:-0.249223},mag: 4.88,bv:-0.10},
    {pos:{ra:4.182594,dec:-0.433389},mag: 5.43,bv:-0.09},
    {pos:{ra:4.186630,dec:-0.728578},mag: 4.99,bv: 1.00},
    {pos:{ra:4.183780,dec:-0.455778},mag: 2.89,bv:-0.19},
    {pos:{ra:4.178267,dec: 0.469106},mag: 4.15,bv: 1.23},
    {pos:{ra:4.189321,dec:-0.670153},mag: 3.41,bv:-0.22},
    {pos:{ra:4.190245,dec:-0.394823},mag: 2.32,bv:-0.12},
    {pos:{ra:4.190216,dec:-0.288561},mag: 5.47,bv: 0.52},
    {pos:{ra:4.186623,dec: 0.452394},mag: 5.50,bv: 0.10},
    {pos:{ra:4.179147,dec: 0.955563},mag: 4.95,bv: 0.26},
    {pos:{ra:4.204200,dec:-1.008369},mag: 4.63,bv: 0.24},
    {pos:{ra:4.202818,dec:-0.859221},mag: 4.65,bv: 0.92},
    {pos:{ra:4.194193,dec: 0.310989},mag: 5.12,bv: 0.99},
    {pos:{ra:4.203640,dec:-0.673741},mag: 4.89,bv:-0.14},
    {pos:{ra:4.193350,dec: 0.581258},mag: 5.41,bv: 0.60},
    {pos:{ra:4.203378,dec:-0.451434},mag: 5.00,bv: 1.22},
    {pos:{ra:4.195088,dec: 0.521000},mag: 4.99,bv:-0.07},
    {pos:{ra:4.198804,dec: 0.398013},mag: 4.83,bv: 0.07},
    {pos:{ra:4.207850,dec:-0.198497},mag: 5.07,bv: 0.00},
    {pos:{ra:4.207850,dec:-0.198497},mag: 4.77,bv: 0.47},
    {pos:{ra:4.217108,dec:-0.788423},mag: 4.72,bv: 0.23},
    {pos:{ra:4.201000,dec: 0.803491},mag: 4.76,bv:-0.11},
    {pos:{ra:4.212512,dec:-0.345672},mag: 2.62,bv:-0.07},
    {pos:{ra:4.212534,dec:-0.345609},mag: 4.92,bv:-0.02},
    {pos:{ra:4.197030,dec: 1.022157},mag: 4.01,bv: 0.52},
    {pos:{ra:4.217552,dec:-0.642320},mag: 4.23,bv:-0.17},
    {pos:{ra:4.218490,dec:-0.360745},mag: 3.96,bv:-0.04},
    {pos:{ra:4.221101,dec:-0.364226},mag: 4.32,bv: 0.84},
    {pos:{ra:4.224249,dec:-0.459487},mag: 5.38,bv: 1.65},
    {pos:{ra:4.224024,dec: 0.297525},mag: 5.00,bv: 0.95},
    {pos:{ra:4.231732,dec:-0.060510},mag: 5.37,bv: 1.45},
    {pos:{ra:4.236932,dec:-0.513413},mag: 5.13,bv: 1.12},
    {pos:{ra:4.227936,dec: 0.636885},mag: 4.76,bv: 1.01},
    {pos:{ra:4.277569,dec:-1.373501},mag: 4.68,bv: 1.69},
    {pos:{ra:4.278006,dec:-1.373002},mag: 5.27,bv: 1.41},
    {pos:{ra:4.227057,dec: 0.784264},mag: 4.26,bv:-0.07},
    {pos:{ra:4.247601,dec:-0.953483},mag: 4.94,bv: 1.04},
    {pos:{ra:4.216403,dec: 1.183513},mag: 5.44,bv:-0.02},
    {pos:{ra:4.241128,dec:-0.339651},mag: 4.01,bv: 0.04},
    {pos:{ra:4.242474,dec:-0.487407},mag: 4.59,bv:-0.16},
    {pos:{ra:4.256153,dec:-1.111523},mag: 3.85,bv: 1.11},
    {pos:{ra:4.241150,dec:-0.175653},mag: 4.94,bv: 0.09},
    {pos:{ra:4.241681,dec:-0.149182},mag: 5.43,bv: 0.12},
    {pos:{ra:4.255352,dec:-0.826801},mag: 5.14,bv:-0.13},
    {pos:{ra:4.246634,dec: 0.087635},mag: 5.48,bv: 1.47},
    {pos:{ra:4.249215,dec:-0.206603},mag: 5.22,bv: 1.42},
    {pos:{ra:4.261738,dec:-0.939181},mag: 5.44,bv: 1.73},
    {pos:{ra:4.251382,dec:-0.064480},mag: 2.74,bv: 1.58},
    {pos:{ra:4.263032,dec:-0.873857},mag: 4.99,bv: 0.80},
    {pos:{ra:4.256953,dec:-0.146074},mag: 5.50,bv: 0.65},
    {pos:{ra:4.268632,dec:-0.499407},mag: 4.78,bv: 0.02},
    {pos:{ra:4.272981,dec:-0.744800},mag: 5.45,bv: 0.10},
    {pos:{ra:4.275359,dec:-0.875380},mag: 4.02,bv: 1.08},
    {pos:{ra:4.268734,dec:-0.081900},mag: 3.24,bv: 0.96},
    {pos:{ra:4.274071,dec:-0.539423},mag: 5.49,bv: 0.47},
    {pos:{ra:4.236023,dec: 1.324312},mag: 5.48,bv:-0.11},
    {pos:{ra:4.278835,dec:-0.421836},mag: 4.55,bv: 0.84},
    {pos:{ra:4.286819,dec:-0.865198},mag: 5.33,bv:-0.04},
    {pos:{ra:4.281242,dec:-0.446678},mag: 2.89,bv: 0.13},
    {pos:{ra:4.264080,dec: 1.042922},mag: 5.40,bv: 1.63},
    {pos:{ra:4.275700,dec: 0.693046},mag: 5.46,bv: 0.40},
    {pos:{ra:4.274922,dec: 0.808320},mag: 3.89,bv:-0.15},
    {pos:{ra:4.285103,dec: 0.017962},mag: 4.82,bv: 0.34},
    {pos:{ra:4.293604,dec:-0.684048},mag: 5.40,bv: 0.62},
    {pos:{ra:4.284434,dec: 0.334284},mag: 3.75,bv: 0.27},
    {pos:{ra:4.313007,dec:-1.223204},mag: 4.91,bv: 0.55},
    {pos:{ra:4.295815,dec:-0.655647},mag: 5.42,bv:-0.11},
    {pos:{ra:4.334743,dec:-1.377016},mag: 3.89,bv: 0.91},
    {pos:{ra:4.285205,dec: 0.539166},mag: 4.85,bv: 0.97},
    {pos:{ra:4.293961,dec:-0.349720},mag: 4.50,bv: 1.01},
    {pos:{ra:4.286340,dec: 0.589907},mag: 5.20,bv: 1.60},
    {pos:{ra:4.286907,dec: 0.588239},mag: 5.39,bv: 1.53},
    {pos:{ra:4.310767,dec:-1.118024},mag: 5.27,bv: 0.36},
    {pos:{ra:4.300433,dec:-0.409231},mag: 5.02,bv: 0.24},
    {pos:{ra:4.307407,dec:-0.829991},mag: 4.47,bv:-0.07},
    {pos:{ra:4.265170,dec: 1.322179},mag: 4.95,bv: 0.37},
    {pos:{ra:4.299691,dec: 0.244928},mag: 4.57,bv: 0.00},
    {pos:{ra:4.306702,dec:-0.322125},mag: 4.42,bv: 0.28},
    {pos:{ra:4.323282,dec:-1.075709},mag: 5.20,bv: 1.23},
    {pos:{ra:4.283962,dec: 1.206187},mag: 5.25,bv: 1.12},
    {pos:{ra:4.309763,dec:-0.132611},mag: 5.23,bv: 1.72},
    {pos:{ra:4.310098,dec:-0.146113},mag: 4.63,bv: 0.17},
    {pos:{ra:4.318403,dec:-0.807098},mag: 5.35,bv: 0.56},
    {pos:{ra:4.293474,dec: 1.073625},mag: 2.74,bv: 0.91},
    {pos:{ra:4.317101,dec:-0.461324},mag: 0.96,bv: 1.83},
    {pos:{ra:4.338547,dec:-1.238975},mag: 5.50,bv: 1.22},
    {pos:{ra:4.313436,dec: 0.011606},mag: 5.39,bv: 1.46},
    {pos:{ra:4.320591,dec:-0.438339},mag: 4.79,bv:-0.11},
    {pos:{ra:4.327085,dec:-0.729843},mag: 5.33,bv: 0.33},
    {pos:{ra:4.325718,dec:-0.605707},mag: 4.23,bv:-0.16},
    {pos:{ra:4.313763,dec: 0.730973},mag: 5.04,bv: 1.52},
    {pos:{ra:4.324657,dec:-0.289948},mag: 4.28,bv: 0.92},
    {pos:{ra:4.320650,dec: 0.375066},mag: 2.77,bv: 0.94},
    {pos:{ra:4.323675,dec: 0.034625},mag: 3.82,bv: 0.01},
    {pos:{ra:4.322134,dec: 0.357429},mag: 5.25,bv: 1.29},
    {pos:{ra:4.329013,dec:-0.374659},mag: 4.45,bv: 0.13},
    {pos:{ra:4.337507,dec:-0.768735},mag: 4.94,bv: 0.05},
    {pos:{ra:4.331056,dec: 0.200504},mag: 4.84,bv: 1.49},
    {pos:{ra:4.310891,dec: 1.200229},mag: 5.00,bv:-0.06},
    {pos:{ra:4.376748,dec:-1.352936},mag: 4.24,bv: 1.06},
    {pos:{ra:4.347506,dec:-0.748029},mag: 5.47,bv: 0.40},
    {pos:{ra:4.345361,dec:-0.492464},mag: 2.82,bv:-0.25},
    {pos:{ra:4.347506,dec:-0.615326},mag: 4.16,bv: 1.57},
    {pos:{ra:4.337594,dec: 0.740664},mag: 4.20,bv:-0.01},
    {pos:{ra:4.350924,dec:-0.184433},mag: 2.56,bv: 0.02},
    {pos:{ra:4.346866,dec: 0.923706},mag: 5.08,bv:-0.04},
    {pos:{ra:4.370188,dec:-0.309660},mag: 4.96,bv: 1.11},
    {pos:{ra:4.354626,dec: 0.977656},mag: 5.29,bv: 1.08},
    {pos:{ra:4.357862,dec: 0.853961},mag: 4.90,bv: 1.55},
    {pos:{ra:4.392412,dec:-1.171286},mag: 5.13,bv:-0.08},
    {pos:{ra:4.368937,dec: 0.551577},mag: 2.81,bv: 0.65},
    {pos:{ra:4.401131,dec:-1.204762},mag: 1.92,bv: 1.44},
    {pos:{ra:4.375962,dec: 0.679321},mag: 3.53,bv: 0.92},
    {pos:{ra:4.392979,dec:-0.687262},mag: 5.48,bv: 0.98},
    {pos:{ra:4.367330,dec: 1.127294},mag: 4.83,bv: 1.22},
    {pos:{ra:4.388769,dec: 0.149793},mag: 5.15,bv: 1.53},
    {pos:{ra:4.406018,dec:-1.030467},mag: 3.76,bv: 1.57},
    {pos:{ra:4.397241,dec: 0.091572},mag: 5.24,bv:-0.02},
    {pos:{ra:4.386434,dec: 0.991032},mag: 4.85,bv: 0.38},
    {pos:{ra:4.407669,dec:-0.598532},mag: 2.29,bv: 1.15},
    {pos:{ra:4.406229,dec:-0.188200},mag: 4.65,bv: 0.47},
    {pos:{ra:4.413770,dec:-0.719609},mag: 5.22,bv: 0.07},
    {pos:{ra:4.415116,dec:-0.664054},mag: 3.08,bv:-0.20},
    {pos:{ra:4.408367,dec: 0.126498},mag: 5.49,bv: 0.10},
    {pos:{ra:4.417145,dec:-0.663531},mag: 3.57,bv:-0.21},
    {pos:{ra:4.403625,dec: 0.802561},mag: 4.82,bv: 0.09},
    {pos:{ra:4.424541,dec:-0.729659},mag: 5.45,bv: 0.19},
    {pos:{ra:4.424388,dec:-0.739360},mag: 4.73,bv: 0.49},
    {pos:{ra:4.414614,dec: 0.430335},mag: 5.04,bv: 1.25},
    {pos:{ra:4.426955,dec:-0.739346},mag: 3.62,bv: 1.37},
    {pos:{ra:4.419908,dec: 0.553298},mag: 5.32,bv: 0.29},
    {pos:{ra:4.427006,dec:-0.107406},mag: 5.25,bv: 1.08},
    {pos:{ra:4.424446,dec: 0.177418},mag: 4.38,bv:-0.08},
    {pos:{ra:4.444568,dec:-0.977215},mag: 3.13,bv: 1.60},
    {pos:{ra:4.428424,dec: 0.365797},mag: 5.41,bv: 0.97},
    {pos:{ra:4.438307,dec:-0.580487},mag: 5.48,bv: 1.59},
    {pos:{ra:4.430387,dec: 0.321722},mag: 5.35,bv: 1.41},
    {pos:{ra:4.448779,dec:-0.927827},mag: 4.06,bv: 1.45},
    {pos:{ra:4.440416,dec: 0.163625},mag: 3.20,bv: 1.15},
    {pos:{ra:4.464320,dec:-0.929160},mag: 5.29,bv: 0.48},
    {pos:{ra:4.433260,dec: 1.136815},mag: 4.89,bv: 0.48},
    {pos:{ra:4.458786,dec:-0.561012},mag: 5.03,bv:-0.10},
    {pos:{ra:4.455215,dec:-0.073697},mag: 4.82,bv: 1.48},
    {pos:{ra:4.389365,dec: 1.431820},mag: 4.23,bv: 0.89},
    {pos:{ra:4.451855,dec: 0.539767},mag: 3.92,bv:-0.01},
    {pos:{ra:4.457600,dec: 0.585878},mag: 5.25,bv: 0.02},
    {pos:{ra:4.471635,dec:-0.595555},mag: 4.87,bv: 0.26},
    {pos:{ra:4.464247,dec: 0.245951},mag: 4.98,bv: 1.60},
    {pos:{ra:4.474057,dec: 0.222369},mag: 4.91,bv: 0.12},
    {pos:{ra:4.497299,dec:-0.777675},mag: 5.08,bv: 0.86},
    {pos:{ra:4.485641,dec: 0.627189},mag: 5.39,bv: 0.31},
    {pos:{ra:4.495873,dec:-0.274448},mag: 2.43,bv: 0.06},
    {pos:{ra:4.503619,dec:-0.754666},mag: 3.33,bv: 0.41},
    {pos:{ra:4.492281,dec: 0.711697},mag: 5.08,bv: 1.28},
    {pos:{ra:4.504971,dec: 0.184748},mag: 5.33,bv: 1.59},
    {pos:{ra:4.488929,dec: 1.146938},mag: 3.17,bv:-0.12},
    {pos:{ra:4.517567,dec:-0.464306},mag: 5.11,bv: 0.86},
    {pos:{ra:4.517552,dec:-0.464282},mag: 5.07,bv: 0.85},
    {pos:{ra:4.514505,dec: 0.251158},mag: 3.48,bv: 1.44},
    {pos:{ra:4.514527,dec: 0.251153},mag: 5.39,bv: 0.00},
    {pos:{ra:4.516178,dec: 0.433525},mag: 3.14,bv: 0.08},
    {pos:{ra:4.547012,dec:-1.223883},mag: 5.41,bv:-0.04},
    {pos:{ra:4.523072,dec:-0.007772},mag: 4.73,bv: 1.14},
    {pos:{ra:4.533725,dec:-0.813915},mag: 5.48,bv: 0.80},
    {pos:{ra:4.546539,dec:-1.182819},mag: 4.78,bv: 1.21},
    {pos:{ra:4.516243,dec: 0.642441},mag: 3.16,bv: 1.44},
    {pos:{ra:4.529181,dec:-0.423887},mag: 5.20,bv: 1.10},
    {pos:{ra:4.526184,dec: 0.577704},mag: 4.82,bv:-0.17},
    {pos:{ra:4.531820,dec: 0.189620},mag: 5.03,bv: 1.55},
    {pos:{ra:4.527697,dec: 0.650862},mag: 4.65,bv: 0.05},
    {pos:{ra:4.542234,dec:-0.368487},mag: 4.39,bv: 0.39},
    {pos:{ra:4.541471,dec:-0.224221},mag: 4.33,bv: 0.03},
    {pos:{ra:4.552117,dec:-0.828479},mag: 5.25,bv:-0.11},
    {pos:{ra:4.539230,dec: 0.315158},mag: 5.00,bv: 1.62},
    {pos:{ra:4.546627,dec:-0.436323},mag: 3.27,bv:-0.22},
    {pos:{ra:4.538568,dec: 0.445713},mag: 5.38,bv: 0.03},
    {pos:{ra:4.541798,dec: 0.427596},mag: 5.12,bv:-0.03},
    {pos:{ra:4.540736,dec: 0.566670},mag: 5.39,bv: 0.62},
    {pos:{ra:4.552517,dec:-0.491189},mag: 5.35,bv: 1.55},
    {pos:{ra:4.556255,dec:-0.770781},mag: 5.12,bv:-0.06},
    {pos:{ra:4.560982,dec:-0.969181},mag: 2.85,bv: 1.46},
    {pos:{ra:4.561389,dec:-0.983973},mag: 3.34,bv:-0.13},
    {pos:{ra:4.564036,dec:-0.883723},mag: 5.23,bv: 1.06},
    {pos:{ra:4.567781,dec:-0.800122},mag: 5.29,bv:-0.07},
    {pos:{ra:4.553906,dec: 0.648332},mag: 5.47,bv: 0.00},
    {pos:{ra:4.553927,dec: 0.648317},mag: 4.52,bv:-0.03},
    {pos:{ra:4.565650,dec:-0.421938},mag: 4.17,bv: 0.28},
    {pos:{ra:4.569948,dec:-0.521277},mag: 4.29,bv: 0.40},
    {pos:{ra:4.566792,dec:-0.088779},mag: 4.54,bv: 0.39},
    {pos:{ra:4.566283,dec: 0.072261},mag: 4.34,bv: 1.50},
    {pos:{ra:4.586282,dec:-1.059134},mag: 3.62,bv:-0.10},
    {pos:{ra:4.576377,dec: 0.005769},mag: 5.44,bv: 0.22},
    {pos:{ra:4.584820,dec:-0.650935},mag: 2.69,bv:-0.22},
    {pos:{ra:4.589525,dec:-0.870502},mag: 2.95,bv:-0.17},
    {pos:{ra:4.583220,dec:-0.018544},mag: 5.31,bv: 0.72},
    {pos:{ra:4.587671,dec:-0.418229},mag: 4.81,bv: 0.00},
    {pos:{ra:4.584711,dec: 0.455715},mag: 4.41,bv: 1.44},
    {pos:{ra:4.597234,dec:-0.647585},mag: 1.63,bv:-0.22},
    {pos:{ra:4.583380,dec: 0.912831},mag: 2.79,bv: 0.98},
    {pos:{ra:4.606186,dec:-0.811675},mag: 4.59,bv:-0.03},
    {pos:{ra:4.610054,dec:-0.674313},mag: 4.29,bv: 1.09},
    {pos:{ra:4.616803,dec:-0.951209},mag: 5.25,bv: 0.20},
    {pos:{ra:4.613429,dec:-0.750453},mag: 1.87,bv: 0.40},
    {pos:{ra:4.590987,dec: 0.963145},mag: 4.88,bv: 0.26},
    {pos:{ra:4.591380,dec: 0.962951},mag: 4.87,bv: 0.28},
    {pos:{ra:4.603022,dec: 0.219213},mag: 2.08,bv: 0.15},
    {pos:{ra:4.614593,dec:-0.268756},mag: 3.54,bv: 0.26},
    {pos:{ra:4.590063,dec: 1.189180},mag: 5.05,bv: 1.08},
    {pos:{ra:4.615719,dec:-0.141701},mag: 4.62,bv: 0.11},
    {pos:{ra:4.626839,dec:-0.862464},mag: 4.77,bv: 0.40},
    {pos:{ra:4.603270,dec: 1.079922},mag: 5.23,bv: 0.61},
    {pos:{ra:4.610404,dec: 0.847978},mag: 5.37,bv: 1.15},
    {pos:{ra:4.635980,dec:-0.681202},mag: 2.41,bv:-0.22},
    {pos:{ra:4.631297,dec:-0.224716},mag: 4.26,bv: 0.08},
    {pos:{ra:4.650139,dec:-1.129645},mag: 3.62,bv: 1.19},
    {pos:{ra:4.643209,dec:-0.904677},mag: 5.15,bv: 0.70},
    {pos:{ra:4.622788,dec: 0.802963},mag: 3.80,bv:-0.18},
    {pos:{ra:4.640089,dec:-0.378446},mag: 4.87,bv: 0.47},
    {pos:{ra:4.611822,dec: 1.200054},mag: 4.80,bv: 0.43},
    {pos:{ra:4.640278,dec: 0.079713},mag: 2.77,bv: 1.16},
    {pos:{ra:4.658218,dec:-0.700347},mag: 3.03,bv: 0.51},
    {pos:{ra:4.658109,dec:-0.485740},mag: 4.54,bv: 0.80},
    {pos:{ra:4.653302,dec: 0.483815},mag: 3.42,bv: 0.75},
    {pos:{ra:4.665156,dec:-0.553328},mag: 4.83,bv:-0.04},
    {pos:{ra:4.659564,dec: 0.047250},mag: 3.75,bv: 0.04},
    {pos:{ra:4.668138,dec:-0.646528},mag: 3.21,bv: 1.17},
    {pos:{ra:4.669570,dec:-0.699712},mag: 4.81,bv: 0.26},
    {pos:{ra:4.633580,dec: 1.259236},mag: 4.58,bv: 0.42},
    {pos:{ra:4.663607,dec: 0.447202},mag: 5.12,bv: 1.16},
    {pos:{ra:4.670421,dec: 0.511769},mag: 5.50,bv: 1.05},
    {pos:{ra:4.664705,dec: 0.886298},mag: 5.02,bv: 0.02},
    {pos:{ra:4.698383,dec:-0.773918},mag: 4.86,bv: 1.21},
    {pos:{ra:4.683162,dec: 0.698272},mag: 5.16,bv: 1.18},
    {pos:{ra:4.702768,dec:-0.728083},mag: 4.88,bv: 1.65},
    {pos:{ra:4.692405,dec: 0.454658},mag: 5.46,bv: 0.34},
    {pos:{ra:4.698404,dec:-0.071243},mag: 5.47,bv: 1.16},
    {pos:{ra:4.684151,dec: 0.992617},mag: 3.75,bv: 1.18},
    {pos:{ra:4.708404,dec:-0.528015},mag: 5.16,bv: 1.77},
    {pos:{ra:4.696041,dec: 0.650145},mag: 3.86,bv: 1.35},
    {pos:{ra:4.708142,dec:-0.170582},mag: 3.34,bv: 0.99},
    {pos:{ra:4.711487,dec:-0.415670},mag: 4.76,bv:-0.04},
    {pos:{ra:4.666356,dec: 1.343254},mag: 5.04,bv: 0.49},
    {pos:{ra:4.702637,dec: 0.510470},mag: 3.70,bv: 0.94},
    {pos:{ra:4.697583,dec: 0.898651},mag: 2.23,bv: 1.52},
    {pos:{ra:4.705859,dec: 0.526905},mag: 4.41,bv: 0.39},
    {pos:{ra:4.714498,dec:-0.064407},mag: 4.62,bv: 0.38},
    {pos:{ra:4.713538,dec: 0.076247},mag: 4.64,bv:-0.03},
    {pos:{ra:4.712636,dec: 0.292357},mag: 4.67,bv: 1.26},
    {pos:{ra:4.715203,dec: 0.051167},mag: 3.97,bv: 0.02},
    {pos:{ra:4.951419,dec:-1.529010},mag: 5.28,bv: 1.28},
    {pos:{ra:4.720039,dec: 0.022781},mag: 4.45,bv: 0.02},
    {pos:{ra:4.724832,dec:-0.423805},mag: 5.34,bv: 0.52},
    {pos:{ra:4.691387,dec: 1.256724},mag: 5.45,bv: 0.30},
    {pos:{ra:4.718927,dec: 0.376909},mag: 5.18,bv: 0.95},
    {pos:{ra:4.718963,dec: 0.376914},mag: 4.96,bv: 0.12},
    {pos:{ra:4.725835,dec:-0.142778},mag: 5.24,bv: 0.38},
    {pos:{ra:4.722795,dec: 0.363615},mag: 5.28,bv:-0.09},
    {pos:{ra:4.734300,dec:-0.516268},mag: 4.69,bv: 0.78},
    {pos:{ra:4.741325,dec:-0.874265},mag: 3.66,bv:-0.08},
    {pos:{ra:4.749826,dec:-1.111222},mag: 4.35,bv: 0.22},
    {pos:{ra:4.737732,dec:-0.531002},mag: 2.99,bv: 1.00},
    {pos:{ra:4.736191,dec: 0.043624},mag: 4.03,bv: 0.86},
    {pos:{ra:4.757920,dec:-1.082143},mag: 5.49,bv: 0.58},
    {pos:{ra:4.738707,dec: 0.387793},mag: 5.06,bv: 1.58},
    {pos:{ra:4.747659,dec:-0.496672},mag: 4.57,bv: 0.94},
    {pos:{ra:4.744270,dec: 0.152435},mag: 4.64,bv: 0.96},
    {pos:{ra:4.744460,dec: 0.166921},mag: 3.73,bv: 0.12},
    {pos:{ra:4.743042,dec: 0.533407},mag: 5.04,bv: 0.52},
    {pos:{ra:4.745303,dec: 0.502000},mag: 3.83,bv:-0.03},
    {pos:{ra:4.761389,dec:-0.802056},mag: 4.53,bv: 1.01},
    {pos:{ra:4.750605,dec: 0.363281},mag: 4.36,bv:-0.16},
    {pos:{ra:4.591154,dec: 1.511218},mag: 4.36,bv: 0.02},
    {pos:{ra:4.745027,dec: 0.758549},mag: 5.00,bv: 0.91},
    {pos:{ra:4.747456,dec: 0.635324},mag: 5.48,bv: 1.17},
    {pos:{ra:4.751143,dec: 0.349856},mag: 5.10,bv: 0.15},
    {pos:{ra:4.763542,dec:-0.413662},mag: 4.98,bv: 1.05},
    {pos:{ra:4.770029,dec:-0.721451},mag: 5.47,bv:-0.17},
    {pos:{ra:4.772443,dec:-0.367547},mag: 3.86,bv: 0.23},
    {pos:{ra:4.764327,dec: 0.548126},mag: 4.97,bv: 1.65},
    {pos:{ra:4.774632,dec:-0.378964},mag: 5.44,bv: 1.52},
    {pos:{ra:4.781671,dec:-0.771552},mag: 5.46,bv: 0.96},
    {pos:{ra:4.787111,dec:-0.977792},mag: 5.33,bv:-0.05},
    {pos:{ra:4.778777,dec:-0.361778},mag: 5.38,bv: 0.07},
    {pos:{ra:4.815371,dec:-1.309768},mag: 5.47,bv: 0.02},
    {pos:{ra:4.789300,dec:-0.641612},mag: 3.11,bv: 1.56},
    {pos:{ra:4.791162,dec:-0.471981},mag: 4.65,bv: 1.66},
    {pos:{ra:4.773025,dec: 1.123944},mag: 5.03,bv: 0.38},
    {pos:{ra:4.813735,dec:-1.073271},mag: 4.36,bv: 1.48},
    {pos:{ra:4.795983,dec: 0.126706},mag: 5.39,bv: 1.07},
    {pos:{ra:4.800295,dec:-0.276315},mag: 5.39,bv: 1.47},
    {pos:{ra:4.803997,dec:-0.520598},mag: 2.70,bv: 1.38},
    {pos:{ra:4.796070,dec: 0.426665},mag: 5.27,bv: 1.53},
    {pos:{ra:4.809735,dec:-0.674691},mag: 5.10,bv: 1.49},
    {pos:{ra:4.803444,dec: 0.058944},mag: 4.86,bv: 0.91},
    {pos:{ra:4.800957,dec: 0.383299},mag: 4.95,bv: 1.59},
    {pos:{ra:4.805371,dec:-0.050595},mag: 3.26,bv: 0.94},
    {pos:{ra:4.812243,dec:-0.640003},mag: 5.34,bv:-0.14},
    {pos:{ra:4.799052,dec: 0.629443},mag: 4.33,bv: 1.17},
    {pos:{ra:4.818432,dec:-0.769870},mag: 5.25,bv:-0.19},
    {pos:{ra:4.804091,dec: 0.503877},mag: 5.12,bv: 0.20},
    {pos:{ra:4.817858,dec:-0.600127},mag: 1.85,bv:-0.03},
    {pos:{ra:4.809015,dec: 0.406405},mag: 5.41,bv: 1.60},
    {pos:{ra:4.815618,dec:-0.155931},mag: 4.68,bv: 0.95},
    {pos:{ra:4.811945,dec: 0.311134},mag: 5.25,bv: 1.27},
    {pos:{ra:4.806397,dec: 0.857335},mag: 5.05,bv: 1.66},
    {pos:{ra:4.829755,dec:-0.839799},mag: 5.46,bv: 0.84},
    {pos:{ra:4.815793,dec: 0.379953},mag: 3.84,bv: 1.18},
    {pos:{ra:4.822999,dec:-0.358520},mag: 4.81,bv: 1.31},
    {pos:{ra:4.830082,dec:-0.802299},mag: 3.51,bv:-0.17},
    {pos:{ra:4.818112,dec: 0.689531},mag: 5.12,bv: 0.03},
    {pos:{ra:4.838191,dec:-0.856448},mag: 4.13,bv: 1.02},
    {pos:{ra:4.834431,dec:-0.443692},mag: 2.81,bv: 1.04},
    {pos:{ra:4.849281,dec:-1.086962},mag: 4.64,bv:-0.11},
    {pos:{ra:4.831108,dec: 0.003423},mag: 5.21,bv: 0.50},
    {pos:{ra:4.802964,dec: 1.245079},mag: 4.22,bv:-0.10},
    {pos:{ra:4.816709,dec: 1.026263},mag: 4.98,bv: 0.08},
    {pos:{ra:4.804266,dec: 1.269426},mag: 3.57,bv: 0.49},
    {pos:{ra:4.839791,dec:-0.254222},mag: 4.70,bv: 0.06},
    {pos:{ra:4.850954,dec:-0.801368},mag: 4.96,bv:-0.11},
    {pos:{ra:4.841907,dec:-0.034650},mag: 5.39,bv: 0.96},
    {pos:{ra:4.848001,dec:-0.575770},mag: 5.34,bv: 0.16},
    {pos:{ra:4.852161,dec:-0.798614},mag: 5.07,bv:-0.14},
    {pos:{ra:4.853571,dec:-0.692964},mag: 5.16,bv: 0.08},
    {pos:{ra:4.849565,dec:-0.321189},mag: 5.14,bv: 0.00},
    {pos:{ra:4.825770,dec: 1.144301},mag: 4.82,bv: 1.19},
    {pos:{ra:4.858575,dec:-0.738492},mag: 4.64,bv: 1.01},
    {pos:{ra:4.855164,dec:-0.259453},mag: 5.50,bv: 1.97},
    {pos:{ra:4.860582,dec:-0.576250},mag: 5.28,bv:-0.11},
    {pos:{ra:4.860269,dec:-0.419446},mag: 5.49,bv: 1.79},
    {pos:{ra:4.855644,dec: 0.533271},mag: 5.48,bv:-0.10},
    {pos:{ra:4.865280,dec:-0.191589},mag: 5.14,bv: 0.92},
    {pos:{ra:4.866007,dec:-0.143888},mag: 3.85,bv: 1.33},
    {pos:{ra:4.854524,dec: 0.995633},mag: 4.77,bv: 0.61},
    {pos:{ra:4.900165,dec:-1.246655},mag: 4.01,bv: 1.14},
    {pos:{ra:4.860502,dec: 0.913743},mag: 5.36,bv: 1.09},
    {pos:{ra:4.871490,dec: 0.159218},mag: 5.39,bv: 0.37},
    {pos:{ra:4.872312,dec: 0.116447},mag: 5.45,bv: 0.37},
    {pos:{ra:4.885104,dec:-0.753740},mag: 5.37,bv: 1.68},
    {pos:{ra:4.872174,dec: 0.584142},mag: 5.42,bv:-0.10},
    {pos:{ra:4.873563,dec: 0.676902},mag: 0.03,bv: 0.00},
    {pos:{ra:4.910695,dec:-1.132219},mag: 4.79,bv: 0.20},
    {pos:{ra:4.896841,dec:-0.157996},mag: 4.72,bv: 0.35},
    {pos:{ra:4.903422,dec:-0.668873},mag: 5.13,bv: 0.09},
    {pos:{ra:4.905786,dec:-0.622069},mag: 4.87,bv:-0.18},
    {pos:{ra:4.908535,dec:-0.692658},mag: 5.43,bv: 0.87},
    {pos:{ra:4.902288,dec:-0.144431},mag: 4.90,bv: 1.12},
    {pos:{ra:4.911604,dec:-0.471079},mag: 3.17,bv:-0.11},
    {pos:{ra:4.908004,dec: 0.035954},mag: 5.02,bv:-0.06},
    {pos:{ra:4.914600,dec:-0.390818},mag: 5.37,bv: 1.64},
    {pos:{ra:4.898405,dec: 0.969346},mag: 5.04,bv:-0.09},
    {pos:{ra:4.920709,dec:-0.705220},mag: 5.24,bv: 0.78},
    {pos:{ra:4.905859,dec: 0.692372},mag: 5.06,bv: 0.16},
    {pos:{ra:4.906041,dec: 0.691378},mag: 5.14,bv: 0.19},
    {pos:{ra:4.906041,dec: 0.691373},mag: 5.37,bv: 0.00},
    {pos:{ra:4.907750,dec: 0.656331},mag: 4.36,bv: 0.19},
    {pos:{ra:4.911625,dec: 0.358602},mag: 4.19,bv: 0.46},
    {pos:{ra:4.925501,dec:-0.762360},mag: 5.49,bv: 0.13},
    {pos:{ra:4.918229,dec:-0.082864},mag: 4.22,bv: 1.10},
    {pos:{ra:4.913429,dec: 0.465344},mag: 4.83,bv: 1.20},
    {pos:{ra:4.919574,dec:-0.099571},mag: 5.20,bv: 1.47},
    {pos:{ra:4.917560,dec: 0.317325},mag: 4.36,bv: 0.13},
    {pos:{ra:4.940227,dec:-1.085377},mag: 4.22,bv:-0.14},
    {pos:{ra:4.929108,dec:-0.354733},mag: 5.24,bv: 1.41},
    {pos:{ra:4.942162,dec:-0.909447},mag: 5.17,bv: 0.94},
    {pos:{ra:4.930039,dec: 0.568119},mag: 5.25,bv: 0.08},
    {pos:{ra:4.930904,dec: 0.582290},mag: 3.45,bv: 0.00},
    {pos:{ra:4.960880,dec:-1.173448},mag: 4.44,bv: 0.71},
    {pos:{ra:4.940475,dec: 0.373942},mag: 5.48,bv:-0.07},
    {pos:{ra:4.948750,dec:-0.396975},mag: 4.83,bv: 1.41},
    {pos:{ra:4.912135,dec: 1.293037},mag: 5.27,bv: 0.92},
    {pos:{ra:4.951143,dec:-0.272325},mag: 5.10,bv: 0.17},
    {pos:{ra:4.952888,dec:-0.395690},mag: 4.99,bv: 1.33},
    {pos:{ra:4.953528,dec:-0.458963},mag: 2.02,bv:-0.22},
    {pos:{ra:4.957964,dec:-0.745440},mag: 5.36,bv: 1.00},
    {pos:{ra:4.914716,dec: 1.316570},mag: 5.35,bv: 0.05},
    {pos:{ra:4.935798,dec: 1.036522},mag: 4.66,bv: 1.19},
    {pos:{ra:4.968109,dec:-1.050698},mag: 5.14,bv: 1.37},
    {pos:{ra:4.959680,dec:-0.651764},mag: 5.38,bv:-0.14},
    {pos:{ra:4.951273,dec: 0.395230},mag: 4.59,bv: 0.78},
    {pos:{ra:4.967476,dec:-0.923953},mag: 4.87,bv:-0.05},
    {pos:{ra:4.944634,dec: 0.885027},mag: 4.92,bv: 0.90},
    {pos:{ra:4.950205,dec: 0.644007},mag: 4.30,bv: 1.68},
    {pos:{ra:4.957695,dec: 0.073367},mag: 4.62,bv: 0.17},
    {pos:{ra:4.957797,dec: 0.073338},mag: 4.98,bv: 0.20},
    {pos:{ra:4.962589,dec:-0.360522},mag: 5.08,bv: 0.13},
    {pos:{ra:4.951805,dec: 0.726105},mag: 5.44,bv: 1.03},
    {pos:{ra:4.961368,dec:-0.102034},mag: 4.83,bv: 1.08},
    {pos:{ra:4.964283,dec:-0.368381},mag: 3.51,bv: 1.18},
    {pos:{ra:4.968618,dec:-0.647648},mag: 4.87,bv: 0.41},
    {pos:{ra:4.953834,dec: 0.767004},mag: 4.04,bv: 1.59},
    {pos:{ra:4.961215,dec: 0.574238},mag: 5.22,bv: 0.59},
    {pos:{ra:4.966531,dec: 0.303004},mag: 5.38,bv: 0.80},
    {pos:{ra:4.970240,dec: 0.237757},mag: 5.23,bv: 0.53},
    {pos:{ra:4.972545,dec: 0.262992},mag: 4.02,bv: 1.08},
    {pos:{ra:4.969578,dec: 0.570538},mag: 3.24,bv:-0.05},
    {pos:{ra:4.949747,dec: 1.244371},mag: 4.82,bv: 1.15},
    {pos:{ra:4.973134,dec: 0.457810},mag: 5.27,bv: 1.24},
    {pos:{ra:4.987780,dec:-0.734701},mag: 4.75,bv:-0.02},
    {pos:{ra:4.974254,dec: 0.561046},mag: 4.93,bv: 1.47},
    {pos:{ra:4.981519,dec:-0.100163},mag: 4.02,bv: 1.09},
    {pos:{ra:4.985584,dec:-0.521509},mag: 2.60,bv: 0.08},
    {pos:{ra:4.986878,dec:-0.064558},mag: 5.42,bv: 0.00},
    {pos:{ra:4.975184,dec: 0.881978},mag: 5.38,bv:-0.18},
    {pos:{ra:4.993467,dec:-0.541871},mag: 5.50,bv: 0.03},
    {pos:{ra:5.001815,dec:-0.913520},mag: 5.16,bv: 0.53},
    {pos:{ra:4.980472,dec: 0.819165},mag: 5.01,bv: 0.19},
    {pos:{ra:4.994623,dec:-0.379464},mag: 3.77,bv: 1.01},
    {pos:{ra:4.977345,dec: 0.971421},mag: 5.48,bv: 0.86},
    {pos:{ra:5.017291,dec:-1.194237},mag: 5.33,bv: 0.91},
    {pos:{ra:4.995831,dec:-0.070361},mag: 5.42,bv: 1.12},
    {pos:{ra:5.002193,dec:-0.646877},mag: 4.93,bv: 0.52},
    {pos:{ra:5.002193,dec:-0.646877},mag: 4.99,bv: 0.52},
    {pos:{ra:5.536054,dec:-1.552582},mag: 5.47,bv: 0.27},
    {pos:{ra:5.004470,dec:-0.482942},mag: 3.32,bv: 1.19},
    {pos:{ra:4.997794,dec: 0.241961},mag: 2.99,bv: 0.01},
    {pos:{ra:5.001452,dec:-0.085216},mag: 3.44,bv:-0.09},
    {pos:{ra:5.010615,dec:-0.706800},mag: 4.59,bv: 1.09},
    {pos:{ra:5.004630,dec: 0.193232},mag: 5.09,bv:-0.07},
    {pos:{ra:4.995656,dec: 0.931948},mag: 5.38,bv:-0.01},
    {pos:{ra:5.015516,dec:-0.661557},mag: 4.11,bv: 0.04},
    {pos:{ra:5.017945,dec:-0.686627},mag: 4.11,bv: 1.20},
    {pos:{ra:5.006593,dec: 0.567261},mag: 5.23,bv: 0.34},
    {pos:{ra:5.006048,dec: 0.630069},mag: 5.28,bv:-0.11},
    {pos:{ra:5.016789,dec:-0.366931},mag: 2.89,bv: 0.35},
    {pos:{ra:5.013451,dec: 0.106000},mag: 5.22,bv: 0.35},
    {pos:{ra:5.029508,dec:-0.138569},mag: 5.34,bv: 0.13},
    {pos:{ra:5.034017,dec: 0.040031},mag: 5.15,bv:-0.07},
    {pos:{ra:5.045579,dec:-0.793538},mag: 5.40,bv: 1.35},
    {pos:{ra:5.041995,dec:-0.440812},mag: 4.85,bv: 0.56},
    {pos:{ra:5.025130,dec: 0.992380},mag: 5.12,bv: 1.01},
    {pos:{ra:5.034220,dec: 0.683229},mag: 4.39,bv:-0.15},
    {pos:{ra:5.051136,dec:-0.330793},mag: 4.96,bv: 1.02},
    {pos:{ra:5.044947,dec: 0.373331},mag: 4.77,bv:-0.05},
    {pos:{ra:5.034926,dec: 1.007142},mag: 4.99,bv: 1.16},
    {pos:{ra:5.028970,dec: 1.180919},mag: 3.07,bv: 1.00},
    {pos:{ra:5.014171,dec: 1.336234},mag: 5.13,bv: 0.31},
    {pos:{ra:5.045609,dec: 0.665557},mag: 4.36,bv: 1.26},
    {pos:{ra:5.051928,dec: 0.202376},mag: 5.28,bv: 0.20},
    {pos:{ra:5.051536,dec: 0.401872},mag: 5.43,bv: 0.02},
    {pos:{ra:5.055092,dec: 0.018942},mag: 5.10,bv: 1.15},
    {pos:{ra:5.048816,dec: 0.931458},mag: 3.77,bv: 0.96},
    {pos:{ra:5.073897,dec:-0.949871},mag: 5.05,bv: 0.02},
    {pos:{ra:5.063848,dec:-0.094524},mag: 5.01,bv: 0.92},
    {pos:{ra:5.064051,dec:-0.015572},mag: 5.49,bv:-0.04},
    {pos:{ra:5.072967,dec:-0.775954},mag: 4.01,bv:-0.10},
    {pos:{ra:5.068756,dec:-0.311493},mag: 3.93,bv: 0.22},
    {pos:{ra:5.068989,dec:-0.278467},mag: 4.61,bv: 0.10},
    {pos:{ra:5.075505,dec:-0.781903},mag: 4.29,bv: 0.34},
    {pos:{ra:5.078413,dec:-0.708885},mag: 3.97,bv:-0.10},
    {pos:{ra:5.042038,dec: 1.280296},mag: 4.45,bv: 1.25},
    {pos:{ra:5.073883,dec: 0.458367},mag: 5.18,bv:-0.12},
    {pos:{ra:5.084471,dec:-0.427756},mag: 5.03,bv: 0.23},
    {pos:{ra:5.085431,dec:-0.418220},mag: 5.43,bv: 1.43},
    {pos:{ra:5.064371,dec: 1.146938},mag: 4.59,bv: 0.02},
    {pos:{ra:5.079461,dec: 0.516991},mag: 4.97,bv:-0.10},
    {pos:{ra:5.083140,dec: 0.208470},mag: 5.16,bv: 0.77},
    {pos:{ra:5.085446,dec: 0.054362},mag: 3.36,bv: 0.32},
    {pos:{ra:5.085351,dec: 0.345551},mag: 5.16,bv: 0.98},
    {pos:{ra:5.089896,dec: 0.005910},mag: 4.66,bv: 0.60},
    {pos:{ra:5.088296,dec: 0.633865},mag: 5.15,bv:-0.12},
    {pos:{ra:5.099438,dec: 0.430485},mag: 4.44,bv: 1.50},
    {pos:{ra:5.107983,dec:-0.048675},mag: 5.03,bv: 1.75},
    {pos:{ra:5.108237,dec: 0.487989},mag: 3.08,bv: 1.13},
    {pos:{ra:5.108382,dec: 0.488086},mag: 5.11,bv:-0.10},
    {pos:{ra:5.103801,dec: 0.902854},mag: 3.79,bv: 0.14},
    {pos:{ra:5.127850,dec:-0.839489},mag: 4.90,bv: 1.09},
    {pos:{ra:5.112818,dec: 0.601319},mag: 4.74,bv:-0.14},
    {pos:{ra:5.122934,dec: 0.128786},mag: 4.45,bv: 1.17},
    {pos:{ra:5.127436,dec:-0.184312},mag: 5.12,bv: 1.13},
    {pos:{ra:5.125079,dec: 0.345110},mag: 5.00,bv:-0.09},
    {pos:{ra:5.134351,dec:-0.434301},mag: 4.60,bv:-0.07},
    {pos:{ra:5.126243,dec: 0.514227},mag: 5.38,bv: 0.55},
    {pos:{ra:5.125537,dec: 0.740243},mag: 5.35,bv: 0.05},
    {pos:{ra:5.135159,dec:-0.122653},mag: 4.95,bv: 0.00},
    {pos:{ra:5.134417,dec:-0.022452},mag: 4.36,bv:-0.08},
    {pos:{ra:5.138133,dec:-0.249611},mag: 5.47,bv: 0.50},
    {pos:{ra:5.139071,dec:-0.081114},mag: 5.46,bv: 0.43},
    {pos:{ra:5.115386,dec: 1.215816},mag: 4.68,bv: 0.79},
    {pos:{ra:5.134024,dec: 0.780075},mag: 5.17,bv: 0.93},
    {pos:{ra:5.133195,dec: 0.876524},mag: 4.48,bv: 0.38},
    {pos:{ra:5.145202,dec: 0.094209},mag: 5.17,bv: 0.03},
    {pos:{ra:5.146001,dec: 0.526275},mag: 4.69,bv: 0.97},
    {pos:{ra:5.149143,dec: 0.314402},mag: 4.37,bv: 0.78},
    {pos:{ra:5.146285,dec: 0.747321},mag: 5.40,bv:-0.08},
    {pos:{ra:5.153296,dec: 0.305016},mag: 4.37,bv: 1.05},
    {pos:{ra:5.159709,dec:-0.281415},mag: 5.06,bv: 0.33},
    {pos:{ra:5.152372,dec: 0.794561},mag: 5.06,bv: 0.40},
    {pos:{ra:5.164248,dec:-0.270002},mag: 5.49,bv: 0.46},
    {pos:{ra:5.159921,dec: 0.206414},mag: 5.27,bv: 0.57},
    {pos:{ra:5.189831,dec:-1.265422},mag: 5.41,bv: 0.22},
    {pos:{ra:5.164931,dec: 0.449805},mag: 5.49,bv: 0.93},
    {pos:{ra:5.183715,dec:-0.983711},mag: 5.35,bv: 0.20},
    {pos:{ra:5.176479,dec:-0.344896},mag: 4.86,bv: 0.93},
    {pos:{ra:5.167382,dec: 0.651958},mag: 4.89,bv: 0.95},
    {pos:{ra:5.176036,dec: 0.185238},mag: 2.72,bv: 1.52},
    {pos:{ra:5.170429,dec: 0.787682},mag: 2.87,bv:-0.03},
    {pos:{ra:5.195612,dec:-1.033114},mag: 5.42,bv: 0.08},
    {pos:{ra:5.176763,dec: 0.588661},mag: 4.99,bv: 0.47},
    {pos:{ra:5.180959,dec: 0.323482},mag: 3.82,bv: 1.41},
    {pos:{ra:5.187897,dec: 0.334095},mag: 5.00,bv: 0.10},
    {pos:{ra:5.200397,dec:-0.695940},mag: 5.33,bv:-0.06},
    {pos:{ra:5.195758,dec:-0.187860},mag: 5.39,bv: 0.38},
    {pos:{ra:5.195773,dec: 0.154782},mag: 0.77,bv: 0.22},
    {pos:{ra:5.196834,dec: 0.181786},mag: 5.11,bv: 0.55},
    {pos:{ra:5.194820,dec: 0.574461},mag: 4.23,bv: 1.82},
    {pos:{ra:5.197016,dec: 0.394619},mag: 4.95,bv:-0.14},
    {pos:{ra:5.194827,dec: 0.675835},mag: 5.12,bv: 1.69},
    {pos:{ra:5.203146,dec: 0.017550},mag: 3.90,bv: 0.89},
    {pos:{ra:5.195096,dec: 0.924816},mag: 5.03,bv: 1.28},
    {pos:{ra:5.215313,dec:-0.730740},mag: 4.13,bv: 1.08},
    {pos:{ra:5.184384,dec: 1.226404},mag: 3.83,bv: 0.89},
    {pos:{ra:5.223349,dec:-1.028023},mag: 5.26,bv:-0.01},
    {pos:{ra:5.238569,dec:-1.272529},mag: 3.96,bv:-0.03},
    {pos:{ra:5.207459,dec: 0.420270},mag: 4.58,bv:-0.06},
    {pos:{ra:5.210891,dec: 0.147679},mag: 4.71,bv: 1.05},
    {pos:{ra:5.217836,dec:-0.459012},mag: 4.70,bv: 0.75},
    {pos:{ra:5.215539,dec: 0.111817},mag: 3.71,bv: 0.86},
    {pos:{ra:5.222665,dec:-0.474206},mag: 4.52,bv: 1.46},
    {pos:{ra:5.206710,dec: 1.003976},mag: 5.14,bv:-0.13},
    {pos:{ra:5.218629,dec: 0.290331},mag: 5.36,bv: 0.67},
    {pos:{ra:5.219574,dec: 0.199384},mag: 5.28,bv:-0.01},
    {pos:{ra:5.244162,dec:-1.168396},mag: 5.31,bv: 1.22},
    {pos:{ra:5.217931,dec: 0.671719},mag: 4.94,bv:-0.08},
    {pos:{ra:5.227043,dec:-0.270376},mag: 5.02,bv: 0.05},
    {pos:{ra:5.219872,dec: 0.612320},mag: 3.89,bv: 1.02},
    {pos:{ra:5.231421,dec:-0.457199},mag: 4.83,bv: 0.90},
    {pos:{ra:5.216920,dec: 0.915231},mag: 4.92,bv: 0.12},
    {pos:{ra:5.234839,dec:-0.615689},mag: 4.37,bv:-0.15},
    {pos:{ra:5.235355,dec:-0.605590},mag: 5.30,bv: 0.17},
    {pos:{ra:5.243602,dec:-1.036309},mag: 5.13,bv: 1.53},
    {pos:{ra:5.223908,dec: 0.704556},mag: 5.45,bv:-0.10},
    {pos:{ra:5.218200,dec: 1.027058},mag: 4.96,bv: 1.59},
    {pos:{ra:5.230563,dec: 0.340203},mag: 3.47,bv: 1.57},
    {pos:{ra:5.230024,dec: 0.540766},mag: 5.49,bv:-0.06},
    {pos:{ra:5.236228,dec: 0.305724},mag: 5.37,bv: 1.67},
    {pos:{ra:5.235639,dec: 0.646518},mag: 5.19,bv:-0.17},
    {pos:{ra:5.247587,dec:-0.483626},mag: 4.58,bv: 1.65},
    {pos:{ra:5.251514,dec:-0.662192},mag: 4.77,bv: 1.41},
    {pos:{ra:5.240795,dec: 0.484392},mag: 4.64,bv: 0.18},
    {pos:{ra:5.244816,dec: 0.435251},mag: 5.22,bv: 0.36},
    {pos:{ra:5.254867,dec:-0.559490},mag: 4.99,bv: 1.21},
    {pos:{ra:5.241922,dec: 0.874492},mag: 5.05,bv: 1.11},
    {pos:{ra:5.274065,dec:-1.155093},mag: 3.56,bv: 0.76},
    {pos:{ra:5.268218,dec:-0.922945},mag: 4.94,bv: 1.62},
    {pos:{ra:5.242424,dec: 1.131342},mag: 5.27,bv: 1.56},
    {pos:{ra:5.258495,dec: 0.348911},mag: 5.10,bv: 1.06},
    {pos:{ra:5.248285,dec: 1.184618},mag: 4.51,bv: 1.32},
    {pos:{ra:5.266051,dec: 0.412150},mag: 5.07,bv:-0.18},
    {pos:{ra:5.263753,dec: 0.627839},mag: 5.36,bv: 0.85},
    {pos:{ra:5.260190,dec: 1.082027},mag: 5.39,bv: 1.18},
    {pos:{ra:5.284850,dec:-0.630083},mag: 5.32,bv: 0.87},
    {pos:{ra:5.277119,dec: 0.642974},mag: 4.93,bv:-0.13},
    {pos:{ra:5.285315,dec:-0.014336},mag: 3.23,bv:-0.07},
    {pos:{ra:5.287475,dec: 0.467903},mag: 5.49,bv: 1.41},
    {pos:{ra:5.293722,dec:-0.017618},mag: 5.47,bv: 1.43},
    {pos:{ra:5.298282,dec: 0.265246},mag: 4.95,bv: 0.08},
    {pos:{ra:5.294020,dec: 0.817090},mag: 4.83,bv: 0.09},
    {pos:{ra:5.298129,dec: 0.500817},mag: 5.18,bv: 0.18},
    {pos:{ra:5.295467,dec: 0.815791},mag: 3.79,bv: 1.28},
    {pos:{ra:5.299401,dec: 0.642393},mag: 4.97,bv: 0.14},
    {pos:{ra:5.302594,dec: 0.446664},mag: 4.78,bv:-0.18},
    {pos:{ra:5.294449,dec: 0.987294},mag: 4.30,bv: 0.11},
    {pos:{ra:5.303634,dec: 0.410303},mag: 5.15,bv: 1.04},
    {pos:{ra:5.304790,dec: 0.485449},mag: 4.52,bv: 1.26},
    {pos:{ra:5.312993,dec:-0.218312},mag: 4.24,bv: 1.07},
    {pos:{ra:5.274770,dec: 1.356320},mag: 4.39,bv:-0.05},
    {pos:{ra:5.303495,dec: 0.832774},mag: 3.98,bv: 1.52},
    {pos:{ra:5.309226,dec: 0.430592},mag: 5.32,bv: 0.95},
    {pos:{ra:5.314767,dec:-0.218947},mag: 3.57,bv: 0.94},
    {pos:{ra:5.309823,dec: 0.704502},mag: 5.24,bv: 1.65},
    {pos:{ra:5.320607,dec:-0.333683},mag: 5.28,bv: 1.40},
    {pos:{ra:5.313597,dec: 0.663802},mag: 4.81,bv: 0.42},
    {pos:{ra:5.317371,dec: 0.610565},mag: 5.17,bv: 0.65},
    {pos:{ra:5.326149,dec:-0.222689},mag: 4.76,bv:-0.05},
    {pos:{ra:5.327669,dec:-0.257984},mag: 3.08,bv: 0.79},
    {pos:{ra:5.347900,dec:-0.990213},mag: 1.94,bv:-0.20},
    {pos:{ra:5.337122,dec: 0.093254},mag: 5.31,bv: 0.97},
    {pos:{ra:5.332977,dec: 0.702611},mag: 2.20,bv: 0.68},
    {pos:{ra:5.340104,dec: 0.561821},mag: 4.43,bv: 1.33},
    {pos:{ra:5.355194,dec:-0.317854},mag: 5.25,bv:-0.07},
    {pos:{ra:5.361913,dec:-0.310906},mag: 4.78,bv: 0.38},
    {pos:{ra:5.365360,dec:-0.050362},mag: 4.91,bv: 1.15},
    {pos:{ra:5.364248,dec: 0.530032},mag: 4.01,bv: 0.40},
    {pos:{ra:5.367142,dec: 0.854368},mag: 4.95,bv:-0.09},
    {pos:{ra:5.383985,dec:-0.776953},mag: 5.11,bv: 1.01},
    {pos:{ra:5.391235,dec:-1.057350},mag: 4.76,bv: 0.28},
    {pos:{ra:5.365062,dec: 1.099456},mag: 4.22,bv: 0.20},
    {pos:{ra:5.372618,dec: 0.859056},mag: 5.44,bv: 1.55},
    {pos:{ra:5.380908,dec: 0.197280},mag: 4.03,bv:-0.13},
    {pos:{ra:5.384122,dec: 0.227368},mag: 5.38,bv: 0.07},
    {pos:{ra:5.399998,dec:-1.073901},mag: 4.88,bv: 0.43},
    {pos:{ra:5.383919,dec: 0.615243},mag: 4.61,bv: 1.60},
    {pos:{ra:5.399903,dec:-0.825390},mag: 3.11,bv: 1.00},
    {pos:{ra:5.390049,dec: 0.256113},mag: 4.68,bv: 0.11},
    {pos:{ra:5.396238,dec:-0.044506},mag: 4.89,bv: 1.60},
    {pos:{ra:5.410710,dec:-1.056777},mag: 5.12,bv: 0.53},
    {pos:{ra:5.373462,dec: 1.308207},mag: 5.20,bv: 0.07},
    {pos:{ra:5.419036,dec:-1.165196},mag: 5.15,bv:-0.06},
    {pos:{ra:5.399830,dec: 0.254736},mag: 3.63,bv: 0.44},
    {pos:{ra:5.401001,dec: 0.198580},mag: 5.43,bv: 0.06},
    {pos:{ra:5.403270,dec:-0.019291},mag: 4.32,bv: 0.95},
    {pos:{ra:5.407350,dec:-0.261009},mag: 5.22,bv:-0.12},
    {pos:{ra:5.404070,dec: 0.370029},mag: 4.82,bv:-0.02},
    {pos:{ra:5.411961,dec:-0.583498},mag: 5.47,bv: 1.12},
    {pos:{ra:5.404114,dec: 0.420906},mag: 5.04,bv:-0.14},
    {pos:{ra:5.406724,dec: 0.176036},mag: 5.05,bv: 0.72},
    {pos:{ra:5.407968,dec: 0.008489},mag: 5.16,bv: 1.06},
    {pos:{ra:5.410739,dec:-0.316578},mag: 5.10,bv: 1.66},
    {pos:{ra:5.359222,dec: 1.421096},mag: 5.46,bv: 1.02},
    {pos:{ra:5.408943,dec: 0.277716},mag: 3.77,bv:-0.06},
    {pos:{ra:5.432156,dec:-1.155461},mag: 3.42,bv: 0.16},
    {pos:{ra:5.428141,dec:-0.906194},mag: 4.51,bv: 0.27},
    {pos:{ra:5.416768,dec: 0.790290},mag: 1.25,bv: 0.09},
    {pos:{ra:5.425611,dec: 0.263099},mag: 4.43,bv: 0.32},
    {pos:{ra:5.420164,dec: 0.878599},mag: 5.39,bv:-0.10},
    {pos:{ra:5.438162,dec:-0.684155},mag: 5.50,bv:-0.10},
    {pos:{ra:5.451107,dec:-1.200374},mag: 5.41,bv: 1.12},
    {pos:{ra:5.437115,dec:-0.441059},mag: 4.14,bv: 0.43},
    {pos:{ra:5.431792,dec: 0.441054},mag: 4.91,bv: 1.18},
    {pos:{ra:5.435225,dec: 0.536160},mag: 4.22,bv: 1.05},
    {pos:{ra:5.447551,dec:-0.767746},mag: 5.11,bv: 0.35},
    {pos:{ra:5.439515,dec: 0.281425},mag: 5.14,bv: 0.49},
    {pos:{ra:5.439573,dec: 0.281420},mag: 4.27,bv: 1.04},
    {pos:{ra:5.437624,dec: 0.592893},mag: 2.46,bv: 1.03},
    {pos:{ra:5.444016,dec:-0.165734},mag: 3.77,bv: 0.00},
    {pos:{ra:5.444278,dec:-0.087751},mag: 4.42,bv: 1.65},
    {pos:{ra:5.451900,dec:-0.806812},mag: 4.89,bv: 1.52},
    {pos:{ra:5.433872,dec: 1.004956},mag: 4.51,bv: 0.54},
    {pos:{ra:5.441849,dec: 0.599942},mag: 4.92,bv: 1.32},
    {pos:{ra:5.433603,dec: 1.079292},mag: 3.43,bv: 0.92},
    {pos:{ra:5.442846,dec: 0.636885},mag: 4.53,bv:-0.11},
    {pos:{ra:5.454016,dec:-0.589567},mag: 4.90,bv: 1.00},
    {pos:{ra:5.460706,dec:-0.900735},mag: 5.05,bv: 1.13},
    {pos:{ra:5.449522,dec: 0.804844},mag: 4.84,bv: 0.41},
    {pos:{ra:5.462102,dec:-0.469828},mag: 4.11,bv: 1.64},
    {pos:{ra:5.454510,dec: 0.768982},mag: 5.04,bv: 0.20},
    {pos:{ra:5.475142,dec:-1.020218},mag: 3.65,bv: 1.25},
    {pos:{ra:5.470167,dec:-0.694816},mag: 5.35,bv: 1.32},
    {pos:{ra:5.465731,dec:-0.156789},mag: 4.73,bv: 0.32},
    {pos:{ra:5.463440,dec: 0.472931},mag: 4.59,bv: 0.83},
    {pos:{ra:5.468320,dec: 0.774703},mag: 4.78,bv:-0.14},
    {pos:{ra:5.468596,dec: 0.788574},mag: 5.45,bv: 1.10},
    {pos:{ra:5.471164,dec: 0.583599},mag: 5.47,bv: 1.52},
    {pos:{ra:5.474051,dec: 0.489696},mag: 5.01,bv: 1.48},
    {pos:{ra:5.478640,dec: 0.239483},mag: 5.17,bv: 1.12},
    {pos:{ra:5.443493,dec: 1.405902},mag: 5.39,bv: 1.12},
    {pos:{ra:5.518367,dec:-1.344320},mag: 5.15,bv: 0.49},
    {pos:{ra:5.485454,dec: 0.718504},mag: 3.94,bv: 0.02},
    {pos:{ra:5.490944,dec: 0.189179},mag: 5.48,bv: 0.93},
    {pos:{ra:5.490253,dec: 0.389659},mag: 5.31,bv: 1.40},
    {pos:{ra:5.493744,dec: 0.074938},mag: 5.23,bv: 0.46},
    {pos:{ra:5.503423,dec:-0.563004},mag: 4.67,bv: 0.89},
    {pos:{ra:5.497031,dec: 0.829400},mag: 4.74,bv:-0.05},
    {pos:{ra:5.510732,dec:-0.674250},mag: 5.30,bv: 0.41},
    {pos:{ra:5.502943,dec: 0.805571},mag: 5.37,bv:-0.21},
    {pos:{ra:5.520637,dec:-0.955170},mag: 5.16,bv: 1.21},
    {pos:{ra:5.517007,dec:-0.346535},mag: 4.84,bv: 0.17},
    {pos:{ra:5.523735,dec:-0.300769},mag: 4.07,bv:-0.01},
    {pos:{ra:5.525764,dec:-0.564469},mag: 5.18,bv: 1.10},
    {pos:{ra:5.519306,dec: 0.766684},mag: 3.72,bv: 1.65},
    {pos:{ra:5.528890,dec:-0.436434},mag: 4.50,bv: 1.61},
    {pos:{ra:5.527938,dec: 0.676242},mag: 5.21,bv: 1.18},
    {pos:{ra:5.535137,dec:-0.369898},mag: 5.30,bv: 0.01},
    {pos:{ra:5.526592,dec: 0.831620},mag: 4.55,bv: 1.57},
    {pos:{ra:5.556001,dec:-1.223936},mag: 5.02,bv: 1.58},
    {pos:{ra:5.539653,dec:-0.198473},mag: 4.51,bv: 0.94},
    {pos:{ra:5.542911,dec: 0.176831},mag: 4.69,bv: 0.26},
    {pos:{ra:5.554736,dec:-0.688101},mag: 5.26,bv: 0.44},
    {pos:{ra:5.555768,dec:-0.482050},mag: 5.42,bv: 1.42},
    {pos:{ra:5.554234,dec: 0.527560},mag: 3.20,bv: 0.99},
    {pos:{ra:5.560976,dec: 0.174654},mag: 4.49,bv: 0.50},
    {pos:{ra:5.565993,dec:-0.360440},mag: 5.24,bv: 1.17},
    {pos:{ra:5.566502,dec:-0.264791},mag: 5.28,bv: 1.64},
    {pos:{ra:5.562328,dec: 0.664020},mag: 3.72,bv: 0.39},
    {pos:{ra:5.566830,dec: 0.091591},mag: 3.92,bv: 0.53},
    {pos:{ra:5.576058,dec:-0.561516},mag: 4.71,bv: 0.06},
    {pos:{ra:5.576130,dec:-0.313902},mag: 5.43,bv:-0.12},
    {pos:{ra:5.584472,dec:-0.932874},mag: 4.39,bv: 0.19},
    {pos:{ra:5.573781,dec: 0.687568},mag: 4.23,bv: 0.12},
    {pos:{ra:5.575971,dec: 0.609067},mag: 4.43,bv:-0.11},
    {pos:{ra:5.588370,dec:-0.712264},mag: 4.82,bv: 0.02},
    {pos:{ra:5.578305,dec: 0.766999},mag: 5.00,bv:-0.01},
    {pos:{ra:5.578858,dec: 1.092324},mag: 2.44,bv: 0.22},
    {pos:{ra:5.594857,dec:-0.293816},mag: 4.28,bv: 0.90},
    {pos:{ra:5.582304,dec: 1.132229},mag: 5.18,bv:-0.04},
    {pos:{ra:5.594158,dec: 0.345653},mag: 4.08,bv: 1.11},
    {pos:{ra:5.597678,dec: 0.118876},mag: 5.16,bv: 0.05},
    {pos:{ra:5.613168,dec:-1.140854},mag: 4.22,bv: 0.49},
    {pos:{ra:5.603205,dec:-0.363935},mag: 5.41,bv: 1.16},
    {pos:{ra:5.603343,dec:-0.224764},mag: 5.49,bv: 0.29},
    {pos:{ra:5.623225,dec:-1.213096},mag: 5.34,bv: 1.55},
    {pos:{ra:5.608107,dec:-0.062076},mag: 5.49,bv: 1.46},
    {pos:{ra:5.614142,dec:-0.391153},mag: 3.74,bv: 1.00},
    {pos:{ra:5.623116,dec:-0.380608},mag: 4.51,bv: 0.91},
    {pos:{ra:5.617153,dec: 0.647808},mag: 5.31,bv:-0.14},
    {pos:{ra:5.614986,dec: 0.852332},mag: 5.31,bv: 0.07},
    {pos:{ra:5.618513,dec: 0.481861},mag: 5.41,bv: 0.04},
    {pos:{ra:5.628461,dec: 0.412576},mag: 4.57,bv: 1.62},
    {pos:{ra:5.618949,dec: 1.166040},mag: 5.44,bv:-0.11},
    {pos:{ra:5.626287,dec: 0.812286},mag: 5.24,bv: 0.97},
    {pos:{ra:5.637843,dec:-0.718712},mag: 5.29,bv: 1.10},
    {pos:{ra:5.635486,dec:-0.097234},mag: 2.91,bv: 0.83},
    {pos:{ra:5.622840,dec: 1.231519},mag: 3.23,bv:-0.22},
    {pos:{ra:5.646060,dec: 0.795730},mag: 4.02,bv: 0.89},
    {pos:{ra:5.678756,dec:-1.350710},mag: 3.76,bv: 1.00},
    {pos:{ra:5.649529,dec: 0.672548},mag: 4.90,bv: 1.08},
    {pos:{ra:5.659579,dec:-0.339748},mag: 4.68,bv:-0.17},
    {pos:{ra:5.662510,dec:-0.137081},mag: 4.69,bv: 0.17},
    {pos:{ra:5.659012,dec: 0.705351},mag: 5.01,bv: 0.18},
    {pos:{ra:5.662532,dec: 0.337173},mag: 5.45,bv: 0.30},
    {pos:{ra:5.670378,dec: 0.039158},mag: 5.10,bv: 1.04},
    {pos:{ra:5.672720,dec:-0.290811},mag: 3.68,bv: 0.32},
    {pos:{ra:5.663244,dec: 1.083534},mag: 4.73,bv: 0.30},
    {pos:{ra:5.719902,dec:-1.443722},mag: 5.29,bv: 0.75},
    {pos:{ra:5.679076,dec:-0.245175},mag: 5.18,bv: 0.65},
    {pos:{ra:5.673127,dec: 0.755272},mag: 5.11,bv: 1.60},
    {pos:{ra:5.681105,dec:-0.406012},mag: 5.24,bv: 0.95},
    {pos:{ra:5.683919,dec:-0.329281},mag: 4.73,bv: 0.88},
    {pos:{ra:5.682174,dec: 0.099135},mag: 5.30,bv: 1.64},
    {pos:{ra:5.681461,dec: 0.893429},mag: 4.67,bv:-0.12},
    {pos:{ra:5.693904,dec:-0.576410},mag: 4.34,bv:-0.05},
    {pos:{ra:5.685875,dec: 0.718290},mag: 5.49,bv: 1.59},
    {pos:{ra:5.690588,dec: 0.172351},mag: 2.39,bv: 1.53},
    {pos:{ra:5.690399,dec: 0.501656},mag: 4.73,bv: 0.48},
    {pos:{ra:5.694159,dec:-0.158520},mag: 5.09,bv: 1.11},
    {pos:{ra:5.692006,dec: 0.302815},mag: 4.34,bv: 1.17},
    {pos:{ra:5.692588,dec: 0.447590},mag: 4.13,bv: 0.43},
    {pos:{ra:5.687621,dec: 1.025905},mag: 4.08,bv: 2.35},
    {pos:{ra:5.680705,dec: 1.244619},mag: 4.56,bv: 1.10},
    {pos:{ra:5.698820,dec: 0.400534},mag: 5.29,bv: 1.41},
    {pos:{ra:5.703038,dec:-0.281473},mag: 2.87,bv: 0.29},
    {pos:{ra:5.685701,dec: 1.262227},mag: 5.17,bv: 1.05},
    {pos:{ra:5.706078,dec:-0.539278},mag: 5.01,bv: 0.04},
    {pos:{ra:5.696093,dec: 1.066760},mag: 4.29,bv: 0.52},
    {pos:{ra:5.701962,dec: 0.860612},mag: 4.23,bv:-0.12},
    {pos:{ra:5.715277,dec: 0.526639},mag: 5.04,bv:-0.03},
    {pos:{ra:5.716586,dec: 0.301690},mag: 5.29,bv: 0.37},
    {pos:{ra:5.730338,dec:-0.236521},mag: 5.08,bv: 0.37},
    {pos:{ra:5.733094,dec:-0.652142},mag: 3.01,bv:-0.12},
    {pos:{ra:5.729320,dec: 0.452477},mag: 5.08,bv:-0.17},
    {pos:{ra:5.743791,dec:-0.650198},mag: 5.46,bv: 0.08},
    {pos:{ra:5.750504,dec:-0.959800},mag: 4.40,bv: 0.28},
    {pos:{ra:5.756525,dec:-0.670124},mag: 5.50,bv: 1.00},
    {pos:{ra:5.744977,dec: 1.110475},mag: 4.91,bv: 1.77},
    {pos:{ra:5.763237,dec:-0.496609},mag: 5.42,bv:-0.09},
    {pos:{ra:5.774247,dec:-0.991105},mag: 4.69,bv: 1.06},
    {pos:{ra:5.756314,dec: 1.277232},mag: 5.03,bv: 0.44},
    {pos:{ra:5.774051,dec:-0.037617},mag: 4.69,bv:-0.06},
    {pos:{ra:5.780487,dec:-0.015824},mag: 5.30,bv: 0.23},
    {pos:{ra:5.786268,dec:-0.690161},mag: 4.46,bv: 1.37},
    {pos:{ra:5.784370,dec: 0.088289},mag: 4.84,bv: 1.44},
    {pos:{ra:5.784821,dec:-0.005580},mag: 2.96,bv: 0.98},
    {pos:{ra:5.776524,dec: 1.101647},mag: 5.29,bv: 1.58},
    {pos:{ra:5.776124,dec: 1.127967},mag: 4.29,bv: 0.34},
    {pos:{ra:5.787672,dec:-0.242072},mag: 4.27,bv:-0.07},
    {pos:{ra:5.785912,dec: 0.785650},mag: 5.14,bv: 1.57},
    {pos:{ra:5.795511,dec:-0.819626},mag: 1.74,bv:-0.13},
    {pos:{ra:5.781439,dec: 1.095815},mag: 5.27,bv: 1.41},
    {pos:{ra:5.782051,dec: 1.086991},mag: 5.11,bv: 0.08},
    {pos:{ra:5.790181,dec: 0.442354},mag: 3.76,bv: 0.44},
    {pos:{ra:5.796166,dec:-0.575760},mag: 4.50,bv: 0.05},
    {pos:{ra:5.796384,dec:-0.594178},mag: 4.99,bv: 1.48},
    {pos:{ra:5.802907,dec:-0.593669},mag: 5.37,bv: 0.24},
    {pos:{ra:5.803860,dec:-0.568076},mag: 4.92,bv: 0.48},
    {pos:{ra:5.804092,dec: 0.108172},mag: 3.53,bv: 0.08},
    {pos:{ra:5.805947,dec:-0.201847},mag: 5.46,bv:-0.12},
    {pos:{ra:5.803162,dec: 0.579071},mag: 4.29,bv: 0.46},
    {pos:{ra:5.808303,dec: 0.887034},mag: 5.40,bv: 0.15},
    {pos:{ra:5.806951,dec: 1.015801},mag: 3.35,bv: 1.57},
    {pos:{ra:5.802376,dec: 1.262591},mag: 4.79,bv: 0.92},
    {pos:{ra:5.809816,dec: 1.036978},mag: 5.04,bv: 0.25},
    {pos:{ra:5.811132,dec: 0.992035},mag: 5.24,bv: 0.51},
    {pos:{ra:5.806049,dec: 1.224048},mag: 5.50,bv: 0.38},
    {pos:{ra:5.815423,dec: 0.603966},mag: 5.33,bv: 1.13},
    {pos:{ra:5.822040,dec:-0.484625},mag: 5.43,bv:-0.16},
    {pos:{ra:5.812085,dec: 1.060452},mag: 5.35,bv: 1.17},
    {pos:{ra:5.821982,dec:-0.367814},mag: 5.32,bv: 0.80},
    {pos:{ra:5.846962,dec:-1.403938},mag: 5.10,bv: 1.47},
    {pos:{ra:5.820142,dec: 0.693157},mag: 4.49,bv: 1.39},
    {pos:{ra:5.827720,dec:-0.721635},mag: 4.79,bv: 0.80},
    {pos:{ra:5.831334,dec:-0.726537},mag: 5.10,bv: 0.92},
    {pos:{ra:5.825182,dec: 0.995599},mag: 4.19,bv: 0.28},
    {pos:{ra:5.832898,dec:-0.223950},mag: 5.34,bv: 1.14},
    {pos:{ra:5.829269,dec: 0.658842},mag: 4.13,bv: 1.46},
    {pos:{ra:5.833036,dec:-0.135845},mag: 4.16,bv: 0.98},
    {pos:{ra:5.839261,dec:-0.935981},mag: 5.37,bv: 0.60},
    {pos:{ra:5.840315,dec:-1.051731},mag: 2.86,bv: 1.39},
    {pos:{ra:5.847718,dec:-0.136504},mag: 5.37,bv:-0.06},
    {pos:{ra:5.848860,dec: 0.101045},mag: 5.37,bv:-0.02},
    {pos:{ra:5.866982,dec:-1.261097},mag: 5.29,bv: 0.65},
    {pos:{ra:5.853805,dec:-0.376962},mag: 5.13,bv: 1.07},
    {pos:{ra:5.854082,dec:-0.024212},mag: 3.84,bv:-0.05},
    {pos:{ra:5.853478,dec: 0.213022},mag: 5.01,bv:-0.13},
    {pos:{ra:5.852620,dec: 0.494461},mag: 4.81,bv: 0.00},
    {pos:{ra:5.851333,dec: 0.812218},mag: 4.57,bv:-0.10},
    {pos:{ra:5.868408,dec:-1.008752},mag: 5.32,bv: 0.67},
    {pos:{ra:5.862386,dec: 0.911571},mag: 4.43,bv: 1.02},
    {pos:{ra:5.869877,dec: 0.024042},mag: 4.66,bv:-0.03},
    {pos:{ra:5.878850,dec:-1.133877},mag: 4.48,bv:-0.03},
    {pos:{ra:5.866560,dec: 0.863526},mag: 4.57,bv: 0.09},
    {pos:{ra:5.817080,dec: 1.502869},mag: 5.27,bv:-0.03},
    {pos:{ra:5.881142,dec: 0.081953},mag: 4.79,bv: 1.05},
    {pos:{ra:5.884610,dec:-0.682981},mag: 5.47,bv: 0.95},
    {pos:{ra:5.887301,dec:-0.759141},mag: 3.97,bv: 1.03},
    {pos:{ra:5.873091,dec: 1.235184},mag: 5.47,bv: 1.20},
    {pos:{ra:5.885374,dec:-0.000354},mag: 4.59,bv: 0.00},
    {pos:{ra:5.885403,dec:-0.000349},mag: 4.42,bv: 0.38},
    {pos:{ra:5.889432,dec:-0.763572},mag: 4.11,bv: 1.57},
    {pos:{ra:5.877782,dec: 1.136772},mag: 5.46,bv: 0.37},
    {pos:{ra:5.890341,dec: 0.077347},mag: 5.48,bv: 0.38},
    {pos:{ra:5.886872,dec: 1.019539},mag: 3.75,bv: 0.60},
    {pos:{ra:5.888435,dec: 0.832643},mag: 4.36,bv: 1.68},
    {pos:{ra:5.893308,dec:-0.186367},mag: 4.82,bv:-0.06},
    {pos:{ra:5.897053,dec:-0.564546},mag: 4.29,bv: 0.01},
    {pos:{ra:5.892617,dec: 0.752644},mag: 4.51,bv:-0.09},
    {pos:{ra:5.903584,dec:-1.081794},mag: 4.81,bv: 1.61},
    {pos:{ra:5.896122,dec: 0.877595},mag: 3.77,bv: 0.01},
    {pos:{ra:5.889970,dec: 1.375741},mag: 5.50,bv: 0.06},
    {pos:{ra:5.910965,dec:-0.361429},mag: 5.20,bv: 0.44},
    {pos:{ra:5.913859,dec:-0.002051},mag: 4.02,bv:-0.09},
    {pos:{ra:5.924331,dec:-0.073793},mag: 5.03,bv: 1.14},
    {pos:{ra:5.922658,dec: 0.899635},mag: 4.63,bv: 0.24},
    {pos:{ra:5.915655,dec: 1.285314},mag: 5.08,bv: 0.39},
    {pos:{ra:5.928149,dec: 0.991274},mag: 5.21,bv: 1.58},
    {pos:{ra:5.930898,dec: 0.681556},mag: 4.88,bv:-0.20},
    {pos:{ra:5.928229,dec: 1.109758},mag: 5.19,bv: 0.06},
    {pos:{ra:5.936985,dec:-0.472000},mag: 4.17,bv:-0.11},
    {pos:{ra:5.960539,dec:-1.420378},mag: 4.15,bv: 0.20},
    {pos:{ra:5.936367,dec: 0.772769},mag: 4.46,bv: 1.33},
    {pos:{ra:5.940497,dec: 0.189043},mag: 3.40,bv:-0.09},
    {pos:{ra:5.945762,dec:-0.818293},mag: 2.10,bv: 1.60},
    {pos:{ra:5.940563,dec: 0.702068},mag: 5.25,bv:-0.14},
    {pos:{ra:5.941784,dec: 0.511512},mag: 4.79,bv:-0.01},
    {pos:{ra:5.949391,dec:-0.722818},mag: 4.85,bv: 1.03},
    {pos:{ra:5.949777,dec:-0.328650},mag: 4.69,bv: 1.37},
    {pos:{ra:5.947217,dec: 0.527463},mag: 2.94,bv: 0.86},
    {pos:{ra:5.958692,dec:-0.933756},mag: 4.85,bv: 1.18},
    {pos:{ra:5.951972,dec: 0.729882},mag: 5.08,bv: 0.96},
    {pos:{ra:5.979418,dec:-1.398430},mag: 5.35,bv:-0.15},
    {pos:{ra:5.963325,dec: 0.212455},mag: 4.19,bv: 0.50},
    {pos:{ra:5.962619,dec: 0.411297},mag: 3.95,bv: 1.07},
    {pos:{ra:5.967070,dec:-0.342317},mag: 5.26,bv: 0.94},
    {pos:{ra:5.971447,dec:-0.895650},mag: 3.49,bv: 0.08},
    {pos:{ra:5.975971,dec:-0.237234},mag: 4.01,bv: 1.57},
    {pos:{ra:5.977767,dec: 0.429380},mag: 3.48,bv: 0.93},
    {pos:{ra:5.982276,dec:-0.683418},mag: 5.42,bv: 1.43},
    {pos:{ra:5.976749,dec: 0.975688},mag: 5.43,bv: 1.17},
    {pos:{ra:5.976357,dec: 1.155418},mag: 3.52,bv: 1.05},
    {pos:{ra:5.988777,dec:-0.573787},mag: 4.46,bv:-0.04},
    {pos:{ra:5.988232,dec: 0.171663},mag: 5.16,bv: 0.48},
    {pos:{ra:5.989163,dec:-0.132291},mag: 3.74,bv: 1.64},
    {pos:{ra:5.986625,dec: 0.755946},mag: 4.94,bv: 1.56},
    {pos:{ra:5.966772,dec: 1.451309},mag: 4.74,bv: 1.26},
    {pos:{ra:5.998042,dec:-0.276126},mag: 3.27,bv: 0.05},
    {pos:{ra:6.000566,dec: 0.153865},mag: 4.90,bv: 0.00},
    {pos:{ra:6.003707,dec:-0.567925},mag: 4.21,bv: 0.97},
    {pos:{ra:6.005824,dec: 0.868015},mag: 4.95,bv: 1.78},
    {pos:{ra:6.011139,dec:-0.517005},mag: 1.16,bv: 0.09},
    {pos:{ra:6.010325,dec: 0.362485},mag: 5.49,bv: 0.67},
    {pos:{ra:6.008623,dec: 0.849699},mag: 5.43,bv:-0.09},
    {pos:{ra:6.019015,dec: 0.016804},mag: 5.43,bv: 0.98},
    {pos:{ra:6.025226,dec:-0.920734},mag: 4.12,bv: 0.98},
    {pos:{ra:5.997009,dec: 1.472117},mag: 4.71,bv: 1.43},
    {pos:{ra:6.021757,dec: 0.993883},mag: 5.00,bv: 1.42},
    {pos:{ra:6.029771,dec: 0.738730},mag: 3.62,bv:-0.09},
    {pos:{ra:6.032753,dec: 0.746264},mag: 5.10,bv: 0.09},
    {pos:{ra:6.036643,dec:-0.606492},mag: 5.11,bv: 0.29},
    {pos:{ra:6.038301,dec: 0.066672},mag: 4.53,bv:-0.12},
    {pos:{ra:6.041719,dec:-0.941867},mag: 5.37,bv: 1.45},
    {pos:{ra:6.037858,dec: 0.490137},mag: 2.42,bv: 1.67},
    {pos:{ra:6.036869,dec: 1.173021},mag: 5.24,bv: 1.26},
    {pos:{ra:6.039639,dec: 0.873576},mag: 4.65,bv: 1.06},
    {pos:{ra:6.042162,dec: 0.265382},mag: 2.49,bv:-0.04},
    {pos:{ra:6.043915,dec:-0.134279},mag: 5.43,bv: 0.30},
    {pos:{ra:6.051405,dec:-0.759577},mag: 4.28,bv: 0.42},
    {pos:{ra:6.050540,dec:-0.414394},mag: 4.47,bv: 0.90},
    {pos:{ra:6.051951,dec: 0.164226},mag: 4.52,bv: 1.57},
    {pos:{ra:6.052423,dec: 0.444506},mag: 4.76,bv: 1.34},
    {pos:{ra:6.050249,dec: 1.037070},mag: 4.85,bv:-0.03},
    {pos:{ra:6.054787,dec: 0.809610},mag: 5.33,bv: 1.41},
    {pos:{ra:6.059267,dec: 0.037137},mag: 5.40,bv: 0.91},
    {pos:{ra:6.062605,dec:-0.369530},mag: 3.66,bv: 1.22},
    {pos:{ra:6.062947,dec: 0.151446},mag: 5.12,bv: 1.47},
    {pos:{ra:6.064641,dec:-0.391957},mag: 4.69,bv: 0.65},
    {pos:{ra:6.055849,dec: 1.315760},mag: 4.41,bv: 0.80},
    {pos:{ra:6.066590,dec:-0.789703},mag: 3.90,bv: 1.02},
    {pos:{ra:6.065128,dec: 0.171425},mag: 5.39,bv:-0.08},
    {pos:{ra:6.072597,dec: 0.152193},mag: 5.16,bv: 0.13},
    {pos:{ra:6.076146,dec: 0.862304},mag: 4.52,bv: 0.29},
    {pos:{ra:6.083883,dec:-0.105573},mag: 4.22,bv: 1.56},
    {pos:{ra:6.090726,dec:-0.158612},mag: 4.21,bv: 1.11},
    {pos:{ra:6.097439,dec:-1.016407},mag: 3.99,bv: 0.40},
    {pos:{ra:6.094901,dec:-0.134856},mag: 5.06,bv: 1.60},
    {pos:{ra:6.096282,dec: 0.057286},mag: 3.69,bv: 0.92},
    {pos:{ra:6.099504,dec:-0.160265},mag: 4.39,bv:-0.15},
    {pos:{ra:6.098813,dec: 0.855478},mag: 4.85,bv: 1.67},
    {pos:{ra:6.143828,dec:-1.526853},mag: 5.49,bv: 1.27},
    {pos:{ra:6.103518,dec:-0.567790},mag: 4.41,bv: 1.13},
    {pos:{ra:6.104122,dec:-0.167741},mag: 4.98,bv:-0.02},
    {pos:{ra:6.104776,dec:-0.234902},mag: 5.08,bv: 0.80},
    {pos:{ra:6.102653,dec: 1.188773},mag: 4.75,bv: 0.84},
    {pos:{ra:6.106456,dec: 0.848671},mag: 5.44,bv: 1.03},
    {pos:{ra:6.110150,dec: 0.093923},mag: 5.05,bv: 1.20},
    {pos:{ra:6.111430,dec: 0.414346},mag: 4.60,bv: 0.17},
    {pos:{ra:6.117008,dec: 0.555233},mag: 5.32,bv:-0.11},
    {pos:{ra:6.120230,dec:-0.262483},mag: 5.20,bv: 0.20},
    {pos:{ra:6.121612,dec:-0.350821},mag: 3.97,bv: 1.10},
    {pos:{ra:6.122077,dec: 0.214918},mag: 5.08,bv: 1.31},
    {pos:{ra:6.129764,dec: 1.087040},mag: 4.98,bv: 1.68},
    {pos:{ra:6.132127,dec: 0.408480},mag: 4.40,bv: 0.61},
    {pos:{ra:6.135036,dec:-0.360270},mag: 4.39,bv: 1.47},
    {pos:{ra:6.138905,dec: 0.021914},mag: 4.94,bv: 0.03},
    {pos:{ra:6.143421,dec: 0.111333},mag: 4.28,bv: 1.07},
    {pos:{ra:6.148599,dec: 0.222714},mag: 4.55,bv: 0.94},
    {pos:{ra:6.152431,dec: 1.021871},mag: 4.91,bv:-0.12},
    {pos:{ra:6.157914,dec: 0.684804},mag: 5.22,bv: 1.02},
    {pos:{ra:6.165252,dec:-0.660054},mag: 4.37,bv:-0.09},
    {pos:{ra:6.166583,dec:-0.365026},mag: 4.71,bv: 0.02},
    {pos:{ra:6.167419,dec: 0.392680},mag: 5.32,bv: 1.60},
    {pos:{ra:6.169535,dec: 0.546729},mag: 4.98,bv: 1.38},
    {pos:{ra:6.174437,dec:-0.743772},mag: 4.71,bv: 0.08},
    {pos:{ra:6.186538,dec:-0.793994},mag: 4.74,bv: 0.08},
    {pos:{ra:6.185294,dec: 0.810846},mag: 3.82,bv: 1.01},
    {pos:{ra:6.187788,dec: 0.755170},mag: 4.29,bv:-0.10},
    {pos:{ra:6.192159,dec: 0.880897},mag: 5.30,bv:-0.06},
    {pos:{ra:6.194981,dec:-0.248215},mag: 5.00,bv: 0.24},
    {pos:{ra:6.195701,dec: 0.098199},mag: 4.13,bv: 0.51},
    {pos:{ra:6.193068,dec: 1.354943},mag: 3.21,bv: 1.03},
    {pos:{ra:6.198697,dec:-0.559780},mag: 5.31,bv: 0.97},
    {pos:{ra:6.197701,dec: 0.773772},mag: 4.14,bv:-0.08},
    {pos:{ra:6.202791,dec:-0.314634},mag: 5.34,bv: 1.57},
    {pos:{ra:6.203613,dec:-0.310955},mag: 4.82,bv: 0.82},
    {pos:{ra:6.204849,dec: 0.031067},mag: 4.50,bv: 0.20},
    {pos:{ra:6.206675,dec:-0.269615},mag: 5.28,bv: 1.37},
    {pos:{ra:6.207794,dec:-0.253858},mag: 4.49,bv:-0.04},
    {pos:{ra:6.210638,dec: 0.180317},mag: 5.06,bv: 1.68},
    {pos:{ra:6.213336,dec: 0.512458},mag: 4.93,bv: 0.95},
    {pos:{ra:6.214252,dec:-0.318993},mag: 5.24,bv:-0.08},
    {pos:{ra:6.222164,dec:-0.325994},mag: 5.29,bv: 0.28},
    {pos:{ra:6.222251,dec: 0.810187},mag: 4.95,bv: 1.11},
    {pos:{ra:6.223808,dec: 0.060854},mag: 5.04,bv: 2.60},
    {pos:{ra:6.227626,dec:-0.876621},mag: 5.18,bv:-0.19},
    {pos:{ra:6.226717,dec: 1.023670},mag: 4.87,bv: 1.11},
    {pos:{ra:6.230571,dec:-0.048200},mag: 5.49,bv: 0.94},
    {pos:{ra:6.230447,dec: 1.183454},mag: 5.04,bv:-0.01},
    {pos:{ra:6.234869,dec:-0.490966},mag: 4.57,bv: 0.01},
    {pos:{ra:6.234476,dec: 1.085847},mag: 5.43,bv: 0.67},
    {pos:{ra:6.245464,dec:-0.330022},mag: 5.18,bv:-0.14},
    {pos:{ra:6.248744,dec:-1.431500},mag: 5.11,bv: 0.92},
    {pos:{ra:6.250410,dec: 0.333712},mag: 5.08,bv: 1.60},
    {pos:{ra:6.250977,dec: 0.191070},mag: 5.30,bv: 0.18},
    {pos:{ra:6.258678,dec: 1.003555},mag: 4.54,bv: 1.22},
    {pos:{ra:6.272655,dec:-1.122218},mag: 5.00,bv: 0.06},
    {pos:{ra:6.273404,dec: 0.438800},mag: 4.66,bv: 1.59},
    {pos:{ra:6.276262,dec: 0.896900},mag: 4.80,bv: 1.83},
    {pos:{ra:6.277397,dec:-0.062066},mag: 4.86,bv: 0.93},
    {pos:{ra:6.278517,dec:-0.920588},mag: 5.13,bv: 1.13},
    {pos:{ra:6.278858,dec: 0.973108},mag: 4.88,bv:-0.07},
    {pos:{ra:6.280182,dec: 0.119788},mag: 4.01,bv: 0.42},
    {pos:{ra:6.282822,dec:-1.144538},mag: 4.50,bv:-0.08},
    {pos:{ra:0.006960,dec:-1.345052},mag: 4.78,bv: 1.27},
    {pos:{ra:0.007956,dec:-0.052840},mag: 5.10,bv:-0.12},
    {pos:{ra:0.008552,dec:-0.104967},mag: 4.41,bv: 1.63},
    {pos:{ra:0.010174,dec:-0.518717},mag: 5.01,bv:-0.15},
    {pos:{ra:0.016319,dec:-0.302572},mag: 4.55,bv:-0.05},
    {pos:{ra:0.019642,dec:-0.183424},mag: 4.94,bv: 1.63}];

var starname = [
    {pos:{ra:1.767793,dec:-0.291751},label:"Sirius"},
    {pos:{ra:1.675305,dec:-0.919716},label:"Canopus"},
    {pos:{ra:3.733528,dec: 0.334798},label:"Arcturus"},
    {pos:{ra:3.837972,dec:-1.061776},label:"Rigil Kent"},
    {pos:{ra:4.873563,dec: 0.676902},label:"Vega"},
    {pos:{ra:1.381821,dec: 0.802818},label:"Capella"},
    {pos:{ra:1.372432,dec:-0.143146},label:"Rigel"},
    {pos:{ra:2.004081,dec: 0.091193},label:"Procyon"},
    {pos:{ra:0.426362,dec:-0.998968},label:"Achernar"},
    {pos:{ra:1.549729,dec: 0.129276},label:"Betelgeuse"},
    {pos:{ra:3.681874,dec:-1.053709},label:"Hadar"},
    {pos:{ra:5.195773,dec: 0.154782},label:"Altair"},
    {pos:{ra:1.203928,dec: 0.288139},label:"Aldebaran"},
    {pos:{ra:4.317101,dec:-0.461324},label:"Antares"},
    {pos:{ra:3.513319,dec:-0.194803},label:"Spica"},
    {pos:{ra:2.030320,dec: 0.489148},label:"Pollux"},
    {pos:{ra:6.011139,dec:-0.517005},label:"Fomalhaut"},
    {pos:{ra:5.416768,dec: 0.790290},label:"Deneb"},
    {pos:{ra:3.349810,dec:-1.041763},label:"Mimosa"},
    {pos:{ra:3.257650,dec:-1.101288},label:"Acrux"},
    {pos:{ra:2.654522,dec: 0.208867},label:"Regulus"},
    {pos:{ra:1.826596,dec:-0.505661},label:"Adhara"},
    {pos:{ra:4.597234,dec:-0.647585},label:"Shaula"},
    {pos:{ra:1.418655,dec: 0.110824},label:"Bellatrix"},
    {pos:{ra:1.423716,dec: 0.499295},label:"Alnath"},
    {pos:{ra:5.795511,dec:-0.819626},label:"Alnair"},
    {pos:{ra:0.891529,dec: 0.870241},label:"Mirphak"},
    {pos:{ra:2.896061,dec: 1.077755},label:"Dubhe"},
    {pos:{ra:3.610824,dec: 0.860680},label:"Alkaid"},
    {pos:{ra:5.347900,dec:-0.990213},label:"Peacock"},
    {pos:{ra:1.983567,dec: 0.556556},label:"Castor"},
    {pos:{ra:2.476564,dec:-0.151121},label:"Alphard"},
    {pos:{ra:0.554898,dec: 0.409498},label:"Hamal"},
    {pos:{ra:4.953528,dec:-0.458963},label:"Nunki"},
    {pos:{ra:0.662403,dec: 1.557954},label:"Polaris"},
    {pos:{ra:0.190197,dec:-0.313927},label:"Diphda"},
    {pos:{ra:0.036601,dec: 0.507726},label:"Alpheratz"},
    {pos:{ra:4.603022,dec: 0.219213},label:"Rasalhague"},
    {pos:{ra:0.821039,dec: 0.714809},label:"Algol"},
    {pos:{ra:3.093858,dec: 0.254328},label:"Denebola"},
    {pos:{ra:0.176751,dec: 0.986761},label:"Shedir"},
    {pos:{ra:4.078347,dec: 0.466260},label:"Alphekka"},
    {pos:{ra:4.697583,dec: 0.898651},label:"Etamin"},
    {pos:{ra:0.540616,dec: 0.738793},label:"Almaak"},
    {pos:{ra:3.507785,dec: 0.958627},label:"Mizar"},
    {pos:{ra:0.114683,dec:-0.738381},label:"Ankaa"},
    {pos:{ra:6.037858,dec: 0.490137},label:"Scheat"},
    {pos:{ra:5.578858,dec: 1.092324},label:"Alderamin"},
    {pos:{ra:6.042162,dec: 0.265382},label:"Markab"}];

var conname = [
    {pos:{ra:6.278,dec: 0.654},abbrev:"And",name:"Andromeda"},
    {pos:{ra:2.691,dec:-0.567},abbrev:"Ant",name:"Antlia"},
    {pos:{ra:4.213,dec:-1.315},abbrev:"Aps",name:"Apus"},
    {pos:{ra:5.148,dec: 0.061},abbrev:"Aql",name:"Aquila"},
    {pos:{ra:5.837,dec:-0.188},abbrev:"Aqr",name:"Aquarius"},
    {pos:{ra:4.552,dec:-0.988},abbrev:"Ara",name:"Ara"},
    {pos:{ra:0.690,dec: 0.364},abbrev:"Ari",name:"Aries"},
    {pos:{ra:1.592,dec: 0.733},abbrev:"Aur",name:"Auriga"},
    {pos:{ra:3.852,dec: 0.545},abbrev:"Boo",name:"Bootes"},
    {pos:{ra:1.788,dec:-0.386},abbrev:"CMa",name:"Canis Major"},
    {pos:{ra:1.970,dec: 0.113},abbrev:"CMi",name:"Canis Minor"},
    {pos:{ra:3.433,dec: 0.700},abbrev:"CVn",name:"Canes Venatici"},
    {pos:{ra:1.232,dec:-0.661},abbrev:"Cae",name:"Caelum"},
    {pos:{ra:1.309,dec: 1.187},abbrev:"Cam",name:"Camelopardalis"},
    {pos:{ra:5.511,dec:-0.314},abbrev:"Cap",name:"Capricornus"},
    {pos:{ra:1.900,dec:-1.000},abbrev:"Car",name:"Carina"},
    {pos:{ra:0.150,dec: 1.086},abbrev:"Cas",name:"Cassiopeia"},
    {pos:{ra:3.424,dec:-0.828},abbrev:"Cen",name:"Centaurus"},
    {pos:{ra:5.890,dec: 1.240},abbrev:"Cep",name:"Cepheus"},
    {pos:{ra:0.400,dec:-0.224},abbrev:"Cet",name:"Cetus"},
    {pos:{ra:2.799,dec:-1.386},abbrev:"Cha",name:"Chamaeleon"},
    {pos:{ra:3.817,dec:-1.100},abbrev:"Cir",name:"Circinus"},
    {pos:{ra:2.264,dec: 0.390},abbrev:"Cnc",name:"Cancer"},
    {pos:{ra:1.536,dec:-0.613},abbrev:"Col",name:"Columba"},
    {pos:{ra:3.380,dec: 0.465},abbrev:"Com",name:"Coma Berenices"},
    {pos:{ra:4.882,dec:-0.718},abbrev:"CrA",name:"Corona Australis"},
    {pos:{ra:4.147,dec: 0.569},abbrev:"CrB",name:"Corona Borealis"},
    {pos:{ra:2.984,dec:-0.278},abbrev:"Crt",name:"Crater"},
    {pos:{ra:3.259,dec:-1.051},abbrev:"Cru",name:"Crux"},
    {pos:{ra:3.257,dec:-0.322},abbrev:"Crv",name:"Corvus"},
    {pos:{ra:5.392,dec: 0.700},abbrev:"Cyg",name:"Cygnus"},
    {pos:{ra:5.418,dec: 0.204},abbrev:"Del",name:"Delphinus"},
    {pos:{ra:1.371,dec:-1.036},abbrev:"Dor",name:"Dorado"},
    {pos:{ra:4.256,dec: 1.057},abbrev:"Dra",name:"Draco"},
    {pos:{ra:5.546,dec: 0.135},abbrev:"Equ",name:"Equuleus"},
    {pos:{ra:0.863,dec:-0.203},abbrev:"Eri",name:"Eridanus"},
    {pos:{ra:0.732,dec:-0.533},abbrev:"For",name:"Fornax"},
    {pos:{ra:1.850,dec: 0.394},abbrev:"Gem",name:"Gemini"},
    {pos:{ra:5.880,dec:-0.809},abbrev:"Gru",name:"Grus"},
    {pos:{ra:4.553,dec: 0.482},abbrev:"Her",name:"Hercules"},
    {pos:{ra:0.858,dec:-0.930},abbrev:"Hor",name:"Horologium"},
    {pos:{ra:2.730,dec:-0.250},abbrev:"Hya",name:"Hydra"},
    {pos:{ra:0.609,dec:-1.220},abbrev:"Hyi",name:"Hydrus"},
    {pos:{ra:5.500,dec:-0.942},abbrev:"Ind",name:"Indus"},
    {pos:{ra:2.682,dec: 0.561},abbrev:"LMi",name:"Leo Minor"},
    {pos:{ra:5.880,dec: 0.803},abbrev:"Lac",name:"Lacerta"},
    {pos:{ra:2.793,dec: 0.229},abbrev:"Leo",name:"Leo"},
    {pos:{ra:1.457,dec:-0.332},abbrev:"Lep",name:"Lepus"},
    {pos:{ra:3.979,dec:-0.266},abbrev:"Lib",name:"Libra"},
    {pos:{ra:3.985,dec:-0.746},abbrev:"Lup",name:"Lupus"},
    {pos:{ra:2.093,dec: 0.828},abbrev:"Lyn",name:"Lynx"},
    {pos:{ra:4.938,dec: 0.640},abbrev:"Lyr",name:"Lyra"},
    {pos:{ra:1.435,dec:-1.351},abbrev:"Men",name:"Mensa"},
    {pos:{ra:5.489,dec:-0.633},abbrev:"Mic",name:"Microscopium"},
    {pos:{ra:1.850,dec: 0.006},abbrev:"Mon",name:"Monoceros"},
    {pos:{ra:3.294,dec:-1.225},abbrev:"Mus",name:"Musca"},
    {pos:{ra:4.160,dec:-0.897},abbrev:"Nor",name:"Norma"},
    {pos:{ra:4.000,dec:-1.550},abbrev:"Oct",name:"Octans"},
    {pos:{ra:4.471,dec: 0.084},abbrev:"Oph",name:"Ophiuchus"},
    {pos:{ra:1.459,dec: 0.020},abbrev:"Ori",name:"Orion"},
    {pos:{ra:5.136,dec:-1.147},abbrev:"Pav",name:"Pavo"},
    {pos:{ra:6.100,dec: 0.342},abbrev:"Peg",name:"Pegasus"},
    {pos:{ra:0.830,dec: 0.786},abbrev:"Per",name:"Perseus"},
    {pos:{ra:0.114,dec:-0.847},abbrev:"Phe",name:"Phoenix"},
    {pos:{ra:1.495,dec:-0.933},abbrev:"Pic",name:"Pictor"},
    {pos:{ra:5.834,dec:-0.535},abbrev:"PsA",name:"Piscis Austrinus"},
    {pos:{ra:0.206,dec: 0.150},abbrev:"Psc",name:"Pisces"},
    {pos:{ra:1.902,dec:-0.543},abbrev:"Pup",name:"Puppis"},
    {pos:{ra:2.345,dec:-0.477},abbrev:"Pyx",name:"Pyxis"},
    {pos:{ra:1.029,dec:-1.047},abbrev:"Ret",name:"Reticulum"},
    {pos:{ra:0.223,dec:-0.560},abbrev:"Scl",name:"Sculptor"},
    {pos:{ra:4.419,dec:-0.471},abbrev:"Sco",name:"Scorpius"},
    {pos:{ra:4.889,dec:-0.173},abbrev:"Sct",name:"Scutum"},
    {pos:{ra:4.400,dec:-0.139},abbrev:"Ser",name:"Serpens"},
    {pos:{ra:2.689,dec:-0.046},abbrev:"Sex",name:"Sextans"},
    {pos:{ra:5.145,dec: 0.328},abbrev:"Sge",name:"Sagitta"},
    {pos:{ra:5.000,dec:-0.499},abbrev:"Sgr",name:"Sagittarius"},
    {pos:{ra:1.231,dec: 0.257},abbrev:"Tau",name:"Taurus"},
    {pos:{ra:5.060,dec:-0.891},abbrev:"Tel",name:"Telescopium"},
    {pos:{ra:4.207,dec:-1.141},abbrev:"TrA",name:"Triangulum Australe"},
    {pos:{ra:0.572,dec: 0.549},abbrev:"Tri",name:"Triangulum"},
    {pos:{ra:6.226,dec:-1.149},abbrev:"Tuc",name:"Tucana"},
    {pos:{ra:2.961,dec: 0.883},abbrev:"UMa",name:"Ursa Major"},
    {pos:{ra:4.045,dec: 1.453},abbrev:"UMi",name:"Ursa Minor"},
    {pos:{ra:2.507,dec:-0.823},abbrev:"Vel",name:"Vela"},
    {pos:{ra:3.510,dec:-0.072},abbrev:"Vir",name:"Virgo"},
    {pos:{ra:2.043,dec:-1.219},abbrev:"Vol",name:"Volans"},
    {pos:{ra:5.296,dec: 0.427},abbrev:"Vul",name:"Vulpecula"}]

var conline = [
    [2843,2850],[2850,2844],[2844,2785],[  66,  46],[  46,  48],
    [  48,  44],[  44,  16],[  16,  15],[  15,2850],[ 104,  84],
    [  84,  71],[  71, 102],[ 104,  44],[   1,  48],[  48, 104],
    [ 104, 138],[ 138, 189],[2020,1988],[1988,1756],[2545,2586],
    [2586,2622],[2675,2622],[2622,2672],[2672,2718],[2718,2726],
    [2726,2740],[2726,2712],[2712,2672],[2672,2705],[2705,2771],
    [2771,2764],[2764,2774],[2774,2811],[2811,2771],[2771,2810],
    [2810,2811],[2811,2802],[2811,2827],[2473,2428],[2428,2377],
    [2377,2335],[2335,2314],[2437,2423],[2423,2415],[2415,2377],
    [2377,2336],[2336,2320],[2114,2101],[2101,2102],[2102,2111],
    [2111,2037],[2037,2054],[2054,2058],[2058,2114],[ 261, 194],
    [ 194, 166],[ 166, 163],[ 163, 194],[ 695, 691],[ 691, 574],
    [ 574, 535],[ 535, 538],[ 538, 547],[ 547, 574],[ 574, 695],
    [ 695, 699],[ 699, 606],[ 606, 529],[ 529, 547],[1718,1708],
    [1708,1736],[1736,1718],[1718,1746],[1746,1744],[1744,1770],
    [1770,1715],[1715,1681],[1681,1672],[1672,1665],[1715,1759],
    [1759,1770],[1770,1826],[1826,1846],[1846,1801],[1801,1746],
    [1801,1826],[ 514, 534],[ 534, 525],[ 525, 334],[ 334, 514],
    [1129,1096],[1096,1099],[1096,1040],[1589,1543],[ 838, 832],
    [ 832, 853],[ 853, 838],[ 838, 806],[ 806, 786],[ 786, 774],
    [ 806, 852],[ 852, 862],[ 757, 786],[ 786, 833],[ 833, 843],
    [ 843, 821],[ 915, 882],[ 882, 862],[ 862, 847],[ 847, 843],
    [ 843, 753],[ 947, 918],[2651,2632],[2632,2604],[2604,2578],
    [2578,2495],[2604,2613],[2613,2578],[2578,2555],[2538,2495],
    [2495,2485],[1173,1283],[1283,1341],[1341,1179],[1179,1051],
    [1051, 761],[ 159, 123],[ 123,  81],[  81,  50],[  50,   2],
    [1405,1488],[1488,1529],[1432,1493],[1493,1529],[1529,1557],
    [1557,1652],[1652,1691],[1751,1652],[1652,1679],[1679,1667],
    [1667,1627],[1627,1660],[1660,1675],[1660,1669],[1794,1747],
    [1747,1684],[1684,1667],[1557,1679],[1679,1687],[1687,1684],
    [1684,1692],[1692,1726],[1726,1694],[1694,1667],[2623,2848],
    [2848,2768],[2768,2623],[2623,2603],[2603,2550],[2550,2507],
    [2603,2648],[2648,2702],[2702,2689],[2689,2731],[2731,2768],
    [2654,2689],[ 250, 225],[ 225, 255],[ 255, 286],[ 286, 290],
    [ 290, 250],[ 250, 240],[ 240, 210],[ 210, 158],[ 180, 151],
    [ 151, 158],[ 158, 122],[ 122, 101],[ 101,  17],[  17,  56],
    [  56, 151],[ 101,  56],[1054,1332],[1332,1503],[1834,1753],
    [1753,1820],[ 702, 758],[ 758, 746],[ 746, 702],[ 626, 656],
    [ 656, 683],[ 683, 702],[ 702, 705],[ 705, 683],[2331,2340],
    [2340,2341],[2341,2337],[2337,2318],[1862,1854],[1854,1869],
    [1869,1889],[1889,1925],[1489,1491],[1491,1498],[1498,1533],
    [1533,1544],[1544,1491],[1540,1533],[1471,1448],[1448,1413],
    [1413,1403],[1403,1412],[1412,1433],[1433,1471],[1413,1388],
    [1369,1403],[1522,1535],[1571,1496],[2533,2498],[2498,2383],
    [2544,2498],[2498,2416],[2509,2519],[2519,2534],[2534,2543],
    [2543,2530],[2530,2519],[ 440, 486],[ 486, 645],[ 645, 674],
    [1421,1545],[1545,1696],[1696,1852],[1852,1945],[1945,2004],
    [2004,2076],[2076,2235],[2235,2355],[2355,2157],[2157,2124],
    [2124,2119],[2119,2164],[2164,2157],[2431,2355],[2237,2235],
    [ 495, 564],[ 564, 558],[ 558, 522],[ 522, 509],[ 509, 484],
    [ 484, 420],[ 420, 397],[ 397, 357],[ 357, 344],[ 344, 275],
    [ 275, 294],[ 294, 321],[ 321, 346],[ 346, 372],[ 372, 485],
    [ 485, 463],[ 463, 446],[ 446, 287],[ 287, 245],[ 245, 226],
    [ 226, 208],[ 208, 171],[ 171, 142],[ 307, 263],[ 936, 864],
    [ 864, 798],[ 798, 754],[ 754, 734],[ 734, 710],[ 798, 763],
    [ 960, 939],[ 939, 892],[ 892, 850],[ 850, 784],[ 892, 887],
    [ 887, 803],[ 959, 939],[ 939, 911],[ 911, 864],[ 864, 822],
    [2659,2670],[2670,2677],[2677,2724],[2724,2795],[2795,2806],
    [2806,2751],[2751,2677],[2751,2763],[2751,2782],[1956,1982],
    [1982,2024],[2024,2033],[2033,2031],[2031,2013],[2013,1985],
    [2033,2086],[2013,2079],[2137,2086],[2086,2065],[2065,2081],
    [2081,2079],[2013,2117],[2117,2143],[2143,2163],[2163,2189],
    [2159,2165],[2165,2163],[2163,2174],[2174,2191],[1693,1624],
    [1624,1468],[1468,1426],[1426,1388],[1388,1369],[1369,1355],
    [1355,1301],[1301,1274],[1274,1251],[1251,1192],[1192,1231],
    [1231,1211],[1211,1164],[1164,1121],[1121,1091],[1091,1074],
    [1074,1071],[1071,1102],[1102,1121],[  24, 388],[ 388, 251],
    [ 251, 219],[ 219, 182],[2513,2557],[2704,2737],[1188,1204],
    [1204,1242],[1242,1252],[1252,1188],[1252,1280],[1280,1288],
    [1288,1267],[1267,1271],[1233,1267],[1267,1394],[1394,1393],
    [1393,1462],[1394,1409],[1409,1404],[1394,1314],[1288,1376],
    [1376,1393],[1267,1242],[1358,1302],[1302,1266],[1266,1358],
    [ 572, 571],[ 571, 551],[ 551, 614],[ 614, 627],[ 627, 571],
    [ 571, 591],[ 627, 666],[ 666, 693],[ 693, 681],[ 681, 661],
    [ 661, 614],[1875,1870],[1870,1866],[1866,1778],[1778,1802],
    [1866,1828],[1828,1778],[1896,1835],[1835,1926],[1926,1946],
    [1835,1860],[1860,1871],[1835,1832],[1832,1809],[1809,1803],
    [1803,1812],[1812,1813],[1809,1836],[1836,1827],[1803,1755],
    [1755,1735],[1755,1719],[1743,1750],[1750,1755],[1755,1793],
    [1793,1835],[1181,1174],[1174,1044],[1044, 908],[ 908, 741],
    [2260,2272],[2272,2275],[2275,2286],[2286,2315],[2315,2302],
    [2302,2275],[2275,2260],[ 955,1023],[1023, 870],[ 870, 765],
    [ 765, 739],[ 870, 759],[ 759, 773],[1592,1550],[1550,1539],
    [1566,1550],[1550,1502],[1502,1566],[1714,2625],[2625,2748],
    [2748,1714],[2108,2095],[2095,2107],[2107,2091],[2091,2072],
    [2072,2025],[2025,2012],[2025,2059],[2059,2053],[2053,1974],
    [2059,2126],[2126,2140],[2140,2059],[2072,2140],[2140,2145],
    [2145,2182],[2182,2216],[ 669, 652],[ 652, 688],[ 688, 706],
    [ 706, 728],[ 728, 711],[ 711, 685],[ 685, 719],[ 719, 728],
    [ 688, 617],[ 617, 605],[ 605, 515],[ 617, 633],[ 524, 520],
    [ 520, 515],[ 515, 516],[ 516, 530],[ 605, 622],[ 622, 603],
    [ 603, 576],[ 652, 640],[ 640, 622],[2496,2608],[2608,2531],
    [2531,2463],[2463,2433],[2433,2254],[2254,2287],[2287,2463],
    [2463,2496],[2287,2282],[2282,2208],[2208,2180],[2180,2282],
    [2135,2180],[2643,2750],[2750,2760],[2760,2793],[2793,  11],
    [  11,   1],[   1,2790],[2790,2793],[2793,2761],[2761,2765],
    [2765,2756],[2756,2687],[2761,2680],[2680,2647],[2647,2606],
    [2646,2680],[2680,2760],[2685,2750],[ 410, 422],[ 422, 415],
    [ 415, 351],[ 351, 337],[ 337, 328],[ 328, 291],[ 291, 258],
    [ 258, 270],[ 270, 291],[ 270, 301],[ 301, 302],[ 302, 300],
    [ 300, 295],[ 295, 262],[ 300, 394],[ 354, 384],[ 384, 395],
    [ 395, 394],[ 394, 356],[ 356, 337],[ 301, 246],[ 246, 140],
    [  97, 135],[ 135, 167],[ 167,  97],[  97, 130],[ 130,  26],
    [  26,  25],[  25,   4],[   4,  26],[  26, 105],[ 105,  97],
    [  97,  26],[ 825, 684],[ 684, 675],[ 109, 118],[ 118, 110],
    [ 110, 109],[ 110, 134],[ 134, 152],[ 152, 185],[ 185,  92],
    [  92,  69],[  69,2879],[2879,2847],[2847,2833],[2833,2814],
    [2814,2832],[2832,2853],[2853,2847],[2778,2747],[2747,2641],
    [2641,2734],[2734,2769],[2769,2776],[2776,2778],[ 761, 791],
    [ 791, 891],[ 891, 980],[ 980,1021],[1021,1015],[1015,1027],
    [1115,1098],[1098,1082],[1082,1015],[ 374, 439],[ 439, 449],
    [ 449, 402],[ 402, 374],[2453,2419],[2419,2405],[2419,2403],
    [2365,2369],[2369,2321],[2321,2267],[2267,2293],[2293,2344],
    [2344,2366],[2430,2448],[2448,2334],[2334,2321],[2369,2448],
    [2344,2308],[2308,2293],[2293,2334],[2267,2211],[2211,2181],
    [2181,2198],[2198,2232],[2232,2211],[2211,2221],[2221,2205],
    [2205,2181],[2118,2133],[2133,2141],[2141,2123],[2123,2073],
    [2073,2050],[2050,2043],[2043,2040],[2040,2022],[2022,2005],
    [2005,1979],[1979,1917],[1917,1924],[1927,1943],[1943,1959],
    [1959,1979],[  88,2818],[2818,2837],[2837,  88],[2278,2252],
    [2303,2216],[2216,2160],[2160,2134],[2134,2127],[2127,2092],
    [2092,1974],[1974,1968],[1968,1895],[1895,1902],[1902,1890],
    [1890,1893],[1893,1867],[1867,1892],[1892,1919],[1919,1894],
    [1894,1886],[1886,1892],[ 606, 468],[ 468, 454],[ 454, 445],
    [ 445, 482],[ 482, 642],[ 454, 398],[ 398, 340],[ 340, 333],
    [ 333, 330],[ 330, 348],[ 333, 404],[ 431, 398],[ 398, 490],
    [ 490, 483],[2229,2231],[ 161, 196],[ 196, 206],[ 206, 161],
    [2032,1905],[1905,1857],[1857,1821],[1821,2032],[2707,2812],
    [2812,  18],[  35,2812],[1668,1633],[1633,1584],[1584,1497],
    [1497,1469],[1469,1374],[1374,1377],[1377,1497],[1469,1451],
    [1451,1401],[1401,1399],[1451,1385],[1385,1292],[1292,1281],
    [1377,1198],[1198,1056],[1056,1245],[1245,1374],[1245,1205],
    [1205,1127],[1205,1137],[ 129,2192],[2192,2064],[2064,1909],
    [1909,1790],[1790,1847],[1847,1996],[1996,1909],[1027,1088],
    [1088,1104],[1104,1261],[1261,1348],[1348,1277],[1277,1210],
    [1210,1153],[1153,1027],[1483,1450],[1450,1465],[1465,1507],
    [1507,1559],[1559,1483],[1596,1587],[1587,1559],[1559,1604],
    [1604,1635],[1635,1705],[1705,1713],[1713,1689],[1689,1648],
    [1648,1587],[1648,1635],[1713,1764],[1689,1772],[1145,1061],
    [1061,1032],[1032, 973],[ 973, 876],[ 876,1032],[1032,1145],
    [1032, 903]];

var dso = [
    {pos:{ra:1.459532,dec: 0.384263},catalog:1,id:1,type:5},
    {pos:{ra:3.587524,dec: 0.495383},catalog:1,id:3,type:2},
    {pos:{ra:4.291765,dec:-0.463094},catalog:1,id:4,type:2},
    {pos:{ra:4.008149,dec: 0.036361},catalog:1,id:5,type:2},
    {pos:{ra:4.685773,dec:-0.607665},catalog:1,id:7,type:1},
    {pos:{ra:4.728970,dec:-0.425569},catalog:1,id:8,type:3},
    {pos:{ra:4.935355,dec:-0.109374},catalog:1,id:11,type:1},
    {pos:{ra:4.370741,dec: 0.636463},catalog:1,id:13,type:1},
    {pos:{ra:5.628687,dec: 0.212348},catalog:1,id:15,type:2},
    {pos:{ra:4.803146,dec:-0.282452},catalog:1,id:17,type:3},
    {pos:{ra:4.723733,dec:-0.402007},catalog:1,id:20,type:3},
    {pos:{ra:4.871214,dec:-0.417134},catalog:1,id:22,type:2},
    {pos:{ra:5.234242,dec: 0.396481},catalog:1,id:27,type:4},
    {pos:{ra:0.186314,dec: 0.720239},catalog:1,id:31,type:6},
    {pos:{ra:1.537635,dec: 0.568105},catalog:1,id:37,type:1},
    {pos:{ra:1.771509,dec:-0.361865},catalog:1,id:41,type:1},
    {pos:{ra:1.463459,dec:-0.095120},catalog:1,id:42,type:3},
    {pos:{ra:2.269364,dec: 0.348775},catalog:1,id:44,type:1},
    {pos:{ra:0.990474,dec: 0.420915},catalog:1,id:45,type:1},
    {pos:{ra:2.014983,dec:-0.258600},catalog:1,id:46,type:1},
    {pos:{ra:3.533855,dec: 0.823795},catalog:1,id:51,type:6},
    {pos:{ra:4.946263,dec: 0.576540},catalog:1,id:57,type:4},
    {pos:{ra:3.388993,dec: 0.378446},catalog:1,id:64,type:6},
    {pos:{ra:2.598795,dec: 1.205441},catalog:1,id:81,type:6},
    {pos:{ra:2.599668,dec: 1.216204},catalog:1,id:82,type:6},
    {pos:{ra:3.251112,dec: 0.224857},catalog:1,id:84,type:6},
    {pos:{ra:3.255912,dec: 0.226020},catalog:1,id:86,type:6},
    {pos:{ra:2.944371,dec: 0.960222},catalog:1,id:97,type:4},
    {pos:{ra:3.316126,dec:-0.202749},catalog:1,id:104,type:6},
    {pos:{ra:0.065886,dec:-0.684460},catalog:2,id:55,type:6},
    {pos:{ra:0.105156,dec:-1.257801},catalog:2,id:104,type:2},
    {pos:{ra:0.207694,dec:-0.441277},catalog:2,id:253,type:6},
    {pos:{ra:0.239546,dec:-0.657407},catalog:2,id:300,type:6},
    {pos:{ra:0.275762,dec:-1.236566},catalog:2,id:362,type:2},
    {pos:{ra:0.606938,dec: 0.997456},catalog:2,id:869,type:1},
    {pos:{ra:0.860884,dec:-0.717330},catalog:2,id:1291,type:6},
    {pos:{ra:0.884446,dec:-0.649262},catalog:2,id:1316,type:6},
    {pos:{ra:1.370520,dec:-0.699004},catalog:2,id:1851,type:2},
    {pos:{ra:1.477421,dec:-1.205732},catalog:2,id:2070,type:3},
    {pos:{ra:2.060361,dec:-0.672534},catalog:2,id:2477,type:1},
    {pos:{ra:2.085669,dec:-1.060287},catalog:2,id:2516,type:1},
    {pos:{ra:2.138901,dec:-0.858702},catalog:2,id:2547,type:1},
    {pos:{ra:2.408991,dec:-1.131846},catalog:2,id:2808,type:2},
    {pos:{ra:2.627593,dec:-1.048943},catalog:2,id:3114,type:1},
    {pos:{ra:2.694788,dec:-0.809833},catalog:2,id:3201,type:2},
    {pos:{ra:2.726204,dec:-0.325504},catalog:2,id:3242,type:4},
    {pos:{ra:2.774637,dec:-1.016073},catalog:2,id:3293,type:1},
    {pos:{ra:2.809108,dec:-1.044870},catalog:2,id:3372,type:3},
    {pos:{ra:2.903791,dec:-1.025090},catalog:2,id:3532,type:1},
    {pos:{ra:3.037745,dec:-1.075123},catalog:2,id:3766,type:1},
    {pos:{ra:3.375467,dec:-1.053597},catalog:2,id:4755,type:1},
    {pos:{ra:3.401210,dec:-1.236857},catalog:2,id:4833,type:2},
    {pos:{ra:3.426954,dec:-0.863356},catalog:2,id:4945,type:6},
    {pos:{ra:3.514657,dec:-0.750782},catalog:2,id:5128,type:6},
    {pos:{ra:3.519893,dec:-0.828740},catalog:2,id:5139,type:2},
    {pos:{ra:4.204935,dec:-1.055924},catalog:2,id:6025,type:1},
    {pos:{ra:4.424846,dec:-0.729838},catalog:2,id:6231,type:1},
    {pos:{ra:4.608978,dec:-0.780744},catalog:2,id:6388,type:2},
    {pos:{ra:4.628177,dec:-0.936660},catalog:2,id:6397,type:2},
    {pos:{ra:4.747295,dec:-0.762709},catalog:2,id:6541,type:2},
    {pos:{ra:5.016949,dec:-1.114393},catalog:2,id:6744,type:6},
    {pos:{ra:5.021749,dec:-1.046616},catalog:2,id:6752,type:2},
    {pos:{ra:5.888741,dec:-0.363610},catalog:2,id:7293,type:4},
    {pos:{ra:0.229511,dec:-1.270600},catalog:0,id:2,type:6},
    {pos:{ra:1.411971,dec:-1.217367},catalog:0,id:1,type:6}];

var planet = [
    {pos: {ra: 0, dec: 0}, name: "Mercury", color: "#FFFFFF",
        a: 0.38709893, e: 0.20563069, i: 0.1222580, o: 0.8435468,
        wb: 1.3518701, L: 4.4026077, dL: 2608.79031222},
    {pos: {ra: 0, dec: 0}, name: "Venus", color: "#FFFFFF",
        a: 0.72333199, e: 0.00677323, i: 0.0592489, o: 1.3383305,
        wb: 2.2956836, L: 3.1761455, dL: 1021.32855281},
    {pos: {ra: 0, dec: 0}, name: "Earth", color: "#FFFFFF",
        a: 1.00000011, e: 0.01671022, i: 0.0000009, o: -0.1965352,
        wb: 1.7967674, L: 1.7534337, dL: 628.30757698},
    {pos: {ra: 0, dec: 0}, name: "Mars", color: "#FFFFFF",
        a: 1.52366231, e: 0.09341233, i: 0.0322992, o: 0.8653088,
        wb: 5.8650191, L: 6.2038308, dL: 334.06137011},
    {pos: {ra: 0, dec: 0}, name: "Jupiter", color: "#FFFFFF",
        a: 5.20336301, e: 0.04839266, i: 0.0227818, o: 1.7550359,
        wb: 0.2575033, L: 0.6004697, dL: 52.96627451},
    {pos: {ra: 0, dec: 0}, name: "Saturn", color: "#FFFFFF",
        a: 9.53707032, e: 0.05415060, i: 0.0433620, o: 1.9847019,
        wb: 1.6132417, L: 0.8716928, dL: 21.33690681},
    {pos: {ra: 0, dec: 0}, name: "", color: "#FFFFFF",
        a: 19.19126393, e: 0.04716771, i: 0.0134366, o: 1.2955558,
        wb: 2.9838889, L: 5.4669329, dL: 7.47848272},
    {pos: {ra: 0, dec: 0}, name: "Neptune", color: "#FFFFFF",
        a: 30.06896348, e: 0.00858587, i: 0.0308778, o: 2.2989772,
        wb: 0.7848981, L: 5.3211603, dL: 3.81281337},
    {pos: {ra: 0, dec: 0}, name: "Pluto", color: "#FFFFFF",
        a: 39.48168677, e: 0.24880766, i: 0.2991800, o: 1.9251587,
        wb: 3.9107027, L: 4.1700944, dL: 2.53435334}];

var moon = {pos: {ra: 0, dec: 0}};

var now = {};
var clipped = false;
var ck_starlabels = false;
var ck_conlabels = false;
var ck_dsos = true;
var ck_conlines = true;


function draw_star( context, s )
{
    context.fillStyle = s.color;
    context.beginPath();
    context.arc( s.pos.x, s.pos.y, s.radius* 1.3, 0, 2 * Math.PI );
    context.closePath();
    context.fill();
}


function draw_planet( context, p )
{
    draw_star( context, p );
    context.fillStyle = p.color;
    context.font = "12px Sans-Serif";
    var name = p.name == "Earth" ? "Sun" : p.name;
    context.fillText( name, p.pos.x + 5, p.pos.y );
}


function draw_star_label( context, p )
{
    context.fillStyle = "#888";
    context.strokeStyle = "#888";
    context.font = "11px Sans-Serif";
    context.fillText( p.label, p.pos.x + 5, p.pos.y );
}


function draw_con_label( context, p )
{
    context.fillStyle = "#789";
    context.strokeStyle = "#789";
    context.font = "10px Sans-Serif";
    var s = p.name.toUpperCase();
    var w = context.measureText( s ).width;
    context.fillText( s, p.pos.x - w / 2, p.pos.y );
}


function ellipse( context, cx, cy, rx, ry, filled )
{
    context.save();
    context.beginPath();
    context.translate( cx - rx, cy - ry );
    context.scale( rx, ry );
    context.arc( 1, 1, 1, 0, 2 * Math.PI, false );
    context.closePath();
    context.restore();
    if ( filled )
        context.fill();
    else
        context.stroke();
}


function draw_dso( context, m )
{
    context.fillStyle = m.color;
    context.strokeStyle = m.color;
    context.font = "10px Sans-Serif";
    context.fillText( m.name, m.pos.x + m.offsetx, m.pos.y + m.offsety );
    if ( m.catalog == 1 && m.id == 45 ) return;
    switch ( m.type ) {
        case 1:
        case 2:
            context.beginPath();
            context.arc( m.pos.x, m.pos.y, 2.5, 0, 2 * Math.PI );
            context.closePath();
            context.stroke();
            break;
        case 3:
        case 4:
        case 5:  context.strokeRect( m.pos.x - 2, m.pos.y - 2, 4, 4 );  break;
        case 6:  ellipse( context, m.pos.x, m.pos.y, 4, 2, true );  break;
        default:
            context.beginPath();
            context.moveTo( m.pos.x - 2, m.pos.y );
            context.lineTo( m.pos.x + 2, m.pos.y );
            context.moveTo( m.pos.x, m.pos.y - 2 );
            context.lineTo( m.pos.x, m.pos.y + 2 );
            context.stroke();
            break;
    }
}


function draw_moon( context )
{
    context.globalCompositeOperation = "source-over";
    var i = Math.floor(( Astro.raddeg( moon.phase ) + 180 ) / 12 );
    context.drawImage( immoons, i * 16, 0, 16, 16, moon.pos.x - 8, moon.pos.y - 8, 16, 16 );
    context.globalCompositeOperation = "lighter";
    context.fillStyle = "#FFF0E0";
    context.font = "12px Sans-Serif";
    context.fillText( "Moon", moon.pos.x + 8, moon.pos.y );
}


function draw_line( context, s1, s2 )
{
    if ( s1.pos.visible && s2.pos.visible ) {
        context.beginPath();
        context.moveTo( s1.pos.x, s1.pos.y );
        context.lineWidth = 0.4;
        context.lineTo( s2.pos.x, s2.pos.y );
        context.stroke();
    }
}


function draw_sky( context, w, h )
{
    /* ----- calculate Earth (sun) position */
    find_planet( planet[ 2 ], null, now.jd );
    var azalt = skypos_transform( planet[ 2 ].pos, now, w, h );
    var bgcolor;
    if ( azalt[ 1 ] > 0 ) bgcolor = "#191d29";              // 24, 36, 72
    else if ( azalt[ 1 ] > -0.10472 ) bgcolor = "#191d29";  // 18, 27, 54
    else if ( azalt[ 1 ] > -0.20944 ) bgcolor = "#191d29";  // 12, 18, 36
    else if ( azalt[ 1 ] > -0.31416 ) bgcolor = "#191d29";  //  6,  9, 18
    else bgcolor = "#191d29";

    /* ---- background, blue if sun up, black otherwise */
    context.clearRect( 0, 0, w, h );
    context.globalCompositeOperation = "source-over";
    context.fillStyle = bgcolor;  // planet[ 2 ].pos.visible ? "#182448" : "#000000";
    context.beginPath();
    context.arc( w / 2, h / 2, w / 2, 0, 2 * Math.PI );

    context.closePath();
    context.fill();
    if ( !clipped ) {
        context.clip();
        clipped = true;
    }

    context.globalCompositeOperation = "xor";
    context.lineWidth = 1;

    /* ----- horizon labels */
    context.textBaseline = "middle";
    context.fillStyle = "#888";
    context.font = "12px Sans-Serif";

    /* ---- stars */
    var len = star.length;
    for ( var i = 0; i < len; i++ ) {
        skypos_transform( star[ i ].pos, now, w, h );
        if ( star[ i ].pos.visible ) {
            draw_star(context, star[i]);
        }
    }

    /* ---- star labels */
    if ( ck_starlabels ) {
        var len = starname.length;
        for ( i = 0; i < len; i++ ) {
            skypos_transform( starname[ i ].pos, now, w, h );
            if ( starname[ i ].pos.visible )
                draw_star_label( context, starname[ i ] );
        }
    }

    /* ---- constellation labels */
    if ( ck_conlabels ) {
        var len = conname.length;
        for ( i = 0; i < len; i++ ) {
            skypos_transform( conname[ i ].pos, now, w, h );
            if ( conname[ i ].pos.visible )
                draw_con_label( context, conname[ i ] );
        }
    }

    /* ---- constellation lines */
    if ( ck_conlines ) {
        context.strokeStyle = "#303030";
        len = conline.length;
        for ( i = 0; i < len; i++ )
            draw_line( context, star[ conline[ i ][ 0 ]], star[ conline[ i ][ 1 ]] );
    }

    /* ---- planets */
    for ( i = 0; i < 9; i++ ) {
        if ( i != 2 ) {
            find_planet( planet[ i ], planet[ 2 ], now.jd );
            skypos_transform( planet[ i ].pos, now, w, h );
        }
        if ( planet[ i ].pos.visible )
            draw_planet( context, planet[ i ]);
    }

    /* ---- DSOs */
    if ( ck_dsos ) {
        len = dso.length;
        for ( i = 0; i < len; i++ ) {
            skypos_transform( dso[ i ].pos, now, w, h );
            if ( dso[ i ].pos.visible )
                draw_dso( context, dso[ i ] );
        }
    }

    /* ----- Moon */
    find_moon( moon, planet[ 2 ], now.jd );
    console.log( "phase: " + Astro.raddeg( moon.phase ));
    skypos_transform( moon.pos, now, w, h );
    if ( moon.pos.visible )
        draw_moon( context );
}


function refresh()
{
    var canvas = document.getElementById( "planicanvas" );
    if ( !canvas || !canvas.getContext ) return;
    var context = canvas.getContext( "2d" );
    draw_sky( context, canvas.width, canvas.height );
}

function saveImage()
{
    var link = document.createElement('a');
    var canvas = document.getElementById("planicanvas");

    link.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    /*
     link.href = canvas.toDataURL("image/png",{
     format: 'image/png',
     multiplier: 12
     }).replace("image/png", "image/octet-stream");
     */

    link.download = 'image.png';
    link.click();
    try{
        window.URL.revokeObjectURL(url);
    }
    catch(error){
        console.error(error);   
    }
}

function set_user_obs()
{
    var dt = new Date().toString(); //Thu Feb 22 2018 14:13:07 GMT-0500
    console.log("dt=",dt);

    var lon = -75;
    var lat = 40;
    var slab = 0;
    var clab = 0;
    var idso = 1;
    var clin = 1;

    d = now.getDate();
    dt.value = d.toString().slice( 0, 33 );
    lon.value = now.getLonDegrees();
    lat.value = now.getLatDegrees();
    slab.checked = ck_starlabels;
    clab.checked = ck_conlabels;
    idso.checked = ck_dsos;
    clin.checked = ck_conlines;
}


function get_user_obs()
{
    var dt = document.getElementById( "user_date" );
    var lon = document.getElementById( "user_lon" );
    var lat = document.getElementById( "user_lat" );
    var slab = document.getElementById( "user_starlab" );
    var clab = document.getElementById( "user_conlab" );
    var idso = document.getElementById( "user_dsos" );
    var clin = document.getElementById( "user_conline" );

    var n = Date.parse( dt.value );
    if ( isNaN( n )) {
        alert( "Your browser doesn't think\n'" + dt.value + "'\nis a valid date." );
        set_user_obs();
        return;
    }
    var d = new Date( n );
    now.setDate( d );

    if ( lon.value >= -180 && lon.value < 360 )
        now.setLonDegrees( lon.value );

    if ( lat.value >= -90 && lat.value <= 90 )
        now.setLatDegrees( lat.value );

    ck_starlabels = slab.checked;
    ck_conlabels = clab.checked;
    ck_dsos = idso.checked;
    ck_conlines = clin.checked;
    console.log( "slab " + ck_starlabels + " dsos " + ck_dsos );
    set_user_obs();
    refresh();
}


function inc_button()
{
    var inc = document.getElementById( "increment" );
    now.incHour( inc.value );
    set_user_obs();
    refresh();
}


function dec_button()
{
    var inc = document.getElementById( "increment" );
    now.incHour( -inc.value );
    set_user_obs();
    refresh();
}


function now_button()
{
    now.setDate( new Date() );
    set_user_obs();
    setDateNow();
    refresh();
}


function canvasApp()
{
    init_stars( star );
    init_dsos( dso );
    init_planets( planet );
    now = new Observer();
    set_user_obs();
    refresh();
    
    setDateNow();
    createSearchCity();
}


function setGeoPos( geopos ) {
    now.setLatDegrees( geopos.coords.latitude );
    now.setLonDegrees( geopos.coords.longitude );
    set_user_obs();
    refresh();
}


function errGeoPos( error ) {
    alert( 'Geolocation error ' + error.code + ': ' + error.message );
};


function getGeoPos()
{
    if ( navigator.geolocation )
        navigator.geolocation.getCurrentPosition( setGeoPos, errGeoPos );
}

function createSearchCity(){
    var geocodingService = new GeocodingService($);
    var view = new SearchCityView($);
    var model = new SearchCityModel(view, geocodingService);
    new SearchCityController(model);

    EventBus.addEventListener("LOCATION_SELECTED", function(coord){
        console.log("LOCATION_SELECTED coord=",coord);
        $("#user_lat").val(coord[0]);
        $("#user_lon").val(coord[1]);

        get_user_obs();
    });
}
function setDateNow(){
    var d = Date(Date.now());
    // Converting the number of millisecond in date string 
    a = d.toString();

    console.log("a=",a);
    $("#user_date").val(a);
}

//createSearchCity();
//get_user_obs();
//set_user_obs();
//setDateNow();