///<reference path="TextTemplateLayer.ts"/>
///<reference path="../editor/EditorEvent.ts"/>
///<reference path="../../lib/events/EventBus.ts"/>
class CountryTemplateLayer extends TextTemplateLayer{

    constructor(id:string, aspectRatio:number, type:string, text:string, color:string, fontSize:string, left:any = null, top:any = null, right:any = null, bottom:any = null, changeable:boolean, textAlign:string, fontWeight:string){
        super(id, aspectRatio, type,  text, color, fontSize, left, top, right, bottom, changeable, textAlign, fontWeight);
        this.createListener();
    }


    protected createListener() {
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, (text)=>this.onText_2_changed(text));
    }

    private onText_2_changed(text:string):void {
        this.text = text.toUpperCase();
    }

    private onCityChanged(data:any):void {
        console.log("Country template layer onCityChanged");
        var country:string = data.country;
        if(country && country!=""){
            this.text = country.toUpperCase();
        }
    }
}
