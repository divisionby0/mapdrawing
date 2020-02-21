class TemplateLayer{
    
    
    protected left:any;
    protected top:any;
    protected right:any;
    protected bottom:any;
    
    protected id:string;
    protected changeable:boolean;
    protected type:string;
    protected aspectRatio:number;

    constructor(id:string, aspectRatio:number, type:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean){
        this.id = id;
        this.aspectRatio = aspectRatio;
        this.type = type;
        this.left = left;
        this.top = top;
        this.right = right;
        this.bottom = bottom;
        this.changeable = changeable;
    }
    
    public getId():string{
        return this.id;
    }
    
    public isChangeable():boolean{
        return this.changeable;
    }
    
    public hasLeft():boolean{
        if(this.left!=null && this.left!=undefined && this.left!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasTop():boolean{
        if(this.top!=null && this.top!=undefined && this.top!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasRight():boolean{
        if(this.right!=null && this.right!=undefined && this.right!=""){
            return true;
        }
        else{
            return false;
        }
    }
    public hasBottom():boolean{
        if(this.bottom!=null && this.bottom!=undefined && this.bottom!=""){
            return true;
        }
        else{
            return false;
        }
    }
    
    public getTop():string{
        return this.top;
    }
    public getLeft():string{
        return this.left;
    }
    public getRight():string{
        return this.right;
    }
    public getBottom():string{
        return this.bottom;
    }
    public getType():string{
        return this.type;
    }
    
    public getAspectRatio():number{
        return this.aspectRatio;
    }
}
