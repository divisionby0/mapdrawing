///<reference path="../Template.ts"/>
///<reference path="TemplateListRenderer.ts"/>
var TemplatesListView = (function () {
    //private container:any;
    function TemplatesListView(j$) {
        this.j$ = j$;
        //this.container = this.j$("#templatesListContainer");
    }
    TemplatesListView.prototype.setData = function (collection) {
        this.data = collection;
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