///<reference path="CountryLayerView.ts"/>
///<reference path="../layer/MapCountryTemplateLayer.ts"/>
class MapCountryLayerView extends CountryLayerView{
    
    protected onCountryTextChanged(text:string):void{
        this.layerContainer.text(text.toUpperCase());
    }

    protected onCountryChanged(data:any):void {
        var country:string = data.country;
        this.layerContainer.text(country.toUpperCase());
    }
    
    
    protected create():void{
        this.style="";

        this.id = this.layer.getId();
        var text:string = (this.layer as MapCountryTemplateLayer).getText();
        var color:string = (this.layer as MapCountryTemplateLayer).getColor();
        var fontSize:string = (this.layer as MapCountryTemplateLayer).getFontSize();
        var fontWeight:string = (this.layer as MapCountryTemplateLayer).getFontWeight();

        var textAlign:string = (this.layer as MapCountryTemplateLayer).getTextAlign();

        if(fontWeight==null || fontWeight==undefined || fontWeight==""){
            fontWeight="normal";
        }
        if(textAlign==null || textAlign==undefined || textAlign==""){
            textAlign="center";
        }

        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);

        this.style+="color:"+color+"; font-size:"+fontSize+"; text-align:"+textAlign+"; font-weight:"+fontWeight+";";
        this.layerContainer = this.j$("<div id='"+this.id+"' style='"+this.style+"' class='mapLabel'>"+text+"</div>");

        var labelsContainer:any;

        if(this.coeff==1){
            labelsContainer = this.j$(".labelsContainer");
        }
        else{
            labelsContainer = this.j$(".labelsContainer")[1];
        }
        
        this.layerContainer.appendTo(labelsContainer);
    }
}
