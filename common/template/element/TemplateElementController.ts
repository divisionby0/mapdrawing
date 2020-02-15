///<reference path="TemplateElementModel.ts"/>
///<reference path="../Template.ts"/>
class TemplateElementController{
    
    private model:TemplateElementModel;
    
    constructor(model:TemplateElementModel, data:Template){
        this.model = model;
        
        this.model.setData(data);
    }
}
