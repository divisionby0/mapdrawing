///<reference path="layer/TemplateLayer.ts"/>
var Template = (function () {
    function Template(name, preview, width, height, layers, aspectRatio) {
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    Template.prototype.getPreview = function () {
        return this.preview;
    };
    Template.prototype.getLayersIterator = function () {
        return this.layers.getIterator();
    };
    Template.prototype.getPrintWidth = function () {
        return this.width;
    };
    Template.prototype.getPrintHeight = function () {
        return this.height;
    };
    Template.prototype.getAspectRatio = function () {
        return this.aspectRatio;
    };
    return Template;
}());
//# sourceMappingURL=Template.js.map