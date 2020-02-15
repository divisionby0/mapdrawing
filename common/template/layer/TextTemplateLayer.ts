///<reference path="TemplateLayer.ts"/>
class TextTemplateLayer extends TemplateLayer{
    private text:string;
    private color:string;
    private fontSize:string;
    private textAlign:string;
    
    constructor(aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = true, textAlign:string = "center"){
        super(aspectRatio, type,  left, top, right, bottom, changeable);
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
    }
    
    public getText():string{
        return this.text;
    }
    public getColor():string{
        return this.color;
    }
    public getFontSize():string{
        return this.fontSize;
    }
    public getTextAlign():string{
        return this.textAlign;
    }
}
