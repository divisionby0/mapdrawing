///<reference path="../Parameter.ts"/>
///<reference path="BorderSccBuilder.ts"/>
class Border{
    private weight:Parameter;
    private color:string;
    private rest:any[];
    constructor(weight:Parameter, color:string, rest:any[]){
        this.weight = weight;
        this.color = color;
        this.rest = rest;
    }
    
    public getWeight():Parameter{
        return this.weight;
    }
    public setWeight(value:string):void{
        this.weight.setValue(value);
    }
    
    public getColor():string{
        return this.color;
    }
    
    public getRest():any[]{
        return this.rest;
    }
    
    public toCssString():string{
        return BorderSccBuilder.build(this);
    }
}
