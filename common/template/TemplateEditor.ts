///<reference path="editor/TemplateEditorView.ts"/>
///<reference path="editor/TemplateEditorModel.ts"/>
///<reference path="editor/TemplateEditorController.ts"/>
///<reference path="editor/TemplatesList.ts"/>
class TemplateEditor{
    constructor(j$:any){
        var view:TemplateEditorView = new TemplateEditorView(j$);
        var model:TemplateEditorModel = new TemplateEditorModel(view);
        new TemplateEditorController(model);
        
        this.createList(j$);
    }

    private createList(j$:any):void {
        new TemplatesList(j$);
    }
}
