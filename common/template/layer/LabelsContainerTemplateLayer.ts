///<reference path="DivTemplateLayer.ts"/>
class LabelsContainerTemplateLayer extends DivTemplateLayer{
    
    constructor(id:string, aspectRatio:number, type:string, left:any, top:any, right:any = null, bottom:any = null, changeable:boolean = true,  backgroundColor:string = "", backgroundAlpha:string = "", border:string = ""){
        super(id, aspectRatio, type, left, top, right, bottom, changeable, backgroundColor, backgroundAlpha, border);
    }
}
