///<reference path="TemplateLayer.ts"/>
class TextTemplateLayer extends TemplateLayer{
    protected text:string;
    protected color:string;
    protected fontSize:string;
    protected textAlign:string;
    protected fontWeight:string;
    protected visible:boolean = true;
    
    constructor(id:string, aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean = true, textAlign:string, fontWeight:string){
        super(id, aspectRatio, type,  left, top, right, bottom, changeable);
        this.text = text;
        this.color = color;
        this.fontSize = fontSize;
        this.textAlign = textAlign;
        this.fontWeight = fontWeight;
    }
    
    public isVisible():boolean{
        return this.visible;
    }
    
    public getText():string{
        return this.text;
    }
    public setText(text:string):void{
        this.text = text;
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
    public getFontWeight():string{
        return this.fontWeight;
    }
}
