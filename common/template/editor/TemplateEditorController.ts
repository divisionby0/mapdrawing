///<reference path="TemplateEditorModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
class TemplateEditorController{
    private model:TemplateEditorModel;
    
    constructor(model:TemplateEditorModel){
        this.model = model;
        
        EventBus.addEventListener("TEMPLATE_CHANGED", (template)=>this.onTemplateChanged(template));
    }

    private onTemplateChanged(template:Template):void {
        this.model.onTemplateChanged(template);
    }
}