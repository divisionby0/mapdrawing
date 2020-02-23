var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="./TextTemplateLayer.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
var DateTimeTemplateLayer = (function (_super) {
    __extends(DateTimeTemplateLayer, _super);
    function DateTimeTemplateLayer(id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight) {
        if (left === void 0) { left = null; }
        if (top === void 0) { top = null; }
        if (right === void 0) { right = null; }
        if (bottom === void 0) { bottom = null; }
        _super.call(this, id, aspectRatio, type, text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.dateVisible = true;
        this.timeVisible = true;
        this.monthNames = new Array("Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря");
        this.createListener();
    }
    DateTimeTemplateLayer.prototype.onDestroy = function () {
        var _this = this;
        EventBus.removeEventListener(EditorEvent.DATE_TIME_CHANGED, function (data) { return _this.onDateTimeChanged(data); });
        EventBus.removeEventListener(EditorEvent.DATE_VISIBILITY_CHANGED, function (data) { return _this.onDateVisibilityChanged(data); });
        EventBus.removeEventListener(EditorEvent.TIME_VISIBILITY_CHANGED, function (data) { return _this.onTimeVisibilityChanged(data); });
    };
    DateTimeTemplateLayer.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.DATE_TIME_CHANGED, function (data) { return _this.onDateTimeChanged(data); });
        EventBus.addEventListener(EditorEvent.DATE_VISIBILITY_CHANGED, function (data) { return _this.onDateVisibilityChanged(data); });
        EventBus.addEventListener(EditorEvent.TIME_VISIBILITY_CHANGED, function (data) { return _this.onTimeVisibilityChanged(data); });
    };
    DateTimeTemplateLayer.prototype.onDateTimeChanged = function (data) {
        this.data = data;
        this.updateText();
    };
    DateTimeTemplateLayer.prototype.updateText = function () {
        this.text = "";
        var day;
        var month;
        var hours;
        var minutes;
        if (!this.data) {
            return;
        }
        if (this.dateVisible) {
            if (this.data.day.toString().length < 2) {
                day = "0" + this.data.day;
            }
            else {
                day = this.data.day;
            }
            month = this.parseMonthName(parseInt(this.data.month));
            this.text += day + " " + month + " " + this.data.year;
        }
        if (this.timeVisible) {
            if (this.dateVisible) {
                this.text += ",";
            }
            if (this.data.hours.toString().length < 2) {
                hours = "0" + this.data.hours;
            }
            else {
                hours = this.data.hours;
            }
            if (this.data.minutes.toString().length < 2) {
                minutes = "0" + this.data.minutes;
            }
            else {
                minutes = this.data.minutes;
            }
            this.text += " " + hours + ":" + minutes;
        }
    };
    DateTimeTemplateLayer.prototype.parseMonthName = function (monthNumber) {
        return this.monthNames[monthNumber].toUpperCase();
    };
    DateTimeTemplateLayer.prototype.onDateVisibilityChanged = function (data) {
        this.dateVisible = data.visible;
        this.updateText();
    };
    DateTimeTemplateLayer.prototype.onTimeVisibilityChanged = function (data) {
        this.timeVisible = data.visible;
        this.updateText();
    };
    return DateTimeTemplateLayer;
}(TextTemplateLayer));
//# sourceMappingURL=DateTimeTemplateLayer.js.map