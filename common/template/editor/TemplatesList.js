///<reference path="../templatesList/TemplatesListView.ts"/>
///<reference path="../templatesList/TemplatesListModel.ts"/>
///<reference path="../templatesList/TemplatesListController.ts"/>
var TemplatesList = (function () {
    function TemplatesList(j$) {
        var templatesListView = new TemplatesListView(j$);
        var templatesListModel = new TemplatesListModel(templatesListView);
        new TemplatesListController(templatesListModel);
    }
    return TemplatesList;
}());
//# sourceMappingURL=TemplatesList.js.map