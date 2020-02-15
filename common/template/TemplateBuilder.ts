///<reference path="Template.ts"/>
///<reference path="element/TemplateElementView.ts"/>
///<reference path="element/TemplateElementModel.ts"/>
///<reference path="element/TemplateElementController.ts"/>
class TemplateBuilder{
    private j$:any;
    private data:Template;
    private parentContainerId:string;
    private selfContainerId:string;
    
    constructor(j$:any, data:Template, parentContainerId:string, selfContainerId:string){
        this.j$ = j$;
        this.data = data;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        
        this.build();
    }
    
    private build():void{
        var view:TemplateElementView = new TemplateElementView(this.j$, this.parentContainerId, this.selfContainerId);
        var model:TemplateElementModel = new TemplateElementModel(view);
        new TemplateElementController(model, this.data);
    }
}

