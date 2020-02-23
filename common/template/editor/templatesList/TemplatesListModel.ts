///<reference path="TemplatesListView.ts"/>
///<reference path="../Template.ts"/>
class TemplatesListModel{
    
    private view:TemplatesListView;
    
    constructor(view:TemplatesListView){
        this.view = view;
    }

    public onCollectionLoaded(collection:List<Template>):void {
        this.view.setData(collection);
    }
}
