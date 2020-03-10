///<reference path="DivLayerView.ts"/>
class LabelsContainerLayerView extends DivLayerView{
    protected createContainer():void{
        this.layerContainer = this.j$("<div id='"+this.layer.getId()+"' style='"+this.style+"' class='labelsContainer'></div>");
        this.layerContainer.appendTo(this.j$("#"+this.parentId));
    }
}
