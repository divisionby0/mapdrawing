///<reference path="TemplateLayer.ts"/>
class StarmapTemplateLayer extends TemplateLayer{
    private color:string;
    private backgroundColor:string;
    
    constructor(aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false, color:string = "0", backgroundColor:string){
        super(aspectRatio, type, left, top, right, bottom, changeable);
        this.color = color;
        this.backgroundColor = backgroundColor;
    }

    public hasBackgroundColor():boolean{
        if(this.backgroundColor!=null && this.backgroundColor!=undefined && this.backgroundColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public getBackgroundColor():string{
        return this.backgroundColor;
    }

    public getColor():string{
        return this.color;
    }
}
