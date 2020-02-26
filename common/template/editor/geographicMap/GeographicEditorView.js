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
    GeographicEditorView.prototype.createListeners = function () {
        var _this = this;
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, function (data) { return _this.onCityChanged(data); });
        this.placeLabelsButton.change(function () { return _this.onPlaceLabelsChanged(); });
    };
    GeographicEditorView.prototype.addControls = function () {
        this.text_1_input = this.j$("#text_1_Input");
        this.text_2_input = this.j$("#text_2_Input");
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
        this.text_1_input.val(city);
    };
    return GeographicEditorView;
}(TemplateEditorView));
//# sourceMappingURL=GeographicEditorView.js.map