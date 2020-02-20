///<reference path="TemplateEditorView.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../layer/LayerType.ts"/>
class TemplateEditorModel{
    private view:TemplateEditorView;
    private currentTemplate:Template;

    private defaultSettings:any = {constellations:true, date:false, time:false, place:false, border:true, circle:true, coordinates:false};

    constructor(view:TemplateEditorView){
        this.view = view;
    }
    
    public onTemplateChanged(template:Template):void{
        this.currentTemplate = template;
        this.view.reset(this.defaultSettings);
        this.view.setData(template);
    }
}
