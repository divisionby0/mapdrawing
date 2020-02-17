///<reference path="TemplatesListModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
class TemplatesListController{
    private model:TemplatesListModel;
    constructor(model:TemplatesListModel){
        this.model = model;
        EventBus.addEventListener("ON_TEMPLATES_LOADED",(collection)=>this.onTemplatesLoaded(collection))
    }

    private onTemplatesLoaded(collection:List<Template>):void {
        console.log("onTemplatesLoaded");
        this.model.onCollectionLoaded(collection);
    }
}
