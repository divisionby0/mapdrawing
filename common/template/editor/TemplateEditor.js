///<reference path="TemplateEditorView.ts"/>
///<reference path="TemplateEditorModel.ts"/>
///<reference path="TemplateEditorController.ts"/>
///<reference path="templatesList/TemplatesList.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../TemplateBuilder.ts"/>
///<reference path="datetime/DateTimeSelector.ts"/>
var TemplateEditor = (function () {
    function TemplateEditor(j$) {
        this.currentTemplateIndex = 0;
        this.j$ = j$;
        var view = new TemplateEditorView(j$);
        var model = new TemplateEditorModel(view);
        this.controller = new TemplateEditorController(model);
        this.createListener();
    }
    TemplateEditor.prototype.setTemplates = function (collection) {
        this.templateCollection = collection;
        this.createList(this.j$);
        this.currentTemplate = this.templateCollection.get(this.currentTemplateIndex);
        this.controller.changeTemplate(this.currentTemplate);
        this.createTemplateElement("templateElement", "planicanvaZZ", 1);
        this.createSearchCity();
        this.createDateTimeSelector();
        EventBus.dispatchEvent("UPDATE_STARMAP", null);
    };
    TemplateEditor.prototype.createList = function (j$) {
        new TemplatesList(j$, this.templateCollection);
    };
    TemplateEditor.prototype.onTemplateSelected = function (index) {
        if (index == this.currentTemplateIndex) {
            return;
        }
        this.currentTemplateIndex = index;
        this.currentTemplate = this.templateCollection.get(this.currentTemplateIndex);
        this.controller.changeTemplate(this.currentTemplate);
        this.createTemplateElement("templateElement", "planicanvaZZ", 1);
    };
    TemplateEditor.prototype.createTemplateElement = function (elementId, selfContainerId, coeff) {
        new TemplateBuilder(this.j$, this.currentTemplate, elementId, selfContainerId, coeff);
    };
    TemplateEditor.prototype.createListener = function () {
        var _this = this;
        EventBus.addEventListener(Template.ON_SELECT, function (index) { return _this.onTemplateSelected(index); });
    };
    TemplateEditor.prototype.createSearchCity = function () {
    };
    TemplateEditor.prototype.createDateTimeSelector = function () {
        new DateTimeSelector(this.j$);
    };
    return TemplateEditor;
}());
//# sourceMappingURL=TemplateEditor.js.map