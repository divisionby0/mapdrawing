///<reference path="../Template.ts"/>
///<reference path="TemplateListRenderer.ts"/>
var TemplatesListView = (function () {
    function TemplatesListView(j$) {
        this.j$ = j$;
    }
    TemplatesListView.prototype.setData = function (collection) {
        this.data = collection;
        console.log("setData ", collection);
        var counter = 0;
        var iterator = collection.getIterator();
        while (iterator.hasNext()) {
            var template = iterator.next();
            new TemplateListRenderer(this.j$, "templatesListContainer", template, counter);
            counter++;
        }
    };
    return TemplatesListView;
}());
//# sourceMappingURL=TemplatesListView.js.map