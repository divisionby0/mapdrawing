///<reference path="TemplatesListModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
var TemplatesListController = (function () {
    function TemplatesListController(model, collection) {
        this.model = model;
        this.model.onCollectionLoaded(collection);
    }
    return TemplatesListController;
}());
//# sourceMappingURL=TemplatesListController.js.map