///<reference path="EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/TextTemplateLayer.ts"/>
///<reference path="../element/LayerView.ts"/>
///<reference path="../LayerId.ts"/>
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
                if (layerId == LayerId.TEXT_LAYER_1_ID) {
                    this.text_1_input.val(layerText);
                }
                if (layerId == LayerId.TEXT_LAYER_2_ID) {
                    this.text_2_input.val(layerText);
                }
            }
        }
    };
    TemplateEditorView.prototype.reset = function (settings) {
        if (this.constellationLinesButton) {
            settings.constellations ? this.constellationLinesButton.bootstrapToggle('on') : this.constellationLinesButton.bootstrapToggle('off');
        }
        if (this.starsMultiColorsButton) {
            this.starsMultiColorsButton.bootstrapToggle('off');
        }
        if (this.dateButton) {
            settings.date ? this.dateButton.bootstrapToggle('on') : this.dateButton.bootstrapToggle('off');
        }
        if (this.timeButton) {
            settings.time ? this.timeButton.bootstrapToggle('on') : this.timeButton.bootstrapToggle('off');
        }
        if (this.cityButton) {
            settings.place ? this.cityButton.bootstrapToggle('on') : this.cityButton.bootstrapToggle('off');
        }
        if (this.borderButton) {
            settings.border ? this.borderButton.bootstrapToggle('on') : this.borderButton.bootstrapToggle('off');
        }
        if (this.circleBorderButton) {
            settings.circle ? this.circleBorderButton.bootstrapToggle('on') : this.circleBorderButton.bootstrapToggle('off');
        }
        if (this.coordinatesButton) {
            settings.coordinates ? this.coordinatesButton.bootstrapToggle('on') : this.coordinatesButton.bootstrapToggle('off');
        }
    };
    TemplateEditorView.prototype.createListeners = function () {
        var _this = this;
        this.constellationLinesButton.change(function () { return _this.onConstellationsChanged(); });
        this.starsMultiColorsButton.change(function () { return _this.onStarsChanged(); });
        this.circleBorderButton.change(function () { return _this.onCircleBorderChanged(); });
        this.borderButton.change(function () { return _this.onBorderChanged(); });
        this.cityButton.change(function () { return _this.onCityVisibilityChanged(); });
        this.coordinatesButton.change(function () { return _this.onCoordinatesVisibilityChanged(); });
        this.dateButton.change(function () { return _this.onDateVisibilityChanged(); });
        this.timeButton.change(function () { return _this.onTimeVisibilityChanged(); });
        this.text_1_input.on("input", function () { return _this.onText1Changed(); });
        this.text_2_input.on("input", function () { return _this.onText2Changed(); });
        this.text_3_input.on("input", function () { return _this.onText3Changed(); });
    };
    TemplateEditorView.prototype.addControls = function () {
        this.constellationLinesButton = this.j$('#constellationLinesButton');
        this.starsMultiColorsButton = this.j$('#starsMultiColorsButton');
        this.dateButton = this.j$('#dateButton');
        this.timeButton = this.j$('#timeButton');
        this.cityButton = this.j$('#placeButton');
        this.borderButton = this.j$('#borderButton');
        this.circleBorderButton = this.j$('#circleBorderButton');
        this.coordinatesButton = this.j$('#coordinatesButton');
        this.text_1_input = this.j$("#text_1_input");
        this.text_2_input = this.j$("#text_2_input");
        this.text_3_input = this.j$("#text_3_input");
        this.constellationLinesButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Созвездия',
            off: 'Созвездия',
            onstyle: 'primary'
        });
        this.starsMultiColorsButton.bootstrapToggle({
            style: "starmapEditorButton ",
            on: 'Цветн. звезды',
            off: 'Ч/б звезды',
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
        this.cityButton.bootstrapToggle({
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
    TemplateEditorView.prototype.onStarsChanged = function () {
        EventBus.dispatchEvent(EditorEvent.STARS_CHANGED, this.starsMultiColorsButton.is(':checked'));
    };
    TemplateEditorView.prototype.onCircleBorderChanged = function () {
        EventBus.dispatchEvent(EditorEvent.CIRCLE_BORDER_CHANGED, this.circleBorderButton.is(':checked'));
    };
    TemplateEditorView.prototype.onBorderChanged = function () {
        EventBus.dispatchEvent(EditorEvent.BORDER_CHANGED, this.borderButton.is(':checked'));
    };
    TemplateEditorView.prototype.onText1Changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_1_CHANGED, { text: this.text_1_input.val(), elementId: LayerId.TEXT_LAYER_1_ID });
    };
    TemplateEditorView.prototype.onText2Changed = function () {
        EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, { text: this.text_2_input.val(), elementId: LayerId.TEXT_LAYER_2_ID });
    };
    TemplateEditorView.prototype.onText3Changed = function () {
        //EventBus.dispatchEvent(EditorEvent.TEXT_2_CHANGED, {text:this.text_2_input.val(), elementId:LayerId.TEXT_LAYER_2_ID});
    };
    TemplateEditorView.prototype.onCityVisibilityChanged = function () {
        EventBus.dispatchEvent(EditorEvent.CITY_VISIBILITY_CHANGED, { visible: this.cityButton.is(':checked') });
    };
    TemplateEditorView.prototype.onCoordinatesVisibilityChanged = function () {
        EventBus.dispatchEvent(EditorEvent.COORDINATES_VISIBILITY_CHANGED, { visible: this.coordinatesButton.is(':checked') });
    };
    TemplateEditorView.prototype.onDateVisibilityChanged = function () {
        EventBus.dispatchEvent(EditorEvent.DATE_VISIBILITY_CHANGED, { visible: this.dateButton.is(':checked') });
    };
    TemplateEditorView.prototype.onTimeVisibilityChanged = function () {
        EventBus.dispatchEvent(EditorEvent.TIME_VISIBILITY_CHANGED, { visible: this.timeButton.is(':checked') });
    };
    return TemplateEditorView;
}());
//# sourceMappingURL=TemplateEditorView.js.map