///<reference path="Template.ts"/>
///<reference path="element/TemplateElementView.ts"/>
///<reference path="element/TemplateElementModel.ts"/>
///<reference path="element/TemplateElementController.ts"/>
///<reference path="editor/EditorEvent.ts"/>
///<reference path="../lib/events/EventBus.ts"/>
class TemplateBuilder{
    private j$:any;
    private data:Template;
    private parentContainerId:string;
    private selfContainerId:string;
    private coeff:number;
    
    constructor(j$:any, data:Template, parentContainerId:string, selfContainerId:string, coeff:number){
        this.j$ = j$;
        this.data = data;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        this.coeff = coeff;
        
        this.build();
    }
    
    private build():void{
        var view:TemplateElementView = new TemplateElementView(this.j$, this.parentContainerId, this.selfContainerId, this.coeff);
        var model:TemplateElementModel = new TemplateElementModel(view);
        new TemplateElementController(model, this.data);
    }
}

