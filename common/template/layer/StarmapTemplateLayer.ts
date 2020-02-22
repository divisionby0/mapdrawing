///<reference path="TemplateLayer.ts"/>
class StarmapTemplateLayer extends TemplateLayer{
    private starsColor:string;
    private backgroundColor:string;
    private constellationColor:string;
    private borderColor:string;
    private borderWeight:number;
    private borderVisible:boolean = true;
    private hasMulticoloredStars:boolean = false;

    private cachedBorderColor:string;
    private cachedConstellationColor:string;

    constructor(id:string, aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = false, color:string = "0", backgroundColor:string, constellationColor:string, borderColor:string, borderWeight:number){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);
        this.starsColor = color;
        this.backgroundColor = backgroundColor;
        this.constellationColor = constellationColor;
        this.borderColor = borderColor;
        this.borderWeight = borderWeight;
        
        this.cachedBorderColor = borderColor;
        this.cachedConstellationColor = constellationColor;
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
    
    public hasBorder():boolean{
        return this.borderVisible;
    }
    
    public setBorderVisible(visible:boolean):void{
        this.borderVisible = visible;

        if(visible){
            this.borderColor = this.cachedBorderColor
        }
        else{
            this.borderColor = "rgba(0,0,0,0)";
        }
    }

    public setConstellationVisible(visible:boolean):void{
        if(visible){
            this.constellationColor = this.cachedConstellationColor
        }
        else{
            this.constellationColor = "rgba(0,0,0,0)";
        }
    }

    public getHasMulticoloredStars():boolean{
        return this.hasMulticoloredStars;
    }
    public setStarsMulticolored(isMulticolored:boolean):void{
        this.hasMulticoloredStars = isMulticolored;
    }
    
}
