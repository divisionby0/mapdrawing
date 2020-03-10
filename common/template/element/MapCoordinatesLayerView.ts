///<reference path="CoordinatesLayerView.ts"/>
class MapCoordinatesLayerView extends CoordinatesLayerView{
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
        this.layerContainer = this.j$("<div id='"+this.id+"' style='"+this.style+"' class='mapLabel'>"+text+"</div>");

        //var labelsContainer:any = this.j$(".labelsContainer");


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