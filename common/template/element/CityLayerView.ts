///<reference path="TextLayerView.ts"/>
class CityLayerView extends TextLayerView{
    
    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, (data)=>this.onCityVisibilityChanged(data));
    }

    private onCityChanged(data:any):void {
        var city:string = data.city;
        this.layerContainer.text(city);
    }

    private onCityVisibilityChanged(data:any):void {
        var visible:boolean = data.visible;
        
        if(visible){
            this.layerContainer.show();
        }
        else{
            this.layerContainer.hide();
        }
    }
}
