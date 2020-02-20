var Parameter = (function () {
    function Parameter(value, points) {
        this.value = value;
        this.points = points;
    }
    Parameter.prototype.getValue = function () {
        return this.value;
    };
    Parameter.prototype.setValue = function (value) {
        this.value = value;
    };
    Parameter.prototype.getPoints = function () {
        return this.points;
    };
    return Parameter;
}());
//# sourceMappingURL=Parameter.js.map