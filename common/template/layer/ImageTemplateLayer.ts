///<reference path="TemplateLayer.ts"/>
class ImageTemplateLayer extends TemplateLayer{
    
    private url:string;
    
    constructor(id:string, aspectRatio:number, type:string, url:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        this.url = url;
        console.log("ImageTemplateLayer this.url="+this.url);
    }
    
    public getUrl():string{
        return this.url;
    }
}
