///<reference path="ImageTemplateLayer.ts"/>
class BlobImageTemplateLayer extends ImageTemplateLayer{
    
    private border:string;
    
    constructor(id:string, aspectRatio:number, type:string, url:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false, border:string){
        super(id, aspectRatio, type, url, left, top, right, bottom, changeable);
        this.border = border;
    }
    
    public getBorder():string{
        return this.border;
    }
}
