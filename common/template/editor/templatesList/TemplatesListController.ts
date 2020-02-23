///<reference path="TemplatesListModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
class TemplatesListController{
    private model:TemplatesListModel;
    
    constructor(model:TemplatesListModel, collection:List<Template>){
        this.model = model;
        this.model.onCollectionLoaded(collection);
    }
}
