///<reference path="TemplateListRenderer.ts"/>
///<reference path="../../Template.ts"/>
class TemplatesListView{
    
    private j$:any;
    private data:List<Template>;
    //private container:any;
    constructor(j$:any){
        this.j$ = j$;
        //this.container = this.j$("#templatesListContainer");
    }

    public setData(collection:List<Template>):void {
        this.data = collection;
        
        var counter:number = 0;
        var iterator:ListIterator = collection.getIterator();
        while(iterator.hasNext()){
            var template:Template = iterator.next();
            new TemplateListRenderer(this.j$, "templatesListContainer", template, counter);
            counter++;
        }
    }
}
