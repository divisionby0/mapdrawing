class Parameter{
    private value:any;
    private points:string;
    
    constructor(value:any, points:string){
        this.value = value;
        this.points = points;
    }
    
    public getValue():any{
        return this.value;
    }
    public setValue(value:any):void{
        this.value = value;
    }
    
    public getPoints():string{
        return this.points;
    }
}
