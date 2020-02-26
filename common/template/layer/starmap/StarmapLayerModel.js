var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../TemplateLayer.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../../editor/EditorEvent.ts"/>
///<reference path="StarmapLayerView.ts"/>
var StarmapLayerModel = (function (_super) {
    __extends(StarmapLayerModel, _super);
    function StarmapLayerModel(id, aspectRatio, type, left, top, right, bottom, changeable, color, backgroundColor, constellationColor, borderColor, borderWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        if (changeable === void 0) { changeable = false; }
        if (color === void 0) { color = "0"; }
        _super.call(this, id, aspectRatio, type, left, top, right, bottom, changeable);
        this.borderVisible = true;
        this.hasColoredStars = false;
        this.hasConstellations = true;
        this.starsColor = color;
        this.backgroundColor = backgroundColor;
        this.constellationColor = constellationColor;
        this.borderColor = borderColor;
        this.borderWeight = borderWeight;
        this.cachedBorderColor = borderColor;
        this.cachedConstellationColor = constellationColor;
    }
    StarmapLayerModel.prototype.setView = function (view) {
        _super.prototype.setView.call(this, view);
        if (this.currentDate) {
            this.view.setDate(this.currentDate);
            this.view.setHasConstellations(this.hasConstellations);
            this.view.setHasColoredStars(this.hasColoredStars);
            this.view.setHasCircleBorder(this.borderVisible);
            this.view.setCoord(this.currentCoord);
        }
    };
    StarmapLayerModel.prototype.onDateTimeChanged = function (date) {
        var userDate = new Date();
        userDate.setFullYear(date.year);
        userDate.setMonth(date.month);
        userDate.setDate(date.day);
        userDate.setHours(date.hours);
        userDate.setMinutes(date.minutes);
        this.currentDate = userDate.toString();
        if (this.view) {
            this.view.setDate(this.currentDate);
        }
    };
    StarmapLayerModel.prototype.onCityChanged = function (data) {
        console.log("onCityChanged data=", data);
        this.currentCity = data.city;
        this.currentCoord = data.coord;
        try {
            this.view.setCoord(data.coord);
        }
        catch (error) {
        }
    };
    StarmapLayerModel.prototype.hasBackgroundColor = function () {
        if (this.backgroundColor != null && this.backgroundColor != undefined && this.backgroundColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapLayerModel.prototype.hasConstellationColor = function () {
        if (this.constellationColor != null && this.constellationColor != undefined && this.constellationColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapLayerModel.prototype.hasStarsColor = function () {
        if (this.starsColor != null && this.starsColor != undefined && this.starsColor != "") {
            return true;
        }
        else {
            return false;
        }
    };
    StarmapLayerModel.prototype.getBackgroundColor = function () {
        return this.backgroundColor;
    };
    StarmapLayerModel.prototype.getStarsColor = function () {
        return this.starsColor;
    };
    StarmapLayerModel.prototype.getConstellationColor = function () {
        return this.constellationColor;
    };
    StarmapLayerModel.prototype.getBorderColor = function () {
        return this.borderColor;
    };
    StarmapLayerModel.prototype.getBorderWeight = function () {
        return this.borderWeight;
    };
    StarmapLayerModel.prototype.hasBorder = function () {
        return this.borderVisible;
    };
    StarmapLayerModel.prototype.setBorderVisible = function (visible) {
        this.borderVisible = visible;
        if (visible) {
            this.borderColor = this.cachedBorderColor;
        }
        else {
            this.borderColor = "rgba(0,0,0,0)";
        }
    };
    StarmapLayerModel.prototype.setConstellationVisible = function (visible) {
        if (visible) {
            this.constellationColor = this.cachedConstellationColor;
        }
        else {
            this.constellationColor = "rgba(0,0,0,0)";
        }
    };
    StarmapLayerModel.prototype.getHasMulticoloredStars = function () {
        return this.hasColoredStars;
    };
    StarmapLayerModel.prototype.setStarsMulticolored = function (isMulticolored) {
        this.hasColoredStars = isMulticolored;
    };
    StarmapLayerModel.prototype.setHasConstellations = function (value) {
        this.hasConstellations = value;
        try {
            this.view.setHasConstellations(this.hasConstellations);
        }
        catch (error) {
        }
    };
    StarmapLayerModel.prototype.setHasColoredStars = function (value) {
        this.hasColoredStars = value;
        try {
            this.view.setHasColoredStars(this.hasColoredStars);
        }
        catch (error) {
        }
    };
    StarmapLayerModel.prototype.hasCircleBorder = function (value) {
        this.borderVisible = value;
        try {
            this.view.setHasCircleBorder(this.borderVisible);
        }
        catch (error) {
        }
    };
    return StarmapLayerModel;
}(TemplateLayer));
//# sourceMappingURL=StarmapLayerModel.js.map