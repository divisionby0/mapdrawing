///<reference path="TextLayerView.ts"/>
class CityLayerView extends TextLayerView{

    protected onDestroy() {
    }
    
    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onCityTextChanged(data));
        EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, (data)=>this.onCityVisibilityChanged(data));
    }

    protected onCityTextChanged(text:string):void{
        this.layerContainer.text(text.toUpperCase());
    }
    
    protected onCityChanged(data:any):void {
        var city:string = data.city;
        this.layerContainer.text(city.toUpperCase());
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
