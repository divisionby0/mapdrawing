///<reference path="CityTemplateLayer.ts"/>
class MapCityTemplateLayer extends CityTemplateLayer{
    
    constructor(id:string, aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean, textAlign:string, fontWeight:string){
        super(id, aspectRatio, type,  text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
    }

    protected onCityChanged(data:any):void {
        var city:string = data.city;
        
        if(city!=""){
            this.text = city;
        }
    }
}
