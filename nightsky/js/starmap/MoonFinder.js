var MoonFinder = (function () {
    function MoonFinder() {
    }
    MoonFinder.find = function (moon, earth, jd) {
        var P2 = Math.PI * 2.0;
        var ARC = 206264.8062;
        var T, L0, L, LS, D, F, DL, S, H, N, M, C;
        var mlon, mlat;
        /* calculate the Moon's ecliptic longitude and latitude */
        T = (jd - 2451545.0) / 36525.0;
        L0 = Astro.range(0.606433 + 1336.855225 * T, 1.0);
        L = P2 * Astro.range(0.374897 + 1325.552410 * T, 1.0);
        LS = P2 * Astro.range(0.993133 + 99.997361 * T, 1.0);
        D = P2 * Astro.range(0.827361 + 1236.853086 * T, 1.0);
        F = P2 * Astro.range(0.259086 + 1342.227825 * T, 1.0);
        DL = 22640 * Math.sin(L) +
            -4586 * Math.sin(L - 2 * D) +
            2370 * Math.sin(2 * D) +
            769 * Math.sin(2 * L) +
            -668 * Math.sin(LS) +
            -412 * Math.sin(2 * F) +
            -212 * Math.sin(2 * L - 2 * D) +
            -206 * Math.sin(L + LS - 2 * D) +
            192 * Math.sin(L + 2 * D) +
            -165 * Math.sin(LS - 2 * D) +
            -125 * Math.sin(D) +
            -110 * Math.sin(L + LS) +
            148 * Math.sin(L - LS) +
            -55 * Math.sin(2 * F - 2 * D);
        S = F + (DL + 412 * Math.sin(2 * F) + 541 * Math.sin(LS)) / ARC;
        H = F - 2 * D;
        N = -526 * Math.sin(H) +
            44 * Math.sin(L + H) +
            -31 * Math.sin(-L + H) +
            -23 * Math.sin(LS + H) +
            11 * Math.sin(-LS + H) +
            -25 * Math.sin(-2 * L + F) +
            21 * Math.sin(-L + F);
        /* epoch of date! */
        mlon = P2 * Astro.range(L0 + DL / 1296000.0, 1.0);
        mlat = (18520.0 * Math.sin(S) + N) / ARC;
        /* convert Sun equatorial J2000 to ecliptic coordinates at epoch jd */
        /* "Earth" ra and dec are really geocentric Sun coordinates */
        var coord = [earth.pos.ra, earth.pos.dec];
        Astro.ecl_eq(Astro.EQtoECL, coord, coord);
        Astro.precess(Astro.JD_J2000, jd, coord);
        /* calculate Moon phase */
        D = mlon - coord[0];
        moon.phase = Math.acos(Math.cos(D) * Math.cos(mlat));
        if (Math.sin(D) < 0.0)
            moon.phase = P2 - moon.phase;
        moon.phase -= Math.PI;
        /* convert Moon ecliptic to equatorial coordinates */
        coord[0] = mlon;
        coord[1] = mlat;
        Astro.ecl_eq(Astro.ECLtoEQ, coord, coord);
        Astro.precess(jd, Astro.JD_J2000, coord);
        moon.pos.ra = coord[0];
        moon.pos.dec = coord[1];
        /* calculate position angle of the bright limb */
        var sa = Math.sin(earth.pos.ra - moon.pos.ra);
        var ca = Math.cos(earth.pos.ra - moon.pos.ra);
        var sd0 = Math.sin(earth.pos.dec);
        var cd0 = Math.cos(earth.pos.dec);
        var sd = Math.sin(moon.pos.dec);
        var cd = Math.cos(moon.pos.dec);
        moon.posAngle = Math.atan2(cd0 * sa, sd0 * cd - cd0 * sd * ca);
    };
    return MoonFinder;
}());
//# sourceMappingURL=MoonFinder.js.map