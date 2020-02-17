///<reference path="TemplatesListView.ts"/>
///<reference path="../Template.ts"/>
var TemplatesListModel = (function () {
    function TemplatesListModel(view) {
        this.view = view;
    }
    TemplatesListModel.prototype.onCollectionLoaded = function (collection) {
        this.view.setData(collection);
    };
    return TemplatesListModel;
}());
//# sourceMappingURL=TemplatesListModel.js.map