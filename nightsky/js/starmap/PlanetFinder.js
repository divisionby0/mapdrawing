var PlanetFinder = (function () {
    function PlanetFinder() {
    }
    PlanetFinder.find = function (planet, earth, jd) {
        function kepler(m, e) {
            var EPSILON = 1.0e-6;
            var d, ae = m;
            while (true) {
                d = ae - (e * Math.sin(ae)) - m;
                if (Math.abs(d) < EPSILON)
                    break;
                d /= 1.0 - (e * Math.cos(ae));
                ae -= d;
            }
            return 2.0 * Math.atan(Math.sqrt((1.0 + e) / (1.0 - e)) * Math.tan(ae / 2.0));
        }
        var t = (jd - Astro.JD_J2000) / 36525.0;
        var m = planet.L - planet.wb + planet.dL * t; /* mean anomaly */
        m = Astro.range(m, Math.PI * 2.0);
        var v = kepler(m, planet.e);
        var cv = Math.cos(v);
        var sv = Math.sin(v);
        var r = (planet.a * (1.0 - planet.e * planet.e)) / (1 + planet.e * cv);
        planet.hx = r * (planet.P[0] * cv + planet.Q[0] * sv);
        planet.hy = r * (planet.P[1] * cv + planet.Q[1] * sv);
        planet.hz = r * (planet.P[2] * cv + planet.Q[2] * sv);
        var dx, dy, dz;
        if (planet.name != "Earth") {
            dx = planet.hx - earth.hx;
            dy = planet.hy - earth.hy;
            dz = planet.hz - earth.hz;
        }
        else {
            dx = -planet.hx;
            dy = -planet.hy;
            dz = -planet.hz;
        }
        planet.pos.ra = Math.atan2(dy, dx);
        planet.pos.dec = Math.atan2(dz, Math.sqrt(dx * dx + dy * dy));
    };
    return PlanetFinder;
}());
//# sourceMappingURL=PlanetFinder.js.map