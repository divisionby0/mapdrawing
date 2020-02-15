///<reference path="TemplateElementView.ts"/>
///<reference path="../Template.ts"/>
var TemplateElementModel = (function () {
    function TemplateElementModel(view) {
        this.view = view;
    }
    TemplateElementModel.prototype.setData = function (data) {
        this.view.setData(data);
    };
    return TemplateElementModel;
}());
//# sourceMappingURL=TemplateElementModel.js.map