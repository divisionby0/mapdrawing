///<reference path="../templatesList/TemplatesListView.ts"/>
///<reference path="../templatesList/TemplatesListModel.ts"/>
///<reference path="../templatesList/TemplatesListController.ts"/>
class TemplatesList{
    constructor(j$:any){
        var templatesListView:TemplatesListView = new TemplatesListView(j$);
        var templatesListModel:TemplatesListModel = new TemplatesListModel(templatesListView);
        new TemplatesListController(templatesListModel);
    }
}
