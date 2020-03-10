///<reference path="TextLayerView.ts"/>
class CountryLayerView extends TextLayerView{

    protected createListeners():void{
        EventBus.addEventListener(EditorEvent.CITY_CHANGED, (data)=>this.onCountryChanged(data));
        EventBus.addEventListener(EditorEvent.TEXT_2_CHANGED, (data)=>this.onCountryTextChanged(data));
    }
    protected onCountryTextChanged(text:string):void{
        this.layerContainer.text(text.toUpperCase());
    }

    protected onCountryChanged(data:any):void {
        var country:string = data.country;
        this.layerContainer.text(country.toUpperCase());
    }
}
