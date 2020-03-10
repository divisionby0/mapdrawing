var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
///<reference path="../TemplateEditorView.ts"/>
///<reference path="../../../lib/events/EventBus.ts"/>
///<reference path="../EditorEvent.ts"/>
var GeographicEditorView = (function (_super) {
    __extends(GeographicEditorView, _super);
    function GeographicEditorView() {
        _super.apply(this, arguments);
    }
    GeographicEditorView.prototype.reset = function () {
        if (this.placeLabelsButton) {
            this.placeLabelsButton.bootstrapToggle('off');
        }
    };
    GeographicEditorView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
        EventBus.addEventListener(EditorEvent.COORDINATES_CHANGED, function (data) { return _this.onCoordinatesChanged(data); });
        this.placeLabelsButton.change(function () { return _this.onPlaceLabelsChanged(); });
        this.text_1_input.on("input", function () { return _this.onText_1_changed(); });
        this.text_2_input.on("input", function () { return _this.onText_2_changed(); });
        this.text_3_input.on("input", function () { return _this.onText_3_changed(); });
    };
    GeographicEditorView.prototype.addControls = function () {
        this.text_1_input = this.j$("#text_1_Input");
        this.text_2_input = this.j$("#text_2_Input");
        this.text_3_input = this.j$("#text_3_Input");
        this.placeLabelsButton = this.j$('#placeLabelsButton');
        this.placeLabelsButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Улицы',
            off: 'Улицы',
            onstyle: 'primary'
        });
    };
    GeographicEditorView.prototype.onPlaceLabelsChanged = function () {
        EventBus.dispatchEvent(EditorEvent.PLACE_LABELS_CHANGED, this.placeLabelsButton.is(':checked'));
    };
    GeographicEditorView.prototype.onCityChanged = function (data) {
        var city = data.city;
        var country = data.country;
        console.log("GeographicEditorView onCityChanged data=", data);
        var coord = data.coord;
        this.text_1_input.val(city);
        this.text_2_input.val(country);
        this.text_3_input.val(parseFloat(coord[0]).toFixed(5) + " " + parseFloat(coord[1]).toFixed(5));
    };
    GeographicEditorView.prototype.onCoordinatesChanged = function (data) {
        this.text_3_input.val(parseFloat(data[0]).toFixed(5) + " " + parseFloat(data[1]).toFixed(5));
    };
    GeographicEditorView.prototype.onText_1_changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, this.text_1_input.val());
    };
    GeographicEditorView.prototype.onText_2_changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, this.text_2_input.val());
    };
    GeographicEditorView.prototype.onText_3_changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_3_CHANGED, this.text_3_input.val());
    };
    return GeographicEditorView;
}(TemplateEditorView));
//# sourceMappingURL=GeographicEditorView.js.map