///<reference path="../template/layer/Parameter.ts"/>
///<reference path="../template/layer/border/Border.ts"/>
var Utils = (function () {
    function Utils() {
    }
    Utils.parseBorderParameters = function (sourceBorderString) {
        var i;
        var borderParseResult = this.parseBorderWeightAndRestParameters(sourceBorderString);
        var borderWeight = borderParseResult[0][0];
        var borderRestParameters = borderParseResult[1];
        var borderWeightAndPointsParsed = Utils.parseValueAndPoints(borderWeight);
        var borderWeightParameter = new Parameter(borderWeightAndPointsParsed[0], borderWeightAndPointsParsed[1]);
        var color = "rgba(0,0,0,0)"; // by default transparent
        var colorCurrentIndex = -1;
        for (i = 0; i < borderRestParameters.length; i++) {
            var restParameter = borderRestParameters[i];
            var colorPrefixPosition = restParameter.indexOf("#");
            if (colorPrefixPosition != -1) {
                color = restParameter;
                colorCurrentIndex = i;
                break;
            }
        }
        borderRestParameters.splice(colorCurrentIndex, 1);
        return new Border(borderWeightParameter, color, borderRestParameters);
        //return {weight:borderWeightParameter, color:color, rest:borderRestParameters};
    };
    Utils.updateFontSizeString = function (sourceFontSizeString, coeff) {
        var valueParsed = Utils.parseValueAndPoints(sourceFontSizeString);
        var fontSizeIntVal = valueParsed[0];
        var points = valueParsed[1];
        return ((fontSizeIntVal * coeff).toFixed(2)).toString() + "" + points;
    };
    Utils.updateBorderString = function (sourceBorderString, coeff) {
        var i;
        var borderParseResult = this.parseBorderWeightAndRestParameters(sourceBorderString);
        var borderWeight = borderParseResult[0][0];
        var borderRestParameters = borderParseResult[1];
        var borderValueAndPointsParsed = Utils.parseValueAndPoints(borderWeight);
        var newBorderString = (parseFloat(borderValueAndPointsParsed[0]) * coeff).toFixed(2) + "" + borderValueAndPointsParsed[1];
        for (i = 0; i < borderRestParameters.length; i++) {
            newBorderString += " " + borderRestParameters[i];
        }
        return newBorderString;
    };
    Utils.parseBorderWeightAndRestParameters = function (sourceBorderString) {
        var borderStringParts = sourceBorderString.split(" ");
        var newArray = new Array();
        var restDataArray = new Array();
        for (var i = 0; i < borderStringParts.length; i++) {
            var stringPart = borderStringParts[i];
            var isHexColor = stringPart.indexOf("#") != -1;
            var isNumber = !isNaN(parseInt(stringPart));
            if (!isHexColor && isNumber) {
                newArray.push(stringPart);
            }
            else {
                restDataArray.push(stringPart);
            }
        }
        return [newArray, restDataArray];
    };
    Utils.parseValueAndPoints = function (value) {
        var intVal = parseFloat(value);
        var pointsIndex = value.indexOf(intVal.toString()) + intVal.toString().length;
        var points = value.substring(pointsIndex, value.length);
        return [intVal, points];
    };
    return Utils;
}());
//# sourceMappingURL=Utils.js.map