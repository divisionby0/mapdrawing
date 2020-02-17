///<reference path="layer/TemplateLayer.ts"/>
class Template{
    private width:number;
    private height:number;
    private name:string;
    private preview:string;
    private aspectRatio:any;
    
    private layers:List<TemplateLayer>;
    
    constructor(name:string, preview:string, width:number, height:number, layers:List<TemplateLayer>, aspectRatio:any){
        this.name = name;
        this.preview = preview;
        this.width = width;
        this.height = height;
        this.layers = layers;
        this.aspectRatio = aspectRatio;
    }
    
    public getPreview():string{
        return this.preview;
    }
    
    public getLayersIterator():ListIterator{
        return this.layers.getIterator();
    }
    
    public getPrintWidth():number{
        return this.width;
    }
    public getPrintHeight():number{
        return this.height;
    }
    
    public getAspectRatio():string{
        return this.aspectRatio;
    }
}
