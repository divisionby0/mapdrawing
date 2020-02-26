var SkyTransform = (function () {
    function SkyTransform() {
    }
    SkyTransform.execute = function (pos, now, w, h) {
        var coord = [pos.ra, pos.dec];
        Astro.precess(Astro.JD_J2000, now.jd, coord);
        coord[0] = now.lst - coord[0];
        Astro.aa_hadec(now.latitude, coord, coord);
        if (coord[1] < 0)
            pos.visible = false;
        else {
            pos.visible = true;
            var tmp = 0.5 - coord[1] / Math.PI;
            pos.x = w * (0.5 - tmp * Math.sin(coord[0]));
            pos.y = h * (0.5 - tmp * Math.cos(coord[0]));
        }
        return coord;
    };
    return SkyTransform;
}());
//# sourceMappingURL=SkyTransform.js.map