///<reference path="Template.ts"/>
class MapTemplate extends Template{
    private country:string;
    
    public getCountry():string{
        return this.country;
    }
    
    public setCountry(country:string):void{
        this.country = country;
    }
}
