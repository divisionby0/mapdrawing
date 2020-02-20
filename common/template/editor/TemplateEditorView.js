///<reference path="EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../element/LayerView.ts"/>
var TemplateEditorView = (function () {
    function TemplateEditorView(j$) {
        this.j$ = j$;
        this.addControls();
        this.createListeners();
    }
    TemplateEditorView.prototype.setData = function (template) {
        var layersIterator = template.getLayersIterator();
        while (layersIterator.hasNext()) {
            var layer = layersIterator.next();
            if (layer instanceof TextTemplateLayer) {
                var textLayer = layer;
                var layerId = textLayer.getId();
                var layerText = textLayer.getText();
                if (layerId == LayerView.DEFAULT_TEXT_LAYER_1_ID) {
                    this.text_1_input.val(layerText);
                }
                if (layerId == LayerView.DEFAULT_TEXT_LAYER_2_ID) {
                    this.text_2_input.val(layerText);
                }
            }
        }
    };
    TemplateEditorView.prototype.reset = function (settings) {
        settings.constellations ? this.constellationLinesButton.bootstrapToggle('on') : this.constellationLinesButton.bootstrapToggle('off');
        settings.date ? this.dateButton.bootstrapToggle('on') : this.dateButton.bootstrapToggle('off');
        settings.time ? this.timeButton.bootstrapToggle('on') : this.timeButton.bootstrapToggle('off');
        settings.place ? this.placeButton.bootstrapToggle('on') : this.placeButton.bootstrapToggle('off');
        settings.border ? this.borderButton.bootstrapToggle('on') : this.borderButton.bootstrapToggle('off');
        settings.circle ? this.circleBorderButton.bootstrapToggle('on') : this.circleBorderButton.bootstrapToggle('off');
        settings.coordinates ? this.coordinatesButton.bootstrapToggle('on') : this.coordinatesButton.bootstrapToggle('off');
    };
    TemplateEditorView.prototype.createListeners = function () {
        var _this = this;
        this.constellationLinesButton.change(function () { return _this.onConstellationsChanged(); });
        this.circleBorderButton.change(function () { return _this.onCircleBorderChanged(); });
        this.borderButton.change(function () { return _this.onBorderChanged(); });
        this.text_1_input.on("input", function () { return _this.onText1Changed(); });
        this.text_2_input.on("input", function () { return _this.onText2Changed(); });
    };
    TemplateEditorView.prototype.addControls = function () {
        this.constellationLinesButton = this.j$('#constellationLinesButton');
        this.dateButton = this.j$('#dateButton');
        this.timeButton = this.j$('#timeButton');
        this.placeButton = this.j$('#placeButton');
        this.borderButton = this.j$('#borderButton');
        this.circleBorderButton = this.j$('#circleBorderButton');
        this.coordinatesButton = this.j$('#coordinatesButton');
        this.text_1_input = this.j$("#text_1_input");
        this.text_2_input = this.j$("#text_2_input");
        this.constellationLinesButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Созвездия',
            off: 'Созвездия',
            onstyle: 'primary'
        });
        this.dateButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Дата',
            off: 'Дата',
            onstyle: 'primary'
        });
        this.timeButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Время',
            off: 'Время',
            onstyle: 'primary'
        });
        this.placeButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Место',
            off: 'Место',
            onstyle: 'primary'
        });
        this.borderButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Рамка',
            off: 'Рамка',
            onstyle: 'primary'
        });
        this.circleBorderButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Окружность',
            off: 'Окружность',
            onstyle: 'primary'
        });
        this.coordinatesButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Координаты',
            off: 'Координаты',
            onstyle: 'primary'
        });
    };
    TemplateEditorView.prototype.onConstellationsChanged = function () {
        EventBus.dispatchEvent(EditorEvent.CONSTELLATIONS_CHANGED, this.constellationLinesButton.is(':checked'));
    };
    TemplateEditorView.prototype.onCircleBorderChanged = function () {
        EventBus.dispatchEvent(EditorEvent.CIRCLE_BORDER_CHANGED, this.circleBorderButton.is(':checked'));
    };
    TemplateEditorView.prototype.onBorderChanged = function () {
        EventBus.dispatchEvent(EditorEvent.BORDER_CHANGED, this.borderButton.is(':checked'));
    };
    TemplateEditorView.prototype.onText1Changed = function () {
        console.log("onText1Changed");
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, { text: this.text_1_input.val(), elementId: LayerView.DEFAULT_TEXT_LAYER_1_ID });
    };
    TemplateEditorView.prototype.onText2Changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, { text: this.text_2_input.val(), elementId: LayerView.DEFAULT_TEXT_LAYER_2_ID });
    };
    return TemplateEditorView;
}());
//# sourceMappingURL=TemplateEditorView.js.map