///<reference path="CountryTemplateLayer.ts"/>
class MapCountryTemplateLayer extends CountryTemplateLayer{
    
    protected onCityChanged(data:any):void {
        var country:string = data.country;
        if(country && country!=""){
            this.text = country.toUpperCase();
        }
        else if(country==""){
            this.text = "";
        }
    }
}
