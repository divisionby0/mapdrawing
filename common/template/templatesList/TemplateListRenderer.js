///<reference path="../Template.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
var TemplateListRenderer = (function () {
    function TemplateListRenderer(j$, parent, data, index) {
        this.j$ = j$;
        this.parent = parent;
        this.data = data;
        this.index = index;
        this.createChildren();
        this.createListener();
    }
    TemplateListRenderer.prototype.createChildren = function () {
        var parentContainer = this.j$("#" + this.parent);
        var imageContainer = this.j$("<div class='col-md-4' style='padding: 1.2em!important;'></div>");
        this.imageElement = this.j$("<img src='" + this.data.getPreview() + "' style='width: 100%;'>");
        this.imageElement.appendTo(imageContainer);
        imageContainer.appendTo(parentContainer);
    };
    TemplateListRenderer.prototype.createListener = function () {
        var _this = this;
        this.imageElement.click(function () { return _this.onClicked(); });
    };
    TemplateListRenderer.prototype.onClicked = function () {
        EventBus.dispatchEvent("TEMPLATE_SELECTED", this.index);
    };
    TemplateListRenderer.NORMAl = "NORMAL";
    TemplateListRenderer.SELECTED = "SELECTED";
    return TemplateListRenderer;
}());
//# sourceMappingURL=TemplateListRenderer.js.map