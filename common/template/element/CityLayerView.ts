///<reference path="TextLayerView.ts"/>
class CityLayerView extends TextLayerView{

    protected onDestroy() {
    }
    
    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCityChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_1_CHANGED, (data)=>this.onCityTextChanged(data));
        EventBus.addEventListener(EditorEvent.CITY_VISIBILITY_CHANGED, (data)=>this.onCityVisibilityChanged(data));
    }

    private onCityTextChanged(text:string):void{
        this.layerContainer.text(text);
    }
    
    protected onCityChanged(data:any):void {
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
