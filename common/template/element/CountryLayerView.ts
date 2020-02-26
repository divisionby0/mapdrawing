///<reference path="CityLayerView.ts"/>
class CountryLayerView extends CityLayerView{

    constructor(j$:any, layer:TemplateLayer, parentId:string, selfId:string, templateSizeProvider:ITemplateSizeProvider, coeff:number){
        super(j$, layer, parentId, selfId,  templateSizeProvider, coeff);
    }

    protected onCityChanged(data:any):void {
        console.log("onCityChanged data=",data);
        var country:string = data.country;
        this.layerContainer.text(country);
    }
}
