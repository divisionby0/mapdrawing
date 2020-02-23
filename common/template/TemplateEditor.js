///<reference path="editor/TemplateEditorView.ts"/>
///<reference path="editor/TemplateEditorModel.ts"/>
///<reference path="editor/TemplateEditorController.ts"/>
///<reference path="editor/TemplatesList.ts"/>
var TemplateEditor = (function () {
    function TemplateEditor(j$) {
        var view = new TemplateEditorView(j$);
        var model = new TemplateEditorModel(view);
        new TemplateEditorController(model);
        this.createList(j$);
    }
    TemplateEditor.prototype.createList = function (j$) {
        new TemplatesList(j$);
    };
    return TemplateEditor;
}());
//# sourceMappingURL=TemplateEditor.js.map