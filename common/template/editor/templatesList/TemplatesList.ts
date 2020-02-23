///<reference path="TemplatesListView.ts"/>
///<reference path="TemplatesListModel.ts"/>
///<reference path="TemplatesListController.ts"/>
///<reference path="../../Template.ts"/>
class TemplatesList{
    constructor(j$:any, collection:List<Template>){
        console.log("new TemplatesList ");
        var templatesListView:TemplatesListView = new TemplatesListView(j$);
        var templatesListModel:TemplatesListModel = new TemplatesListModel(templatesListView);
        new TemplatesListController(templatesListModel, collection);
    }
}
