///<reference path="../Template.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class TemplateListRenderer{
    private j$:any;
    private parent:string;
    private data:Template;

    public static NORMAl:string = "NORMAL";
    public static SELECTED:string = "SELECTED";

    private state:string;

    private index:number;
    private imageElement:any;
    
    constructor(j$:any, parent:string, data:Template, index:number){
        this.j$ = j$;
        this.parent = parent;
        this.data = data;

        this.index = index;
        
        this.createChildren();
        this.createListener();
    }

    private createChildren():void {
        var parentContainer:any = this.j$("#"+this.parent);
        
        var imageContainer:any = this.j$("<div class='col-md-4' style='padding: 1.2em!important;'></div>");
        this.imageElement = this.j$("<img src='"+this.data.getPreview()+"' style='width: 100%;'>");
        
        this.imageElement.appendTo(imageContainer);
        imageContainer.appendTo(parentContainer);
    }

    private createListener():void {
        this.imageElement.click(()=>this.onClicked());
    }

    private onClicked() {
        EventBus.dispatchEvent(Template.ON_SELECT, this.index)
    }
}
