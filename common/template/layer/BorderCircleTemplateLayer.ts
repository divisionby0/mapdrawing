///<reference path="TemplateLayer.ts"/>
class BorderCircleTemplateLayer extends TemplateLayer{
    private radius:string;
    private width:string;
    private color:string;
    private border:string;

    constructor(id:string, aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean, radius:string = "0", width:any = "0", color:string = "0", border:string = ""){
        super(id, aspectRatio, type, left, top, right, bottom, changeable);

        this.radius = radius;
        this.width = width;
        this.color = color;
        this.border = border;
    }

    public getRadius():string{
        return this.radius;
    }

    public getWidth():string{
        return this.width;
    }
    
    public getColor():string{
        return this.color;
    }
    
    public getBorder():string{
        return this.border;
    }
}
