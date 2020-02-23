///<reference path="TemplateEditorView.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
var TemplateEditorModel = (function () {
    function TemplateEditorModel(view) {
        this.defaultSettings = { constellations: true, date: true, time: true, place: true, border: true, circle: true, coordinates: true };
        this.view = view;
    }
    TemplateEditorModel.prototype.onTemplateChanged = function (template) {
        this.currentTemplate = template;
        this.view.reset(this.defaultSettings);
        this.view.setData(template);
    };
    return TemplateEditorModel;
}());
//# sourceMappingURL=TemplateEditorModel.js.map