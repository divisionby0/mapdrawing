///<reference path="TemplateLayer.ts"/>
class ImageTemplateLayer extends TemplateLayer{
    
    private url:string;
    
    constructor(aspectRatio:number, type:string, url:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false){
        super(aspectRatio, type, left, top, right, bottom, changeable);
        this.url = url;
    }
    
    public getUrl():string{
        return this.url;
    }
}
