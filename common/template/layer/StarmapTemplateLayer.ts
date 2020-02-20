///<reference path="TemplateLayer.ts"/>
class StarmapTemplateLayer extends TemplateLayer{
    private starsColor:string;
    private backgroundColor:string;
    private constellationColor:string;
    private borderColor:string;
    private borderWeight:number;
    
    constructor(id:string, aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false, color:string = "0", backgroundColor:string, constellationColor:string, borderColor:string, borderWeight:number){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        this.starsColor = color;
        this.backgroundColor = backgroundColor;
        this.constellationColor = constellationColor;
        this.borderColor = borderColor;
        this.borderWeight = borderWeight;
    }

    public hasBackgroundColor():boolean{
        if(this.backgroundColor!=null && this.backgroundColor!=undefined && this.backgroundColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasConstellationColor():boolean{
        if(this.constellationColor!=null && this.constellationColor!=undefined && this.constellationColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    
    public hasStarsColor():boolean{
        if(this.starsColor!=null && this.starsColor!=undefined && this.starsColor!=""){
            return true;
        }
        else{
            return false;
        }
    }
    
    public getBackgroundColor():string{
        return this.backgroundColor;
    }

    public getStarsColor():string{
        return this.starsColor;
    }
    public getConstellationColor():string{
        return this.constellationColor;
    }
    
    public getBorderColor():string{
        return this.borderColor;
    }
    public getBorderWeight():number{
        return this.borderWeight;
    }
}
