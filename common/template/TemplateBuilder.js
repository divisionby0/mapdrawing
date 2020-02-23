///<reference path="Template.ts"/>
///<reference path="element/TemplateElementView.ts"/>
///<reference path="element/TemplateElementModel.ts"/>
///<reference path="element/TemplateElementController.ts"/>
///<reference path="editor/EditorEvent.ts"/>
///<reference path="../lib/events/EventBus.ts"/>
var TemplateBuilder = (function () {
    function TemplateBuilder(j$, data, parentContainerId, selfContainerId, coeff) {
        this.j$ = j$;
        this.data = data;
        this.parentContainerId = parentContainerId;
        this.selfContainerId = selfContainerId;
        this.coeff = coeff;
        this.build();
    }
    TemplateBuilder.prototype.destroy = function () {
        this.controller.destroy();
    };
    TemplateBuilder.prototype.build = function () {
        var view = new TemplateElementView(this.j$, this.parentContainerId, this.selfContainerId, this.coeff);
        var model = new TemplateElementModel(view);
        this.controller = new TemplateElementController(model, this.data);
    };
    return TemplateBuilder;
}());
//# sourceMappingURL=TemplateBuilder.js.map