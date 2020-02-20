///<reference path="TemplateEditorModel.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../Template.ts"/>
var TemplateEditorController = (function () {
    function TemplateEditorController(model) {
        var _this = this;
        this.model = model;
        EventBus.addEventListener("TEMPLATE_CHANGED", function (template) { return _this.onTemplateChanged(template); });
    }
    TemplateEditorController.prototype.onTemplateChanged = function (template) {
        this.model.onTemplateChanged(template);
    };
    return TemplateEditorController;
}());
//# sourceMappingURL=TemplateEditorController.js.map