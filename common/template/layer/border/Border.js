///<reference path="../Parameter.ts"/>
///<reference path="BorderSccBuilder.ts"/>
var Border = (function () {
    function Border(weight, color, rest) {
        this.weight = weight;
        this.color = color;
        this.rest = rest;
    }
    Border.prototype.getWeight = function () {
        return this.weight;
    };
    Border.prototype.setWeight = function (value) {
        this.weight.setValue(value);
    };
    Border.prototype.getColor = function () {
        return this.color;
    };
    Border.prototype.getRest = function () {
        return this.rest;
    };
    Border.prototype.toCssString = function () {
        return BorderSccBuilder.build(this);
    };
    return Border;
}());
//# sourceMappingURL=Border.js.map