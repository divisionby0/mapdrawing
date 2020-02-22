///<reference path="TextTemplateLayer.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
class CityTemplateLayer extends TextTemplateLayer{
    
    constructor(id:string, aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean, textAlign:string, fontWeight:string){
        super(id, aspectRatio, type,  text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.createListener();
    }
    
    protected createListener() {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, (data)=>this.onCityVisibilityChanged(data));
    }
    
    private onCityChanged(data:any):void {
        var city:string = data.city;
        this.text = city;
    }

    private onCityVisibilityChanged(data:any):void {
        this.visible = data.visible;
    }
}
