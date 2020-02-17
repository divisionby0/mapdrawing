///<reference path="TemplatesListModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
var TemplatesListController = (function () {
    function TemplatesListController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener("ON_TEMPLATES_LOADED", function (collection) { return _this.onTemplatesLoaded(collection); });
    }
    TemplatesListController.prototype.onTemplatesLoaded = function (collection) {
        console.log("onTemplatesLoaded");
        this.model.onCollectionLoaded(collection);
    };
    return TemplatesListController;
}());
//# sourceMappingURL=TemplatesListController.js.map