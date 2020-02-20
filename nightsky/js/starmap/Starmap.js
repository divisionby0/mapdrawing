///<reference path="PlanetFinder.ts"/>
///<reference path="MoonFinder.ts"/>
///<reference path="SkyTransform.ts"/>
///<reference path="../../../common/lib/events/EventBus.ts"/>
///<reference path="../../../common/template/editor/EditorEvent.ts"/>
var Starmap = (function () {
    function Starmap(j$, containerId, coeff) {
        var _this = this;
        this.now = {};
        this.moon = { pos: { ra: 0, dec: 0 } };
        this.clipped = true;
        this.ck_starlabels = false;
        this.ck_conlabels = false;
        this.ck_dsos = false;
        this.ck_conlines = true;
        this.hasBorder = true;
        this.hasConstellationsLines = true;
        this.constellationColor = "#d8d8d8";
        this.containerId = "";
        this.ver = "0.0.3";
        this.coeff = 1;
        this.j$ = j$;
        this.containerId = containerId;
        this.coeff = coeff;
        console.log("Starmap ver=" + this.ver);
        EventBus.addEventListener(EditorEvent.CONSTELLATIONS_CHANGED, function (value) { return _this.onConstellationsChanged(value); });
        EventBus.addEventListener(EditorEvent.CIRCLE_BORDER_CHANGED, function (value) { return _this.onCircleBorderChanged(value); });
    }
    Starmap.prototype.setBorderColor = function (value) {
        this.borderColor = value;
    };
    Starmap.prototype.setBorderWeight = function (value) {
        this.borderWeight = value;
    };
    Starmap.prototype.setBackgroundColor = function (value) {
        this.bgcolor = value;
    };
    Starmap.prototype.setConstellationColor = function (value) {
        this.constellationColor = value;
    };
    Starmap.prototype.setStarColor = function (value) {
        this.starColor = value;
    };
    Starmap.prototype.setContainer = function (value) {
        this.containerId = value;
    };
    Starmap.prototype.create = function () {
        this.init_stars(star);
        this.init_dsos(dso);
        this.init_planets(planet);
        this.now = new Observer();
        this.set_user_obs();
        this.refresh();
        this.setDateNow();
    };
    Starmap.prototype.refresh = function () {
        var canvas = document.getElementById(this.containerId);
        if (!canvas || !canvas.getContext)
            return;
        var context = canvas.getContext("2d");
        this.draw_sky(context, canvas.width, canvas.height);
    };
    Starmap.prototype.update = function () {
        var dt = document.getElementById("user_date");
        var lon = document.getElementById("user_lon");
        var lat = document.getElementById("user_lat");
        var clin = document.getElementById("constellationLinesButton");
        var n = Date.parse(dt.value);
        if (isNaN(n)) {
            alert("Your browser doesn't think\n'" + dt.value + "'\nis a valid date.");
            this.set_user_obs();
            return;
        }
        var d = new Date(n);
        this.now.setDate(d);
        if (lon.value >= -180 && lon.value < 360)
            this.now.setLonDegrees(lon.value);
        if (lat.value >= -90 && lat.value <= 90)
            this.now.setLatDegrees(lat.value);
        this.ck_conlines = clin.checked;
        this.set_user_obs();
        this.refresh();
    };
    Starmap.prototype.draw_sky = function (context, w, h) {
        var totalStars = star.length;
        var totalLines;
        var totalPlanets = 0;
        PlanetFinder.find(planet[2], null, this.now.jd);
        var azalt = SkyTransform.execute(planet[2].pos, this.now, w, h);
        context.clearRect(0, 0, w, h);
        if (this.bgcolor == null || this.bgcolor == undefined || this.bgcolor == "") {
            this.bgcolor = "rgba(0,0,0,0)";
        }
        //var clipArcRadius:number = w / 2 - this.borderWeight*this.coeff*3;
        var clipArcRadius = w / 2 - this.borderWeight * this.coeff;
        //console.log("clipArcRadius="+clipArcRadius);
        //console.log("w / 2="+w / 2);
        context.fillStyle = this.bgcolor;
        context.beginPath();
        context.arc(w / 2, h / 2, clipArcRadius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        if (!this.clipped) {
            context.clip();
            this.clipped = true;
        }
        context.lineWidth = 1;
        for (var i = 0; i < totalStars; i++) {
            var currentStar = star[i];
            SkyTransform.execute(currentStar.pos, this.now, w, h);
            if (currentStar.pos.visible) {
                this.draw_star(context, currentStar);
            }
        }
        if (this.hasConstellationsLines) {
            context.strokeStyle = this.constellationColor;
            totalLines = conline.length;
            for (i = 0; i < totalLines; i++) {
                var currentConline = conline[i];
                this.draw_line(context, star[currentConline[0]], star[currentConline[1]]);
            }
        }
        for (i = 0; i < totalPlanets; i++) {
            var currentPlanet = planet[i];
            if (i != 2) {
                PlanetFinder.find(currentPlanet, planet[2], this.now.jd);
                SkyTransform.execute(currentPlanet.pos, this.now, w, h);
            }
            if (currentPlanet.pos.visible)
                this.draw_planet(context, currentPlanet);
        }
        MoonFinder.find(this.moon, planet[2], this.now.jd);
        SkyTransform.execute(this.moon.pos, this.now, w, h);
        if (this.moon.pos.visible) {
            this.draw_moon(context);
        }
        // draw border using stroke
        if (this.hasBorder && this.borderColor != null && this.borderColor != undefined && this.borderColor != "") {
            context.strokeStyle = this.borderColor;
            context.lineWidth = this.borderWeight * this.coeff;
            context.beginPath();
            context.arc(w / 2, h / 2, w / 2 - this.borderWeight * this.coeff / 2, 0, 2 * Math.PI);
            context.stroke();
        }
    };
    Starmap.prototype.init_stars = function (collection) {
        var clut = [
            "#AEC1FF",
            "#C5D3FF",
            "#EAEDFF",
            "#FFF6F3",
            "#FFEAD3",
            "#FFE1B4",
            "#FFD7A6",
            "#FFC682",
            "#FF4500" /* bv =  2.0 */
        ];
        var len = collection.length;
        for (var i = 0; i < len; i++) {
            var currentStar = collection[i];
            if (currentStar.mag < 3.5) {
                // near focused stars
                var cindex = Math.round(8 * (currentStar.bv + 0.4) / 2.4);
                cindex = Math.max(0, Math.min(8, cindex));
                if (this.starColor != null && this.starColor != undefined && this.starColor != "") {
                    currentStar.color = this.starColor;
                }
                else {
                    currentStar.color = clut[cindex];
                }
                currentStar.radius = 3.1 - 0.6 * currentStar.mag; // 1.0 to 4.0
                currentStar.bright = true;
            }
            else {
                // far unfocused stars
                var gray = 160 - Math.round((currentStar.mag - 3.5) * 80.0);
                if (this.starColor != null && this.starColor != undefined && this.starColor != "") {
                    currentStar.color = this.starColor;
                }
                else {
                    currentStar.color = "#" + (1 << 24 | gray << 16 | gray << 8 | gray).toString(16).slice(1);
                }
                currentStar.radius = 0.7;
                currentStar.bright = false;
            }
        }
    };
    Starmap.prototype.init_planets = function (collection) {
        var seps = 0.397777156;
        var ceps = 0.917482062;
        var i;
        var so, co, si, ci, sw, cw, f1, f2;
        for (i = 0; i < 9; i++) {
            var currentPlanet = collection[i];
            so = Math.sin(currentPlanet.o);
            co = Math.cos(currentPlanet.o);
            si = Math.sin(currentPlanet.i);
            ci = Math.cos(currentPlanet.i);
            sw = Math.sin(currentPlanet.wb - currentPlanet.o);
            cw = Math.cos(currentPlanet.wb - currentPlanet.o);
            f1 = cw * so + sw * co * ci;
            f2 = cw * co * ci - sw * so;
            currentPlanet.P = [];
            currentPlanet.Q = [];
            currentPlanet.P[0] = cw * co - sw * so * ci;
            currentPlanet.P[1] = ceps * f1 - seps * sw * si;
            currentPlanet.P[2] = seps * f1 + ceps * sw * si;
            currentPlanet.Q[0] = -sw * co - cw * so * ci;
            currentPlanet.Q[1] = ceps * f2 - seps * cw * si;
            currentPlanet.Q[2] = seps * f2 + ceps * cw * si;
            switch (i) {
                case 2:
                    currentPlanet.radius = 5;
                    break;
                case 8:
                    currentPlanet.radius = 2;
                    break;
                default:
                    currentPlanet.radius = 3;
                    break;
            }
            currentPlanet.bright = true;
        }
    };
    Starmap.prototype.init_dsos = function (dso) {
        var i;
        var clut = [
            "#A0A040",
            "#A0A040",
            "#40A060",
            "#40A060",
            "#40A060",
            "#A04040",
            "#808080" /* 7 other             */
        ];
        var len = dso.length;
        for (i = 0; i < len; i++) {
            dso[i].color = clut[dso[i].type - 1];
            dso[i].offsetx = 4;
            dso[i].offsety = -3;
            switch (dso[i].catalog) {
                case 1:
                    dso[i].name = "M" + dso[i].id.toString();
                    break;
                case 2:
                    dso[i].name = dso[i].id.toString();
                    break;
                case 0:
                    dso[i].name = dso[i].id == 2 ? "SMC" : "LMC";
                    break;
                default: dso[i].name = " ";
            }
            /* special cases */
            switch (dso[i].catalog) {
                case 1:
                    switch (dso[i].id) {
                        case 8:
                            dso[i].offsetx = 4;
                            dso[i].offsety = 6;
                            break;
                        case 81:
                            dso[i].offsetx = -24;
                            dso[i].offsety = 0;
                            break;
                        case 86:
                            dso[i].offsetx = -24;
                            break;
                        default: break;
                    }
                    break;
                case 2:
                    switch (dso[i].id) {
                        case 869:
                            dso[i].name = "869/884";
                            break;
                        default: break;
                    }
                    break;
                default: break;
            }
        }
    };
    Starmap.prototype.set_user_obs = function () {
        var dt = new Date().toString(); //Thu Feb 22 2018 14:13:07 GMT-0500
        var lon = -75;
        var lat = 40;
        var slab = 0;
        var clab = 0;
        var idso = 1;
        var clin = 1;
        var d = this.now.getDate();
        dt.value = d.toString().slice(0, 33);
        lon.value = this.now.getLonDegrees();
        lat.value = this.now.getLatDegrees();
        slab.checked = this.ck_starlabels;
        clab.checked = this.ck_conlabels;
        idso.checked = this.ck_dsos;
        clin.checked = this.ck_conlines;
    };
    Starmap.prototype.draw_star = function (context, s) {
        context.fillStyle = s.color;
        context.beginPath();
        var radius = s.radius * 1.3 * this.coeff;
        context.arc(s.pos.x, s.pos.y, radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
    };
    Starmap.prototype.draw_line = function (context, s1, s2) {
        if (s1.pos.visible && s2.pos.visible) {
            context.beginPath();
            context.moveTo(s1.pos.x, s1.pos.y);
            context.lineWidth = 0.4 * this.coeff;
            context.lineTo(s2.pos.x, s2.pos.y);
            context.stroke();
        }
    };
    Starmap.prototype.draw_planet = function (context, p) {
        this.draw_star(context, p);
    };
    Starmap.prototype.draw_moon = function (context) {
        context.globalCompositeOperation = "source-over";
        var i = Math.floor((Astro.raddeg(this.moon.phase) + 180) / 12);
        var imageElement = document.getElementById("starImage");
        context.drawImage(imageElement, i * 16, 0, 16, 16, this.moon.pos.x - 8, this.moon.pos.y - 8, 16, 16);
        context.globalCompositeOperation = "lighter";
    };
    Starmap.prototype.setDateNow = function () {
        var d = Date(Date.now());
        // Converting the number of millisecond in date string 
        var a = d.toString();
        this.j$("#user_date").val(a);
    };
    Starmap.prototype.onConstellationsChanged = function (value) {
        console.log("onConstellationsChanged");
        this.hasConstellationsLines = value;
        this.update();
    };
    Starmap.prototype.onCircleBorderChanged = function (value) {
        this.hasBorder = value;
        this.update();
    };
    return Starmap;
}());
//# sourceMappingURL=Starmap.js.map