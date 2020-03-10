///<reference path="CityLayerView.ts"/>
///<reference path="../layer/MapCityTemplateLayer.ts"/>
class MapCityLayerView extends CityLayerView{

    protected onCityTextChanged(text:string):void{
        this.layerContainer.text(text.toUpperCase());
    }

    protected onCityChanged(data:any):void {
        var city:string = data.city;
        this.layerContainer.text(city.toUpperCase());
    }
    
    protected create():void{
        this.style="";
        
        this.id = this.layer.getId();
        var text:string = (this.layer as MapCityTemplateLayer).getText();
        var color:string = (this.layer as MapCityTemplateLayer).getColor();
        var fontSize:string = (this.layer as MapCityTemplateLayer).getFontSize();
        var fontWeight:string = (this.layer as MapCityTemplateLayer).getFontWeight();

        var textAlign:string = (this.layer as MapCityTemplateLayer).getTextAlign();
        
        if(fontWeight==null || fontWeight==undefined || fontWeight==""){
            fontWeight="normal";
        }
        if(textAlign==null || textAlign==undefined || textAlign==""){
            textAlign="center";
        }

        fontSize = Utils.updateFontSizeString(fontSize, this.coeff);

        this.style+="color:"+color+"; font-size:"+fontSize+"; text-align:"+textAlign+"; font-weight:"+fontWeight+";";
        this.layerContainer = this.j$("<div id='"+this.id+"' style='"+this.style+"' class='mapLabel'>"+text.toUpperCase()+"</div>");

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
