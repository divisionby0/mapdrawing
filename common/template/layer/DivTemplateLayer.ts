///<reference path="TemplateLayer.ts"/>
class DivTemplateLayer extends TemplateLayer{

    private border:string;
    private backgroundColor:string;
    private backgroundAlpha:string;
    
    constructor(id:string, aspectRatio:number, type:string, left:any, top:any, right:any = null, bottom:any = null, changeable:boolean = true,  backgroundColor:string = "", backgroundAlpha:string = "", border:string = ""){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);

        this.backgroundColor = backgroundColor;
        this.backgroundAlpha = backgroundAlpha;
        this.border = border;
    }

    public hasBackgroundColor():boolean{
        if(this.backgroundColor!=null && this.backgroundColor!=undefined && this.backgroundColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasBackgroundAlpha():boolean{
        if(this.backgroundAlpha!=null && this.backgroundAlpha!=undefined && this.backgroundAlpha!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasBorder():boolean{
        if(this.border!=null && this.border!=undefined && this.border!=""){
            return true;
        }
        else{
            return false;
        }
    }

    public getBackgroundColor():string{
        return this.backgroundColor;
    }
    public getBackgroundAlpha():string{
        return this.backgroundAlpha;
    }
    public getBorder():string{
        return this.border;
    }
    public setBorder(border:string):void{
        this.border = border;
    }
}
