///<reference path="TemplateEditorView.ts"/>
///<reference path="TemplateEditorModel.ts"/>
///<reference path="TemplateEditorController.ts"/>
///<reference path="templatesList/TemplatesList.ts"/>
///<reference path="../Template.ts"/>
///<reference path="../TemplateBuilder.ts"/>
///<reference path="datetime/DateTimeSelector.ts"/>
class TemplateEditor{
    private j$:any;
    private currentTemplateIndex:number = 0;
    private controller:TemplateEditorController;
    private currentTemplate:Template;
    private templateCollection:List<Template>;
    
    constructor(j$:any){
        this.j$ = j$;
        
        var view:TemplateEditorView = new TemplateEditorView(j$);
        var model:TemplateEditorModel = new TemplateEditorModel(view);
        this.controller = new TemplateEditorController(model);
        
        this.createListener();
    }
    
    public setTemplates(collection:List<Template>):void{
        this.templateCollection = collection;
        this.createList(this.j$);
        
        this.currentTemplate = this.templateCollection.get(this.currentTemplateIndex);
        this.controller.changeTemplate(this.currentTemplate);

        this.createTemplateElement("templateElement", "planicanvaZZ", 1);

        this.createSearchCity();
        this.createDateTimeSelector();

        EventBus.dispatchEvent("UPDATE_STARMAP", null);
    }

    private createList(j$:any):void {
        new TemplatesList(j$, this.templateCollection);
    }

    protected onTemplateSelected(index:number):void{
        
        if(index==this.currentTemplateIndex){
            return;
        }
        this.currentTemplateIndex = index;
        this.currentTemplate = this.templateCollection.get(this.currentTemplateIndex);
        
        this.controller.changeTemplate(this.currentTemplate);
        this.createTemplateElement("templateElement", "planicanvaZZ", 1);
    }
    
    private createTemplateElement(elementId:string, selfContainerId:string, coeff:number):void{
        new TemplateBuilder(this.j$, this.currentTemplate, elementId, selfContainerId, coeff);
    }
    
    private createListener():void {
        EventBus.addEventListener(Template.ON_SELECT, (index)=>this.onTemplateSelected(index));
    }

    private createSearchCity():void {
        
    }

    protected createDateTimeSelector():void {
        new DateTimeSelector(this.j$);
    }
}
