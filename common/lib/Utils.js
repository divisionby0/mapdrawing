var Utils = (function () {
    function Utils() {
    }
    Utils.updateFontSizeString = function (sourceFontSizeString, coeff) {
        var valueParsed = Utils.parseValueAndPoints(sourceFontSizeString);
        var fontSizeIntVal = valueParsed[0];
        var points = valueParsed[1];
        return ((fontSizeIntVal * coeff).toFixed(2)).toString() + "" + points;
    };
    Utils.updateBorderString = function (sourceBorderString, coeff) {
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
        var borderWidthValue = newArray[0];
        var valueParsed = Utils.parseValueAndPoints(borderWidthValue);
        var newBorderString = (parseFloat(valueParsed[0]) * coeff).toFixed(2) + "" + valueParsed[1];
        for (i = 0; i < restDataArray.length; i++) {
            newBorderString += " " + restDataArray[i];
        }
        return newBorderString;
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