///<reference path="TemplateElementView.ts"/>
///<reference path="../Template.ts"/>
class TemplateElementModel{
    
    private view:TemplateElementView;    
    
    constructor(view:TemplateElementView){
        this.view = view;
    }
    
    public setData(data:Template):void{
        this.view.setData(data);
    }
}
