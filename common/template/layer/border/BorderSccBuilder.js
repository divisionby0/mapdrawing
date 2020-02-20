///<reference path="Border.ts"/>
var BorderSccBuilder = (function () {
    function BorderSccBuilder() {
    }
    BorderSccBuilder.build = function (border) {
        var i;
        var cssString = "";
        var restParameters = border.getRest();
        cssString += border.getWeight().getValue() + border.getWeight().getPoints() + " " + border.getColor() + " ";
        for (i = 0; i < restParameters.length; i++) {
            cssString += restParameters[i] + " ";
        }
        return cssString;
    };
    return BorderSccBuilder;
}());
//# sourceMappingURL=BorderSccBuilder.js.map