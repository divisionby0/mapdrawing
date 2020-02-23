///<reference path="TemplatesListView.ts"/>
///<reference path="TemplatesListModel.ts"/>
///<reference path="TemplatesListController.ts"/>
///<reference path="../../Template.ts"/>
var TemplatesList = (function () {
    function TemplatesList(j$, collection) {
        console.log("new TemplatesList ");
        var templatesListView = new TemplatesListView(j$);
        var templatesListModel = new TemplatesListModel(templatesListView);
        new TemplatesListController(templatesListModel, collection);
    }
    return TemplatesList;
}());
//# sourceMappingURL=TemplatesList.js.map